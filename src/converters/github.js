/* ============================================================
   GitHub 链接解析与下载
   ============================================================ */

import { getRawMirror, RAW_MIRRORS, getDownloadProgress, saveDownloadProgress, clearDownloadProgress } from '../utils.js';

const GITHUB_URL_REGEX = /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/(blob|tree)\/([^\/]+)\/(.+)$/;

export function parseGitHubUrl(url) {
  const m = url.trim().match(GITHUB_URL_REGEX);
  if (!m) return null;
  return { owner: m[1], repo: m[2], type: m[3], branch: m[4], path: m[5] };
}

export function isGitHubUrl(url) {
  return GITHUB_URL_REGEX.test(url.trim());
}

/* 检查 GitHub API 速率限制 */
export async function checkRateLimit() {
  try {
    const r = await fetch('https://api.github.com/rate_limit');
    const d = await r.json();
    return {
      limit: d.resources.core.limit,
      remaining: d.resources.core.remaining,
      reset: d.resources.core.reset
    };
  } catch { return null; }
}

/* 构建 raw URL（支持镜像源） */
function buildRawUrl(owner, repo, branch, path) {
  const mirrorKey = getRawMirror();
  if (mirrorKey === 'github') {
    return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
  }
  const mirror = RAW_MIRRORS[mirrorKey];
  return `${mirror.url}/${owner}/${repo}/${branch}/${path}`;
}

/* 下载单个文件（走 raw，不耗 API） */
export async function downloadGitHubFile(info, signal) {
  const raw = buildRawUrl(info.owner, info.repo, info.branch, info.path);
  const resp = await fetch(raw, { signal });
  if (!resp.ok) throw new Error(`下载失败 HTTP ${resp.status}`);
  const blob = await resp.blob();
  const filename = decodeURIComponent(info.path).split('/').pop();
  return { blob, filename };
}

/* 递归获取文件夹内所有文件 */
async function walkTree(owner, repo, branch, path, prefix, out, signal) {
  const api = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
  const resp = await fetch(api, { signal });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.message || `GitHub API ${resp.status}`);
  }

  const remain = resp.headers.get('X-RateLimit-Remaining');
  const limit  = resp.headers.get('X-RateLimit-Limit');
  if (remain && parseInt(remain) < 3) {
    const resetSec = parseInt(resp.headers.get('X-RateLimit-Reset') || '0');
    const waitMin = Math.max(1, Math.ceil((resetSec * 1000 - Date.now()) / 60000));
    throw new Error(`API 速率限制即将耗尽（剩余 ${remain}/${limit} 次/小时），请 ${waitMin} 分钟后再试`);
  }

  const items = await resp.json();
  const list = Array.isArray(items) ? items : [items];

  for (const it of list) {
    if (signal?.aborted) throw new Error('已取消');
    if (it.type === 'file') {
      out.push({ path: it.path, name: prefix ? `${prefix}/${it.name}` : it.name, size: it.size || 0 });
    } else if (it.type === 'dir') {
      await walkTree(owner, repo, branch, it.path, prefix ? `${prefix}/${it.name}` : it.name, out, signal);
    }
  }
}

/* 下载文件夹并打包为 ZIP（支持断点续传） */
export async function downloadGitHubFolder(info, onProgress, signal) {
  const downloadId = `${info.owner}/${info.repo}/${info.branch}/${info.path}`;
  const progress = await getDownloadProgress(downloadId);

  let files = [];
  let skipped = 0;

  if (progress && progress.files && progress.files.length > 0) {
    await walkTree(info.owner, info.repo, info.branch, info.path, '', files, signal);
    const doneSet = new Set(progress.files);
    files = files.filter(f => !doneSet.has(f.path));
    skipped = progress.files.length;
    if (onProgress) onProgress(skipped, skipped + files.length, 'resume');
  } else {
    await walkTree(info.owner, info.repo, info.branch, info.path, '', files, signal);
  }

  if (files.length === 0) {
    if (skipped > 0) {
      await clearDownloadProgress(downloadId);
      throw new Error('所有文件已下载完成');
    }
    throw new Error('文件夹为空');
  }

  if (!window.JSZip) {
    await new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }

  const zip = new window.JSZip();
  const folderName = decodeURIComponent(info.path).split('/').pop() || info.repo;
  let done = skipped;

  for (const f of files) {
    if (signal?.aborted) throw new Error('已取消');
    try {
      const raw = buildRawUrl(info.owner, info.repo, info.branch, f.path);
      const r = await fetch(raw, { signal });
      if (!r.ok) continue;
      const blob = await r.blob();
      zip.file(f.name, blob);
      done++;
      await saveDownloadProgress(downloadId, {
        owner: info.owner, repo: info.repo, branch: info.branch, path: info.path,
        files: [...(progress?.files || []), f.path]
      });
      if (onProgress) onProgress(done, skipped + files.length, f.name);
    } catch (e) {
      console.warn('skip', f.path, e.message);
    }
  }

  await clearDownloadProgress(downloadId);

  const blob = await zip.generateAsync({ type: 'blob' });
  return { blob, filename: `${folderName}.zip`, done, total: skipped + files.length };
}

/* ============================================================
   GitHub Release 资产下载
   ============================================================ */

const RELEASE_URL_REGEX = /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)(?:\/releases)?\/?$/;

export function parseReleaseUrl(url) {
  const m = url.trim().match(RELEASE_URL_REGEX);
  if (!m) return null;
  return { owner: m[1], repo: m[2] };
}

export function isReleaseUrl(url) {
  return RELEASE_URL_REGEX.test(url.trim());
}

export async function fetchReleases(owner, repo, signal) {
  const api = `https://api.github.com/repos/${owner}/${repo}/releases`;
  const resp = await fetch(api, { signal });
  if (!resp.ok) throw new Error(`获取 Release 失败 HTTP ${resp.status}`);
  return await resp.json();
}

export async function downloadReleaseAsset(asset, signal) {
  const resp = await fetch(asset.browser_download_url, { signal });
  if (!resp.ok) throw new Error(`下载失败 HTTP ${resp.status}`);
  const blob = await resp.blob();
  return { blob, filename: asset.name, size: asset.size };
}
