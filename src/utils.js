export const MAX_SIZE = 200 * 1024 * 1024;

export const I18N = {
  zh: {
    appName: 'FormatHub',
    appSubtitle: '多格式转换中心',
    selectType: '选择转换类型',
    selectTypeDesc: '点击分类进入，上传文件即可自动识别并转换',
    localProcess: '本地处理',
    localProcessDesc: '不上传服务器',
    fastConvert: '极速转换',
    fastConvertDesc: '浏览器直接处理',
    allPlatform: '全平台',
    allPlatformDesc: '手机/平板/电脑',
    free: '完全免费',
    freeDesc: '无限制使用',
    formatsCount: '种格式',
    enterConvert: '进入转换',
    clickOrDrag: '点击或拖拽上传文件',
    maxSize: '最大 200MB',
    supportedFormats: '支持的转换格式',
    convertTo: '转换为：',
    notSupported: '暂不支持转换此格式',
    startConvert: '开始转换',
    converting: '转换中...',
    done: '已完成',
    failed: '失败',
    previewFirst500: '前 500 字预览',
    previewFirst10: '前 10 行预览',
    archivePreview: '压缩包内容预览',
    batchSet: '批量设置：',
    applyToAll: '应用到全部',
    batchApplied: '已批量设置',
    files: '个文件的目标格式',
    original: '原',
    newSize: '新',
    footer: 'FormatHub · 纯前端多格式转换工具',
    footerDesc: '支持 40+ 格式 · 最大 200MB · 本地处理',
    pasteHint: 'Ctrl+V 粘贴截图/文件',
    mergeFiles: '合并文件',
    mergeTo: '合并为',
    customName: '输出文件名',
    imageQuality: '图片质量',
    imageWidth: '宽度(px)',
    imageHeight: '高度(px)',
    imageRotate: '旋转',
    formatJSON: 'JSON 格式化',
    beautify: '美化',
    compress: '压缩',
    validate: '校验',
    validateOk: 'JSON 格式正确',
    validateFail: 'JSON 语法错误',
    langSwitch: '语言',
    offlineReady: '已支持离线使用',
    fileCount: '个文件',
    mergeOrder: '按上传顺序合并',
    remove: '删除',
    download: '下载',
    close: '关闭',
    zipExtract: 'ZIP 内容提取'
  },
  en: {
    appName: 'FormatHub',
    appSubtitle: 'Multi-Format Converter',
    selectType: 'Select Conversion Type',
    selectTypeDesc: 'Click a category, upload files to auto-detect and convert',
    localProcess: 'Local Processing',
    localProcessDesc: 'No server upload',
    fastConvert: 'Fast Conversion',
    fastConvertDesc: 'Browser native processing',
    allPlatform: 'All Platforms',
    allPlatformDesc: 'Mobile/Tablet/Desktop',
    free: 'Completely Free',
    freeDesc: 'Unlimited usage',
    formatsCount: ' formats',
    enterConvert: 'Enter',
    clickOrDrag: 'Click or drag to upload',
    maxSize: 'Max 200MB',
    supportedFormats: 'Supported Formats',
    convertTo: 'Convert to:',
    notSupported: 'Format not supported',
    startConvert: 'Start Conversion',
    converting: 'Converting...',
    done: 'Done',
    failed: 'Failed',
    previewFirst500: 'First 500 chars preview',
    previewFirst10: 'First 10 rows preview',
    archivePreview: 'Archive contents preview',
    batchSet: 'Batch:',
    applyToAll: 'Apply to All',
    batchApplied: 'Batch applied to',
    files: ' files',
    original: 'Orig',
    newSize: 'New',
    footer: 'FormatHub · Browser-based File Converter',
    footerDesc: '40+ formats · Max 200MB · Local processing',
    pasteHint: 'Ctrl+V to paste screenshot/file',
    mergeFiles: 'Merge Files',
    mergeTo: 'Merge to',
    customName: 'Output filename',
    imageQuality: 'Image Quality',
    imageWidth: 'Width(px)',
    imageHeight: 'Height(px)',
    imageRotate: 'Rotate',
    formatJSON: 'JSON Formatter',
    beautify: 'Beautify',
    compress: 'Compress',
    validate: 'Validate',
    validateOk: 'Valid JSON',
    validateFail: 'Invalid JSON syntax',
    langSwitch: 'Language',
    offlineReady: 'Offline support ready',
    fileCount: ' files',
    mergeOrder: 'Merge in upload order',
    remove: 'Remove',
    download: 'Download',
    close: 'Close',
    zipExtract: 'ZIP Contents'
  }
};

let currentLang = localStorage.getItem('formathub-lang') || 'zh';
export function t(key) { return I18N[currentLang]?.[key] || I18N['zh'][key] || key; }
export function setLang(lang) { currentLang = lang; localStorage.setItem('formathub-lang', lang); }
export function getLang() { return currentLang; }

export const CATEGORIES = {
  document: {
    id: 'document',
    emoji: '📄',
    title: '文档与办公文件',
    titleEn: 'Documents & Office',
    desc: 'Word、Excel、PPT、PDF 等办公格式互转',
    descEn: 'Word, Excel, PPT, PDF conversion',
    color: 'blue',
    bgGradient: 'from-blue-500/20 to-cyan-500/10',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-400',
    dotColor: 'bg-blue-400',
    accept: '.doc,.docx,.txt,.rtf,.odt,.pdf,.md,.pages,.xls,.xlsx,.csv,.ods,.xlsm,.ppt,.pptx,.odp,.key',
    exts: ['doc','docx','txt','rtf','odt','pdf','md','pages','xls','xlsx','csv','ods','xlsm','ppt','pptx','odp','key'],
    targets: {
      docx: { label: 'Word 文档', labelEn: 'Word Doc', ext: 'docx' },
      txt: { label: '纯文本', labelEn: 'Plain Text', ext: 'txt' },
      md: { label: 'Markdown', labelEn: 'Markdown', ext: 'md' },
      html: { label: 'HTML 网页', labelEn: 'HTML', ext: 'html' },
      pdf: { label: 'PDF 文档', labelEn: 'PDF', ext: 'pdf' },
      csv: { label: 'CSV 表格', labelEn: 'CSV', ext: 'csv' },
      json: { label: 'JSON 数据', labelEn: 'JSON', ext: 'json' },
      xlsx: { label: 'Excel 表格', labelEn: 'Excel', ext: 'xlsx' }
    }
  },
  image: {
    id: 'image',
    emoji: '🖼️',
    title: '图像与图片',
    titleEn: 'Images',
    desc: 'JPG、PNG、WebP、GIF、SVG 等格式互转',
    descEn: 'JPG, PNG, WebP, GIF, SVG conversion',
    color: 'purple',
    bgGradient: 'from-purple-500/20 to-pink-500/10',
    borderColor: 'border-purple-500/30',
    textColor: 'text-purple-400',
    dotColor: 'bg-purple-400',
    accept: '.jpg,.jpeg,.png,.gif,.bmp,.webp,.tiff,.tif,.heic,.avif,.svg',
    exts: ['jpg','jpeg','png','gif','bmp','webp','tiff','tif','heic','avif','svg'],
    targets: {
      png: { label: 'PNG 图片', labelEn: 'PNG', ext: 'png' },
      jpg: { label: 'JPEG 图片', labelEn: 'JPEG', ext: 'jpg' },
      webp: { label: 'WebP 图片', labelEn: 'WebP', ext: 'webp' },
      gif: { label: 'GIF 动图', labelEn: 'GIF', ext: 'gif' },
      bmp: { label: 'BMP 图片', labelEn: 'BMP', ext: 'bmp' }
    }
  },
  ebook: {
    id: 'ebook',
    emoji: '📚',
    title: '电子书',
    titleEn: 'E-Books',
    desc: 'EPUB、MOBI、AZW3 等电子书格式转换',
    descEn: 'EPUB, MOBI, AZW3 conversion',
    color: 'amber',
    bgGradient: 'from-amber-500/20 to-orange-500/10',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-400',
    dotColor: 'bg-amber-400',
    accept: '.epub,.mobi,.azw3,.pdf',
    exts: ['epub','mobi','azw3','pdf'],
    targets: {
      txt: { label: '纯文本', labelEn: 'Plain Text', ext: 'txt' },
      html: { label: 'HTML 网页', labelEn: 'HTML', ext: 'html' }
    }
  },
  data: {
    id: 'data',
    emoji: '💾',
    title: '数据与压缩包',
    titleEn: 'Data & Archives',
    desc: 'JSON、CSV、XML、YAML 等数据格式互转',
    descEn: 'JSON, CSV, XML, YAML conversion',
    color: 'emerald',
    bgGradient: 'from-emerald-500/20 to-teal-500/10',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-400',
    dotColor: 'bg-emerald-400',
    accept: '.json,.xml,.csv,.yaml,.yml,.toml,.zip,.rar,.7z',
    exts: ['json','xml','csv','yaml','yml','toml','zip','rar','7z'],
    targets: {
      json: { label: 'JSON', labelEn: 'JSON', ext: 'json' },
      xml: { label: 'XML', labelEn: 'XML', ext: 'xml' },
      csv: { label: 'CSV', labelEn: 'CSV', ext: 'csv' },
      yaml: { label: 'YAML', labelEn: 'YAML', ext: 'yaml' },
      toml: { label: 'TOML', labelEn: 'TOML', ext: 'toml' },
      zip: { label: 'ZIP 压缩包', labelEn: 'ZIP Archive', ext: 'zip' }
    }
  }
};

export const SUPPORTED_MATRIX = {
  document: {
    docx:  ['txt','md','html','pdf'],
    xlsx:  ['csv','json','html','xlsx'],
    xls:   ['csv','json','html','xlsx'],
    csv:   ['csv','json','html','xlsx'],
    ods:   ['csv','json','html','xlsx'],
    txt:   ['txt','md','html','pdf'],
    md:    ['txt','md','html','pdf'],
    html:  ['txt','md','html'],
    pdf:   [],
    doc:   [],
    rtf:   [],
    odt:   [],
    pages: [],
    ppt:   [],
    pptx:  [],
    odp:   [],
    key:   [],
    xlsm:  []
  },
  image: {
    jpg:   ['png','jpg','webp','gif','bmp'],
    jpeg:  ['png','jpg','webp','gif','bmp'],
    png:   ['png','jpg','webp','gif','bmp'],
    gif:   ['png','jpg','webp','gif','bmp'],
    bmp:   ['png','jpg','webp','gif','bmp'],
    webp:  ['png','jpg','webp','gif','bmp'],
    tiff:  ['png','jpg','webp','gif','bmp'],
    tif:   ['png','jpg','webp','gif','bmp'],
    svg:   ['png','jpg','webp','bmp'],
    heic:  [],
    avif:  []
  },
  ebook: {
    epub:  ['txt','html'],
    mobi:  ['txt'],
    azw3:  ['txt'],
    pdf:   []
  },
  data: {
    json:  ['json','xml','csv','yaml','toml'],
    xml:   ['json','xml','csv','yaml','toml'],
    csv:   ['json','xml','csv','yaml','toml'],
    yaml:  ['json','xml','csv','yaml','toml'],
    yml:   ['json','xml','csv','yaml','toml'],
    toml:  ['json','xml','csv','yaml','toml'],
    zip:   ['zip'],
    rar:   [],
    '7z':  []
  }
};

export function getSupportedTargets(catId, filename) {
  const ext = getExt(filename);
  const matrix = SUPPORTED_MATRIX[catId];
  return matrix ? (matrix[ext] || []) : [];
}

export function getExt(name) { return name.split('.').pop().toLowerCase(); }
export function getCat(name) {
  const e = getExt(name);
  for (const [c, info] of Object.entries(CATEGORIES)) if (info.exts.includes(e)) return c;
  return null;
}
export function fmtSize(b) {
  if (!b) return '0 B';
  const u = ['B','KB','MB','GB'];
  const i = Math.floor(Math.log(b)/Math.log(1024));
  return (b/Math.pow(1024,i)).toFixed(1)+' '+u[i];
}
export function dlBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
export function readAB(file) { return new Promise((r,j)=>{const R=new FileReader();R.onload=e=>r(e.target.result);R.onerror=j;R.readAsArrayBuffer(file);}); }
export function readText(file) { return new Promise((r,j)=>{const R=new FileReader();R.onload=e=>r(e.target.result);R.onerror=j;R.readAsText(file);}); }
export function readData(file) { return new Promise((r,j)=>{const R=new FileReader();R.onload=e=>r(e.target.result);R.onerror=j;R.readAsDataURL(file);}); }
export function sleep(ms){return new Promise(r=>setTimeout(r,ms));}