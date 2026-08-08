import { readData, getExt } from '../utils.js';
export async function convImage(file, target) {
  const ext = getExt(file.name);
  if (ext === 'svg') {
    if (target === 'svg') return file;
    const text = await file.text();
    const blob = new Blob([text], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    await new Promise((r, j) => { img.onload = r; img.onerror = j; img.src = url; });
    const c = document.createElement('canvas');
    c.width = img.naturalWidth || 800; c.height = img.naturalHeight || 600;
    const ctx = c.getContext('2d');
    if (target !== 'png') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height); }
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);
    const mime = target === 'jpg' ? 'image/jpeg' : 'image/' + target;
    const out = await new Promise(r => c.toBlob(r, mime, 0.92));
    return out;
  }
  const dataUrl = await readData(file);
  const img = new Image();
  await new Promise((r, j) => { img.onload = r; img.onerror = j; img.src = dataUrl; });
  const c = document.createElement('canvas');
  c.width = img.naturalWidth; c.height = img.naturalHeight;
  const ctx = c.getContext('2d');
  if (target !== 'png' && target !== 'webp' && target !== 'gif') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height); }
  ctx.drawImage(img, 0, 0);
  const mime = target === 'jpg' ? 'image/jpeg' : 'image/' + target;
  const out = await new Promise(r => c.toBlob(r, mime, target === 'webp' ? 0.85 : 0.92));
  if (!out) throw new Error('浏览器不支持导出此格式');
  return out;
}