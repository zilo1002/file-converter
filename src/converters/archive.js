import { readAB, getExt } from '../utils.js';

export async function convArchive(file, target) {
  const ext = getExt(file.name);
  if (ext === 'zip' && target === 'zip') {
    const ab = await readAB(file);
    const zip = await JSZip.loadAsync(ab);
    const out = await zip.generateAsync({ type: 'blob' });
    return out;
  }
  if (ext === 'zip') {
    const ab = await readAB(file);
    const zip = await JSZip.loadAsync(ab);
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
 * 解压 ZIP 并按指定模式返回文件列表
 * @param {File} file - ZIP 文件
 * @param {string} mode - 'normal' 保持结构 | 'flat' 扁平化（无文件夹）
 * @returns {Promise<{type:'extracted', entries:Array}>}
 */
export async function extractZip(file, mode = 'normal') {
  const ab = await readAB(file);
  const zip = await JSZip.loadAsync(ab);
  const entries = [];

  for (const [path, entry] of Object.entries(zip.files)) {
    if (entry.dir) continue;
    const content = await entry.async('blob');

    let outPath = path;
    if (mode === 'flat') {
      // 扁平化：只保留文件名，去掉所有路径
      outPath = path.split('/').pop();
      // 处理重名：自动添加数字后缀
      let counter = 1;
      const baseName = outPath.replace(/\.[^.]+$/, '');
      const extPart = outPath.match(/\.[^.]+$/)?.[0] || '';
      while (entries.some(e => e.path === outPath)) {
        outPath = `${baseName}_${counter}${extPart}`;
        counter++;
      }
    }

    entries.push({ path: outPath, content, size: entry._data.uncompressedSize });
  }

  return { type: 'extracted', entries };
}

/**
 * 合并解压多个 ZIP 文件
 * 每个 ZIP 的内容放入以 ZIP 文件名命名的文件夹中（按文件名字母顺序）
 * @param {File[]} files - ZIP 文件数组
 * @returns {Promise<{type:'extracted', entries:Array}>}
 */
export async function mergeExtractZips(files) {
  const entries = [];
  // 按文件名字母顺序排序
  const sortedFiles = [...files].sort((a, b) => a.name.localeCompare(b.name));

  for (const file of sortedFiles) {
    const ab = await readAB(file);
    const zip = await JSZip.loadAsync(ab);
    const folderName = file.name.replace(/\.zip$/i, '');

    for (const [path, entry] of Object.entries(zip.files)) {
      if (entry.dir) continue;
      const content = await entry.async('blob');
      const fileName = path.split('/').pop();
      let outPath = `${folderName}/${fileName}`;

      // 处理重名冲突
      let counter = 1;
      const baseName = outPath.replace(/\.[^.]+$/, '');
      const extPart = outPath.match(/\.[^.]+$/)?.[0] || '';
      while (entries.some(e => e.path === outPath)) {
        outPath = `${baseName}_${counter}${extPart}`;
        counter++;
      }

      entries.push({ path: outPath, content, size: entry._data.uncompressedSize });
    }
  }

  return { type: 'extracted', entries };
}
