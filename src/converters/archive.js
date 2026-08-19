import { readAB, getExt } from '../utils.js';

/**
 * 安全获取 JSZip 实例，防止全局未定义导致崩溃
 */
function getJSZip() {
  if (typeof JSZip !== 'undefined') return JSZip;
  if (typeof window !== 'undefined' && window.JSZip) return window.JSZip;
  throw new Error('JSZip library not loaded. Please ensure jszip.min.js is included.');
}

export async function convArchive(file, target) {
  const ext = getExt(file.name);
  if (ext === 'zip' && target === 'zip') {
    const ab = await readAB(file);
    const zip = await getJSZip().loadAsync(ab);
    const out = await zip.generateAsync({ type: 'blob' });
    return out;
  }
  if (ext === 'zip') {
    const ab = await readAB(file);
    const zip = await getJSZip().loadAsync(ab);
    const entries = [];
    for (const [path, entry] of Object.entries(zip.files)) {
      if (!entry.dir) {
        const content = await entry.async('blob');
        entries.push({ path, content, size: entry._data.uncompressedSize });
      }
    }
    return { type: 'extracted', entries };
  }
  throw new Error('仅支持 ZIP 格式');
}

/**
 * 辅助函数：生成唯一的文件路径，避免重名冲突
 */
function getUniquePath(entries, targetPath) {
  if (!entries.some(e => e.path === targetPath)) return targetPath;

  // 提取目录和文件名
  const lastSlashIndex = targetPath.lastIndexOf('/');
  const dir = lastSlashIndex !== -1 ? targetPath.slice(0, lastSlashIndex + 1) : '';
  const fullName = lastSlashIndex !== -1 ? targetPath.slice(lastSlashIndex + 1) : targetPath;

  // 分离文件名和扩展名
  const dotIndex = fullName.lastIndexOf('.');
  const baseName = dotIndex !== -1 ? fullName.slice(0, dotIndex) : fullName;
  const extPart = dotIndex !== -1 ? fullName.slice(dotIndex) : '';

  let counter = 1;
  let newPath = `${dir}${baseName}_${counter}${extPart}`;

  // 持续递增直到没有路径冲突
  while (entries.some(e => e.path === newPath)) {
    counter++;
    newPath = `${dir}${baseName}_${counter}${extPart}`;
  }
  return newPath;
}

/**
 * 解压 ZIP 并按指定模式返回文件列表
 * @param {File} file - ZIP 文件
 * @param {string} mode - 'normal' 保持结构 | 'flat' 扁平化（无文件夹）
 * @returns {Promise<{type:'extracted', entries:Array}>}
 */
export async function extractZip(file, mode = 'normal') {
  const ab = await readAB(file);
  const zip = await getJSZip().loadAsync(ab);
  const entries = [];

  for (const [path, entry] of Object.entries(zip.files)) {
    if (entry.dir) continue;
    const content = await entry.async('blob');

    let outPath = path;
    if (mode === 'flat') {
      outPath = path.split('/').pop();
    }

    // 自动冲突重命名
    outPath = getUniquePath(entries, outPath);
    entries.push({ path: outPath, content, size: entry._data.uncompressedSize });
  }

  return { type: 'extracted', entries };
}

/**
 * 合并解压多个 ZIP 文件
 * 每个 ZIP 的内容放入以 ZIP 文件名命名的文件夹中（按文件名字母顺序）
 * 保留 ZIP 内部原有的完整目录结构
 * @param {File[]} files - ZIP 文件数组
 * @returns {Promise<{type:'extracted', entries:Array}>}
 */
export async function mergeExtractZips(files) {
  const entries = [];
  const sortedFiles = [...files].sort((a, b) => a.name.localeCompare(b.name));

  for (const file of sortedFiles) {
    const ab = await readAB(file);
    const zip = await getJSZip().loadAsync(ab);
    const folderName = file.name.replace(/\.zip$/i, '');

    for (const [path, entry] of Object.entries(zip.files)) {
      if (entry.dir) continue;
      const content = await entry.async('blob');

      // 保持 ZIP 内部原有的完整相对路径，统一归入对应压缩包同名目录下
      let outPath = `${folderName}/${path}`;
      outPath = getUniquePath(entries, outPath);

      entries.push({ path: outPath, content, size: entry._data.uncompressedSize });
    }
  }

  return { type: 'extracted', entries };
}
