import {
  MAX_SIZE, CATEGORIES, getExt, getCat,
  fmtSize, dlBlob, sleep, readAB, readText,
  getSupportedTargets
} from './utils.js';
import { convImage } from './converters/image.js';
import { convData } from './converters/data.js';
import { convDoc } from './converters/document.js';
import { convArchive } from './converters/archive.js';
import { convEbook } from './converters/ebook.js';

let currentCat = null;
let files = [];
let converting = false;
const app = document.getElementById('app');

function render() {
  const hash = window.location.hash.replace('#','');
  if (CATEGORIES[hash]) {
    currentCat = hash;
    renderCategoryPage(hash);
  } else {
    currentCat = null;
    renderHome();
  }
}

function renderHome() {
  const cats = Object.values(CATEGORIES);
  let cards = '';
  for (const cat of cats) {
    const extsHtml = cat.exts.slice(0,6).map(e => '<span class="text-[10px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-500 uppercase">'+e+'</span>').join('');
    const moreHtml = cat.exts.length > 6 ? '<span class="text-[10px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-500">+'+(cat.exts.length-6)+'</span>' : '';
    cards += '<a href="#'+cat.id+'" class="group relative rounded-2xl bg-slate-800/30 border border-slate-700/40 hover:border-'+cat.color+'-500/40 p-6 transition-all duration-300 hover:bg-slate-800/50 active:scale-[0.98]">'+
      '<div class="absolute inset-0 rounded-2xl bg-gradient-to-br '+cat.bgGradient+' opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>'+
      '<div class="relative">'+
        '<div class="flex items-start justify-between mb-4">'+
          '<div class="w-14 h-14 rounded-2xl bg-'+cat.color+'-500/10 border border-'+cat.color+'-500/20 flex items-center justify-center text-3xl">'+cat.emoji+'</div>'+
          '<span class="text-xs font-medium '+cat.textColor+' bg-'+cat.color+'-500/10 px-2.5 py-1 rounded-full">'+cat.exts.length+' 种格式</span>'+
        '</div>'+
        '<h3 class="text-lg font-bold mb-1.5 group-hover:'+cat.textColor+' transition-colors">'+cat.title+'</h3>'+
        '<p class="text-sm text-slate-400 mb-4">'+cat.desc+'</p>'+
        '<div class="flex flex-wrap gap-1.5">'+extsHtml+moreHtml+'</div>'+
        '<div class="mt-4 flex items-center gap-1 text-xs '+cat.textColor+' font-medium">'+
          '<span>进入转换</span>'+
          '<svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>'+
        '</div>'+
      '</div>'+
    '</a>';
  }

  app.innerHTML = '<div class="min-h-screen bg-slate-950">'+
    '<header class="border-b border-slate-800 glass sticky top-0 z-50">'+
      '<div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">'+
        '<div class="flex items-center gap-3">'+
          '<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">'+
            '<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>'+
          '</div>'+
          '<div><h1 class="text-xl font-bold tracking-tight">FormatHub</h1><p class="text-xs text-slate-400">多格式转换中心</p></div>'+
        '</div>'+
        '<div class="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-full border border-slate-700/50">'+
          '<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>纯前端处理 · 文件不上传'+
        '</div>'+
      '</div>'+
    '</header>'+
    '<main class="max-w-6xl mx-auto px-4 py-8">'+
      '<div class="text-center mb-10"><h2 class="text-2xl sm:text-3xl font-bold mb-2">选择转换类型</h2><p class="text-slate-400 text-sm">点击分类进入，上传文件即可自动识别并转换</p></div>'+
      '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">'+cards+'</div>'+
      '<div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10">'+
        '<div class="text-center p-4 rounded-xl bg-slate-800/15 border border-slate-700/20"><div class="text-2xl mb-1">🔒</div><p class="text-xs font-medium">本地处理</p><p class="text-[10px] text-slate-500 mt-0.5">不上传服务器</p></div>'+
        '<div class="text-center p-4 rounded-xl bg-slate-800/15 border border-slate-700/20"><div class="text-2xl mb-1">⚡</div><p class="text-xs font-medium">极速转换</p><p class="text-[10px] text-slate-500 mt-0.5">浏览器直接处理</p></div>'+
        '<div class="text-center p-4 rounded-xl bg-slate-800/15 border border-slate-700/20"><div class="text-2xl mb-1">📱</div><p class="text-xs font-medium">全平台</p><p class="text-[10px] text-slate-500 mt-0.5">手机/平板/电脑</p></div>'+
        '<div class="text-center p-4 rounded-xl bg-slate-800/15 border border-slate-700/20"><div class="text-2xl mb-1">🆓</div><p class="text-xs font-medium">完全免费</p><p class="text-[10px] text-slate-500 mt-0.5">无限制使用</p></div>'+
      '</div>'+
    '</main>'+
    '<footer class="border-t border-slate-800 mt-12 py-8 text-center text-slate-500 text-xs"><p>FormatHub · 纯前端多格式转换工具</p><p class="mt-1 text-[10px]">支持 40+ 格式 · 最大 200MB · 本地处理</p></footer>'+
  '</div>';
}

function renderCategoryPage(catId) {
  const cat = CATEGORIES[catId];

  let matrixHtml = '';
  const matrixData = {
    document: [
      { from: 'DOCX', to: 'TXT, Markdown, HTML, PDF', icon: '📝' },
      { from: 'XLSX / XLS / CSV / ODS', to: 'CSV, JSON, HTML, XLSX', icon: '📊' },
      { from: 'TXT / Markdown', to: 'PDF, HTML', icon: '📄' },
      { from: 'PDF / PPT / PPTX / ODP / KEY / DOC / RTF / ODT / PAGES / XLSM', to: '暂不支持转换', icon: '⚠️', warn: true }
    ],
    image: [
      { from: 'JPG / JPEG / PNG / GIF / BMP / WebP / TIFF / TIF', to: '互转全部格式', icon: '🖼️' },
      { from: 'SVG 矢量图', to: 'PNG, JPG, WebP, BMP', icon: '✏️' },
      { from: 'HEIC / AVIF', to: '暂不支持转换', icon: '⚠️', warn: true }
    ],
    ebook: [
      { from: 'EPUB', to: 'TXT, HTML', icon: '📖' },
      { from: 'MOBI / AZW3', to: 'TXT', icon: '📱' },
      { from: 'PDF', to: '暂不支持转换', icon: '⚠️', warn: true }
    ],
    data: [
      { from: 'JSON / XML / CSV / YAML / YML / TOML', to: '互转全部格式', icon: '{ }' },
      { from: 'ZIP', to: '提取内容 / 重新打包', icon: '📦' },
      { from: 'RAR / 7Z', to: '暂不支持转换', icon: '⚠️', warn: true }
    ]
  };
  const items = matrixData[catId] || [];
  for (const item of items) {
    const iconBg = item.warn ? 'bg-red-500/10 text-red-400' : 'bg-'+cat.color+'-500/10 '+cat.textColor;
    const borderClass = item.warn ? 'border-red-500/10' : 'border-slate-700/20';
    const toText = item.warn ? '<span class="text-red-400 text-[10px]">'+item.to+'</span>' : '<span class="text-slate-300 text-[10px]">'+item.to+'</span>';
    matrixHtml += '<div class="flex items-start gap-3 p-3 rounded-xl bg-slate-900/30 border '+borderClass+'">'+
      '<div class="w-8 h-8 rounded-lg '+iconBg+' flex items-center justify-center text-sm shrink-0 mt-0.5">'+item.icon+'</div>'+
      '<div class="flex-1 min-w-0">'+
        '<p class="text-xs font-medium text-slate-300 mb-1">'+item.from+'</p>'+toText+
      '</div>'+
    '</div>';
  }

  app.innerHTML = '<div class="min-h-screen bg-slate-950 view-enter">'+
    '<header class="border-b border-slate-800 glass sticky top-0 z-50">'+
      '<div class="max-w-6xl mx-auto px-4 py-3.5 flex items-center gap-3">'+
        '<a href="#" class="p-2 -ml-2 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors">'+
          '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>'+
        '</a>'+
        '<div class="flex items-center gap-2.5">'+
          '<span class="text-2xl">'+cat.emoji+'</span>'+
          '<div><h1 class="text-base font-bold leading-none">'+cat.title+'</h1><p class="text-[10px] text-slate-400 mt-0.5">'+cat.desc+'</p></div>'+
        '</div>'+
      '</div>'+
    '</header>'+
    '<main class="max-w-3xl mx-auto px-4 py-6 space-y-6">'+
      '<div id="dropZone" class="group relative border-2 border-dashed border-slate-600 rounded-2xl bg-slate-800/20 hover:bg-slate-800/40 hover:border-'+cat.color+'-500/40 active:border-'+cat.color+'-500 transition-all duration-300 p-8 sm:p-12 text-center cursor-pointer">'+
        '<input type="file" id="fileInput" multiple class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept="'+cat.accept+'">'+
        '<div class="relative z-0 pointer-events-none">'+
          '<div class="w-14 h-14 mx-auto mb-3 rounded-2xl bg-slate-700/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">'+
            '<svg class="w-7 h-7 text-'+cat.color+'-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>'+
          '</div>'+
          '<h3 class="text-base font-semibold mb-1">点击或拖拽上传文件</h3>'+
          '<p class="text-slate-400 text-xs mb-3">支持 '+cat.exts.join('、')+' 格式 · 最大 200MB</p>'+
          '<div class="flex flex-wrap justify-center gap-1.5">'+cat.exts.slice(0,8).map(e=>'<span class="text-[10px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-500 uppercase">'+e+'</span>').join('')+'</div>'+
        '</div>'+
      '</div>'+
      '<div class="rounded-2xl bg-slate-800/20 border border-slate-700/30 p-5">'+
        '<h3 class="text-sm font-semibold mb-3 flex items-center gap-2">'+
          '<svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>'+
          '支持的转换格式'+
        '</h3>'+
        '<div class="space-y-2.5">'+matrixHtml+'</div>'+
      '</div>'+
      '<div id="batchBar" class="hidden"></div>'+
      '<div id="fileList" class="hidden space-y-3"></div>'+
      '<div id="convertArea" class="hidden">'+
        '<button id="convertBtn" class="w-full py-3 bg-gradient-to-r from-'+cat.color+'-500 to-'+cat.color+'-600 hover:from-'+cat.color+'-400 hover:to-'+cat.color+'-500 text-white font-semibold rounded-xl shadow-lg shadow-'+cat.color+'-500/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2">'+
          '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>'+
          '开始转换'+
        '</button>'+
      '</div>'+
    '</main>'+
  '</div>'+
  '<div id="toast" class="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 transform translate-y-24 opacity-0 transition-all duration-300 pointer-events-none">'+
    '<div class="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-600 shadow-2xl flex items-center gap-2.5 whitespace-nowrap">'+
      '<span id="toastIcon" class="text-base"></span><span id="toastMsg" class="text-sm font-medium"></span>'+
    '</div>'+
  '</div>'+
  '<div id="extractModal" class="fixed inset-0 z-50 hidden items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4">'+
    '<div class="bg-slate-800 rounded-t-2xl sm:rounded-2xl border border-slate-700 w-full max-w-lg max-h-[75vh] flex flex-col">'+
      '<div class="p-4 border-b border-slate-700 flex items-center justify-between">'+
        '<h3 class="font-semibold text-sm">ZIP 内容提取</h3>'+
        '<button id="closeModal" class="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400">'+
          '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>'+
        '</button>'+
      '</div>'+
      '<div id="extractList" class="p-3 overflow-y-auto space-y-1.5 flex-1"></div>'+
    '</div>'+
  '</div>';

  bindCategoryEvents(catId);
}

function bindCategoryEvents(catId) {
  const dz = document.getElementById('dropZone');
  const fi = document.getElementById('fileInput');
  const btn = document.getElementById('convertBtn');

  fi.addEventListener('change', e => { handleFiles(e.target.files, catId); e.target.value = ''; });
  dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('drop-active'); });
  dz.addEventListener('dragleave', () => dz.classList.remove('drop-active'));
  dz.addEventListener('drop', e => { e.preventDefault(); dz.classList.remove('drop-active'); handleFiles(e.dataTransfer.files, catId); });
  btn.addEventListener('click', () => startConvert(catId));

  const cm = document.getElementById('closeModal');
  if (cm) cm.addEventListener('click', () => {
    document.getElementById('extractModal').classList.add('hidden');
    document.getElementById('extractModal').classList.remove('flex');
  });
}

/* ============================================================
   文件处理 + 预览生成
   ============================================================ */
function handleFiles(fileList, catId) {
  const cat = CATEGORIES[catId];
  Array.from(fileList).forEach(f => {
    if (f.size > MAX_SIZE) { toast('⚠️', '「'+f.name+'」超过 200MB'); return; }
    const e = getExt(f.name);
    if (!cat.exts.includes(e)) { toast('⚠️', '「'+f.name+'」不是 '+cat.title+' 支持的格式'); return; }
    const item = { file: f, id: Date.now()+Math.random(), status: 'pending', progress: 0, target: Object.keys(cat.targets)[0], preview: null };
    files.push(item);
    generatePreview(item, catId);
  });
  renderFiles(catId);
}

async function generatePreview(item, catId) {
  const ext = getExt(item.file.name);
  const itemId = item.id;
  try {
    if (catId === 'image') {
      const url = URL.createObjectURL(item.file);
      item.preview = { type: 'image', url };
    } else if (catId === 'document') {
      if (['txt','md','html'].includes(ext)) {
        const text = await readText(item.file);
        item.preview = { type: 'text', content: text.slice(0, 500) };
      } else if (ext === 'docx') {
        const ab = await readAB(item.file);
        const r = await mammoth.extractRawText({ arrayBuffer: ab });
        item.preview = { type: 'text', content: r.value.slice(0, 500) };
      } else if (['xlsx','xls','csv','ods'].includes(ext)) {
        const ab = await readAB(item.file);
        const wb = XLSX.read(ab, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(ws, { header: 1 });
        item.preview = { type: 'table', rows: json.slice(0, 10) };
      } else {
        item.preview = { type: 'none' };
      }
    } else if (catId === 'ebook') {
      if (ext === 'epub') {
        const ab = await readAB(item.file);
        const zip = await JSZip.loadAsync(ab);
        let texts = [];
        for (const [path, entry] of Object.entries(zip.files)) {
          if (/\.(xhtml|html|htm)$/i.test(path) && !entry.dir) {
            const html = await entry.async('text');
            const div = document.createElement('div'); div.innerHTML = html;
            texts.push(div.textContent || div.innerText || '');
            if (texts.join('').length > 500) break;
          }
        }
        item.preview = { type: 'text', content: texts.join('\n\n').slice(0, 500) };
      } else if (['mobi','azw3'].includes(ext)) {
        const ab = await readAB(item.file);
        const u8 = new Uint8Array(ab);
        let text = '';
        for (let i = 0; i < u8.length; i++) {
          const c = u8[i];
          if ((c >= 32 && c < 127) || c === 10 || c === 13) text += String.fromCharCode(c);
        }
        item.preview = { type: 'text', content: text.replace(/\s{4,}/g, '\n\n').slice(0, 500) };
      } else {
        item.preview = { type: 'none' };
      }
    } else if (catId === 'data') {
      if (ext === 'zip') {
        const ab = await readAB(item.file);
        const zip = await JSZip.loadAsync(ab);
        const entries = Object.keys(zip.files).filter(p => !zip.files[p].dir).slice(0, 8);
        item.preview = { type: 'archive', entries };
      } else if (['json','xml','yaml','yml','toml','csv'].includes(ext)) {
        const text = await readText(item.file);
        item.preview = { type: 'text', content: text.slice(0, 500) };
      } else {
        item.preview = { type: 'none' };
      }
    }
  } catch (e) {
    item.preview = { type: 'error', message: '预览生成失败' };
  }
  if (files.find(f => f.id === itemId) && currentCat === catId) {
    renderFiles(catId);
  }
}

window.rmFile = function(idx) {
  const item = files[idx];
  if (item && item.preview && item.preview.url) URL.revokeObjectURL(item.preview.url);
  files.splice(idx, 1);
  renderFiles(currentCat);
};

window.chgTarget = function(idx, val) {
  if (files[idx]) files[idx].target = val;
};

window.applyBatchTarget = function() {
  const sel = document.getElementById('batchTarget');
  if (!sel || !sel.value) return;
  const val = sel.value;
  let count = 0;
  for (const item of files) {
    const supported = getSupportedTargets(currentCat, item.file.name);
    if (supported.includes(val)) {
      item.target = val;
      count++;
    }
  }
  renderFiles(currentCat);
  toast('✅', '已批量设置 '+count+' 个文件的目标格式');
};

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function renderPreview(preview, catId) {
  if (!preview) return '<div class="mt-3 p-3 rounded-lg bg-slate-900/30 border border-slate-700/20"><span class="text-xs text-slate-500">预览生成中...</span></div>';
  if (preview.type === 'none') return '';
  if (preview.type === 'error') return '<div class="mt-3 p-3 rounded-lg bg-red-500/5 border border-red-500/10"><span class="text-xs text-red-400">'+escapeHtml(preview.message)+'</span></div>';
  if (preview.type === 'image') {
    return '<div class="mt-3 rounded-lg overflow-hidden bg-slate-900/50 border border-slate-700/30">'+
      '<img src="'+preview.url+'" class="max-h-36 w-auto object-contain mx-auto" alt="预览" loading="lazy">'+
    '</div>';
  }
  if (preview.type === 'text') {
    return '<div class="mt-3 p-3 rounded-lg bg-slate-900/50 border border-slate-700/30">'+
      '<p class="text-xs text-slate-300 font-mono whitespace-pre-wrap break-words line-clamp-6 leading-relaxed">'+escapeHtml(preview.content)+'</p>'+
      '<p class="text-[10px] text-slate-500 mt-1.5">前 500 字预览</p>'+
    '</div>';
  }
  if (preview.type === 'table') {
    const rows = preview.rows;
    if (!rows || !rows.length) return '';
    let thead = '', tbody = '';
    const headers = rows[0] || [];
    for (const h of headers) {
      thead += '<th class="px-2 py-1 text-left text-[10px] font-semibold text-slate-300 border-b border-slate-600">'+escapeHtml(h)+'</th>';
    }
    for (let r = 1; r < rows.length; r++) {
      let tds = '';
      for (const cell of rows[r]) {
        tds += '<td class="px-2 py-1 text-[10px] text-slate-400 border-b border-slate-700/30">'+escapeHtml(cell)+'</td>';
      }
      tbody += '<tr>'+tds+'</tr>';
    }
    return '<div class="mt-3 rounded-lg overflow-hidden border border-slate-700/30">'+
      '<div class="overflow-x-auto">'+
        '<table class="w-full text-left">'+
          '<thead class="bg-slate-800"><tr>'+thead+'</tr></thead>'+
          '<tbody class="bg-slate-900/30">'+tbody+'</tbody>'+
        '</table>'+
      '</div>'+
      '<p class="text-[10px] text-slate-500 px-2 py-1.5 bg-slate-900/30">前 10 行预览</p>'+
    '</div>';
  }
  if (preview.type === 'archive') {
    const list = preview.entries.map(e => '<li class="truncate text-xs text-slate-400">📄 '+escapeHtml(e)+'</li>').join('');
    return '<div class="mt-3 p-3 rounded-lg bg-slate-900/50 border border-slate-700/30">'+
      '<ul class="space-y-1">'+list+'</ul>'+
      '<p class="text-[10px] text-slate-500 mt-1.5">压缩包内容预览</p>'+
    '</div>';
  }
  return '';
}

function renderSizeCompare(item) {
  if (item.status !== 'done' || item.convertedSize == null) return '';
  const orig = item.file.size;
  const now = item.convertedSize;
  const pct = orig === 0 ? 0 : Math.round((now - orig) / orig * 100);
  let color, arrow, text;
  if (pct < 0) { color = 'text-emerald-400'; arrow = '↓'; text = Math.abs(pct) + '%'; }
  else if (pct > 0) { color = 'text-amber-400'; arrow = '↑'; text = pct + '%'; }
  else { color = 'text-slate-500'; arrow = '→'; text = '0%'; }
  return '<div class="mt-2 flex items-center gap-1.5 text-[10px]">'+
    '<span class="text-slate-500">原 '+fmtSize(orig)+'</span>'+
    '<span class="text-slate-600">→</span>'+
    '<span class="text-slate-300">新 '+fmtSize(now)+'</span>'+
    '<span class="'+color+' font-medium">'+arrow+' '+text+'</span>'+
  '</div>';
}

function renderFiles(catId) {
  const list = document.getElementById('fileList');
  const area = document.getElementById('convertArea');
  const batchBar = document.getElementById('batchBar');
  const cat = CATEGORIES[catId];
  if (!files.length) { list.classList.add('hidden'); area.classList.add('hidden'); batchBar.classList.add('hidden'); return; }
  list.classList.remove('hidden'); area.classList.remove('hidden'); batchBar.classList.remove('hidden');

  // 批量操作栏：计算所有文件共同支持的目标格式
  let commonTargets = [];
  if (files.length > 0) {
    const allSupported = files.map(f => getSupportedTargets(catId, f.file.name));
    commonTargets = allSupported[0].filter(t => allSupported.every(s => s.includes(t)));
  }
  let batchOptions = '<option value="">选择目标格式...</option>';
  for (const t of commonTargets) {
    batchOptions += '<option value="'+t+'">'+cat.targets[t].label+' (.'+cat.targets[t].ext+')</option>';
  }
  batchBar.innerHTML = '<div class="flex items-center gap-2 p-3 rounded-xl bg-slate-800/40 border border-slate-700/40">'+
    '<span class="text-xs text-slate-400 shrink-0">批量设置：</span>'+
    '<select id="batchTarget" class="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-slate-200 pr-8 focus:border-'+cat.color+'-500 focus:outline-none">'+batchOptions+'</select>'+
    '<button onclick="window.applyBatchTarget()" class="text-xs px-3 py-1.5 rounded-lg bg-'+cat.color+'-500/10 text-'+cat.color+'-400 hover:bg-'+cat.color+'-500/20 transition-colors shrink-0 font-medium">应用到全部</button>'+
  '</div>';

  let html = '';
  for (let idx = 0; idx < files.length; idx++) {
    const item = files[idx];
    const f = item.file;
    const e = getExt(f.name);
    const supported = getSupportedTargets(catId, f.file.name);

    let statusHtml = '';
    if (item.status === 'done') statusHtml = '<span class="text-emerald-400 text-xs font-medium ml-2">✓ 已完成</span>';
    else if (item.status === 'error') statusHtml = '<span class="text-red-400 text-xs font-medium ml-2">✗ 失败</span>';
    else if (item.status === 'converting') statusHtml = '<span class="inline-block w-3.5 h-3.5 border-2 border-'+cat.color+'-400 border-t-transparent rounded-full animate-spin ml-2"></span>';

    let selectHtml = '';
    if (!supported.length) {
      selectHtml = '<span class="flex-1 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">暂不支持转换此格式</span>';
    } else {
      let options = '';
      for (const [v, info] of Object.entries(cat.targets)) {
        if (supported.includes(v)) {
          options += '<option value="' + v + '"' + (item.target === v ? ' selected' : '') + '>' + info.label + ' (.' + info.ext + ')</option>';
        }
      }
      selectHtml = '<select id="t-' + idx + '" onchange="window.chgTarget(' + idx + ',this.value)" class="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-1.5 text-sm focus:border-'+cat.color+'-500 focus:outline-none text-slate-200 pr-8">' + options + '</select>';
    }

    html += '<div class="slide-in rounded-xl bg-slate-800/40 border border-slate-700/40 p-4 '+(item.status==='done'?'border-emerald-500/20':'')+'">'+
      '<div class="flex items-center gap-3 mb-3">'+
        '<div class="w-9 h-9 rounded-lg bg-'+cat.color+'-500/10 '+cat.textColor+' flex items-center justify-center text-[10px] font-bold uppercase shrink-0">'+e+'</div>'+
        '<div class="flex-1 min-w-0">'+
          '<p class="text-sm font-medium truncate flex items-center">'+f.name+statusHtml+'</p>'+
          '<p class="text-[10px] text-slate-500">'+fmtSize(f.size)+'</p>'+
        '</div>'+
        '<button onclick="window.rmFile('+idx+')" class="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-slate-500 transition-colors shrink-0">'+
          '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>'+
        '</button>'+
      '</div>'+
      '<div class="flex items-center gap-2">'+
        '<span class="text-xs text-slate-400 shrink-0">转换为：</span>'+selectHtml+
      '</div>'+
      renderPreview(item.preview, catId)+
      renderSizeCompare(item)+
      (item.status==='converting'?'<div class="mt-3 h-1 bg-slate-700 rounded-full overflow-hidden"><div class="h-full bg-gradient-to-r from-'+cat.color+'-500 to-'+cat.color+'-400 progress-bar" style="width:'+item.progress+'%"></div></div>':'')+
      (item.status==='error'?'<p class="text-xs text-red-400 mt-2">'+escapeHtml(item.error||'')+'</p>':'')+
    '</div>';
  }
  list.innerHTML = html;
}

async function startConvert(catId) {
  if (converting || !files.length) return;
  converting = true;
  const btn = document.getElementById('convertBtn');
  const cat = CATEGORIES[catId];
  btn.disabled = true;
  btn.innerHTML = '<span class="inline-flex items-center gap-2"><span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>转换中...</span>';

  for (let i=0; i<files.length; i++) {
    const item = files[i];
    const target = item.target;
    item.status = 'converting'; item.progress = 15;
    renderFiles(catId);

    try {
      const supported = getSupportedTargets(catId, item.file.name);
      if (!supported.length || !supported.includes(target)) {
        throw new Error('该文件格式暂不支持转换，请查看"支持的转换格式"说明');
      }
      await sleep(150); item.progress = 45; renderFiles(catId);

      let blob;
      if (catId === 'image') blob = await convImage(item.file, target);
      else if (catId === 'data') {
        if (['zip','rar','7z'].includes(getExt(item.file.name))) {
          const r = await convArchive(item.file, target);
          if (r && r.type==='extracted') {
            showExtractModal(r.entries);
            item.status='done'; item.progress=100; renderFiles(catId); continue;
          }
          blob = r;
        } else blob = await convData(item.file, target);
      }
      else if (catId === 'document') blob = await convDoc(item.file, target);
      else if (catId === 'ebook') blob = await convEbook(item.file, target);

      if (!blob) throw new Error('转换未返回文件');

      item.convertedSize = blob.size;
      item.originalSize = item.file.size;
      item.progress = 100; item.status = 'done';

      const outName = item.file.name.replace(/\.[^.]+$/i, '.' + cat.targets[target].ext);
      dlBlob(blob, outName);
      toast('✅', '「'+item.file.name+'」转换完成');
    } catch (err) {
      item.status = 'error'; item.error = err.message || '转换失败';
      toast('❌', '「'+item.file.name+'」'+item.error);
    }
    renderFiles(catId); await sleep(250);
  }

  converting = false;
  btn.disabled = false;
  btn.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg> 开始转换';
}

function showExtractModal(entries) {
  const modal = document.getElementById('extractModal');
  const list = document.getElementById('extractList');
  modal.classList.remove('hidden'); modal.classList.add('flex');
  window._extracted = entries;
  let html = '';
  for (let i=0; i<entries.length; i++) {
    const e = entries[i];
    html += '<div class="flex items-center justify-between p-2.5 rounded-lg bg-slate-700/20 hover:bg-slate-700/40 transition-colors">'+
      '<div class="min-w-0">'+
        '<p class="text-xs truncate">'+e.path+'</p>'+
        '<p class="text-[10px] text-slate-500">'+fmtSize(e.size)+'</p>'+
      '</div>'+
      '<button onclick="window.dlExtract('+i+')" class="text-[10px] px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors shrink-0 ml-2">下载</button>'+
    '</div>';
  }
  list.innerHTML = html;
}

window.dlExtract = function(idx) {
  const e = window._extracted ? window._extracted[idx] : null;
  if (e && e.content) { dlBlob(e.content, e.path.split('/').pop()); toast('✅', '已下载'); }
};

function toast(icon, msg) {
  const t = document.getElementById('toast'), ti = document.getElementById('toastIcon'), tm = document.getElementById('toastMsg');
  ti.textContent = icon; tm.textContent = msg;
  t.classList.remove('translate-y-24', 'opacity-0');
  setTimeout(() => t.classList.add('translate-y-24', 'opacity-0'), 2800);
}

window.addEventListener('hashchange', render);
document.addEventListener('DOMContentLoaded', render);