# FormatHub

纯前端多格式文件转换工具，浏览器本地处理，零上传。

![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![PWA](https://img.shields.io/badge/PWA-Supported-5A0FC8?logo=pwa)

## ✨ 功能特性

- **纯前端处理** — 所有转换在浏览器本地完成，文件不上传任何服务器，保护隐私
- **支持 40+ 格式** — 文档、图片、数据、电子书、PDF 工具箱五大分类
- **批量转换** — 一次上传多个文件，支持批量设置目标格式
- **文件预览** — 上传后即时预览：图片缩略图、文档前 500 字、表格前 10 行、代码语法高亮、压缩包文件列表
- **多选操作** — 支持勾选多个文件进行合并下载、压缩下载或压缩合并下载
- **图片高级处理** — 支持质量调节、尺寸裁剪、旋转（0°/90°/180°/270°）
- **JSON 格式化** — 美化、压缩、校验 JSON 文件
- **PDF 工具箱** — 拆分、合并、加密
- **文件合并** — 文档/电子书/数据/图片均可合并（图片合并为 PDF）
- **转换历史** — 自动记录最近 20 次转换记录（IndexedDB 本地存储）
- **主题切换** — 深色/浅色/自动跟随系统
- **多语言** — 中文 / English 一键切换
- **PWA 离线支持** — 安装为桌面应用，断网也能用
- **响应式设计** — 完美适配手机、平板、电脑

## 📂 支持格式

| 分类 | 支持格式 | 可转换目标 |
|------|---------|------|
| 📄 文档 | DOCX, XLSX/XLS/CSV/ODS, TXT, MD, HTML | TXT, MD, HTML, PDF, CSV, JSON, XLSX |
| 🖼️ 图像 | JPG/JPEG, PNG, GIF, BMP, WebP, TIFF/TIF, SVG | PNG, JPG, WebP, GIF, BMP |
| 💾 数据 | JSON, XML, CSV, YAML/YML, TOML, ZIP | JSON, XML, CSV, YAML, TOML, ZIP |
| 📚 电子书 | EPUB, MOBI, AZW3 | TXT, HTML |
| 📕 PDF 工具箱 | PDF | 拆分、合并、加密 |
| 📝 代码 | JS/TS, Python, CSS, HTML, Java, Go, Rust 等 | 语法高亮预览 |

## 🛡️ 隐私与安全

- **完全本地化** — 所有转换逻辑均在浏览器内核中运行（WebAssembly / JS），绝无任何服务端 API 传输
- **数据无留存** — 文件仅保存在浏览器内存与本地 IndexedDB 中，清除缓存或关闭页面即失效

## ⚠️ 使用限制与说明

- **文件大小建议**：由于受限于浏览器内存，建议单个文件不超过 **200 MB**
- **复杂格式兼容性**：复杂排版的 DOCX/PPTX 转换为 PDF 时，可能存在部分样式错乱（依赖前端渲染能力）
- **离线样式**：PWA 模式下 Tailwind CSS 资源已通过 Service Worker 缓存，断网时样式正常加载

## 🚀 快速开始

```bash
npm install
npm run dev     # 本地开发
npm run build   # 构建（输出到 dist 目录）
```

## ⌨️ 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl + A` | 全选文件 |
| `Delete` | 删除选中文件 |
| `Enter` | 开始转换 |
| `Ctrl + V` | 粘贴截图/文件 |

## 🛠️ 技术栈

- **Vite** — 构建工具
- **Tailwind CSS** — 样式框架
- **原生 JS** — 纯前端逻辑，无框架依赖
- **第三方库** — JSZip, PapaParse, js-yaml, XLSX, Mammoth, html2canvas, jsPDF, pdf-lib, Prism.js（CDN 引入）
- **存储** — IndexedDB（历史记录）+ localStorage（设置）

## 📱 使用提示

- 单文件最大支持 **200MB**
- 在分类页内按 `Ctrl+V` 可直接粘贴截图或文件
- 转换完成后可选择「普通下载」「压缩下载」「合并下载」「压缩合并下载」
- 所有转换结果均可对比原文件/新文件大小变化
- 拖拽文件列表中的 ⋮⋮ 手柄可调整转换顺序

## 📄 License

MIT
