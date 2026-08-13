# FormatHub

> 纯前端多格式文件转换中心 —— 浏览器本地处理，零上传，零服务端。

![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![PWA](https://img.shields.io/badge/PWA-Supported-5A0FC8?logo=pwa)

## ✨ 功能亮点

- **纯本地处理** —— 所有转换逻辑在浏览器内完成（Web Worker + JS），文件绝不上传服务器
- **40+ 格式支持** —— 文档、图片、数据、电子书、PDF 工具箱、GitHub 下载六大板块
- **批量操作** —— 一次上传多个文件，支持批量设置目标格式、全选/反选、合并与压缩打包
- **实时预览** —— 图片缩略图、文档前 500 字、表格前 10 行、压缩包文件列表即时可见
- **图片精修** —— 质量调节、尺寸裁剪、旋转（0°/90°/180°/270°）
- **JSON 工具箱** —— 一键美化、压缩、校验
- **PDF 工具箱** —— 拆分、合并、加密
- **🐙 GitHub 下载** —— 粘贴 GitHub 文件/文件夹链接，直接下载到本地（文件夹自动打包 ZIP）
- **多语言** —— 中文 / English 一键切换，自动记忆偏好
- **PWA 离线可用** —— 安装为桌面应用，断网也能转换
- **全设备自适应** —— 手机、平板、电脑完美适配，支持拖拽上传与剪贴板粘贴

## 📂 支持格式一览

| 分类 | 输入格式 | 输出/操作 |
|------|---------|----------|
| 📄 文档 | DOCX, XLSX/XLS/CSV/ODS, TXT, MD, HTML | TXT, MD, HTML, PDF, CSV, JSON, XLSX |
| 🖼️ 图像 | JPG/JPEG, PNG, GIF, BMP, WebP, TIFF/TIF, SVG | PNG, JPG, WebP, GIF, BMP（支持质量/尺寸/旋转调节）|
| 💾 数据 | JSON, XML, CSV, YAML/YML, TOML, ZIP | JSON, XML, CSV, YAML, TOML, ZIP（提取/重新打包）|
| 📚 电子书 | EPUB, MOBI, AZW3 | TXT, HTML |
| 📕 PDF 工具箱 | PDF | 拆分、合并、加密 |
| 🐙 GitHub 下载 | GitHub blob / tree 链接 | 文件直链下载 / 文件夹 ZIP 打包 |

## 🛡️ 隐私与安全

- **完全本地化** —— 转换逻辑在浏览器内核中运行，无任何服务端 API 传输
- **数据无留存** —— 文件仅保存在浏览器内存与本地 IndexedDB 中，清除缓存或关闭页面即失效
- **零账号体系** —— 无需注册登录，打开即用

## 🐙 GitHub 下载使用指南

FormatHub 支持直接下载 GitHub 仓库中的文件或整个文件夹：

| 链接类型 | 示例 | 处理方式 |
|---------|------|---------|
| **文件链接** (blob) | `github.com/owner/repo/blob/main/src/main.js` | 走 `raw.githubusercontent.com` 直链下载，**零 API 消耗** |
| **文件夹链接** (tree) | `github.com/owner/repo/tree/main/src` | 调用 GitHub API 递归获取文件列表，JSZip 自动打包为 ZIP |

**使用步骤：**
1. 打开 FormatHub → 点击首页 🐙 **GitHub 下载** 卡片
2. 粘贴 GitHub 文件或文件夹链接（支持剪贴板自动识别）
3. 点击下载，文件自动保存到本地 Downloads

> ⚠️ 文件夹下载受 GitHub API 速率限制（未认证 60 次/小时）。如遇到限制，请等待 1 小时后重试。

## ⌨️ 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl + V` | 粘贴截图或文件 |
| `Ctrl + A` | 全选文件 |
| `Delete` | 删除选中文件 |
| `Enter` | 开始转换 |

## 📁 项目结构

```
src/
├── main.js              # 主入口：路由、页面渲染、事件绑定
├── utils.js             # 工具函数：i18n、文件读写、下载、格式化
├── converters/
│   ├── github.js        # GitHub 链接解析与下载（blob/tree）
│   ├── image.js         # 图片格式转换（Canvas）
│   ├── document.js      # 文档转换与合并
│   ├── data.js          # 数据格式互转
│   ├── archive.js       # ZIP 压缩包处理
│   ├── ebook.js         # 电子书格式转换
│   └── format.js        # JSON 美化/压缩/校验
└── workers/
    ├── data.worker.js   # 大数据量转换 Worker
    ├── doc.worker.js    # 文档转换 Worker
    └── ebook.worker.js  # 电子书转换 Worker
```

## 🛠️ 技术栈

- **Vite** —— 构建工具与开发服务器
- **Tailwind CSS** —— 原子化样式，响应式布局
- **原生 ES Modules** —— 无前端框架依赖，轻量高效
- **Web Workers** —— 大数据量转换不阻塞主线程
- **CDN 按需加载** —— PapaParse、js-yaml、XLSX、Mammoth、jsPDF、pdf-lib 等按分类动态引入
- **JSZip** —— 浏览器端 ZIP 打包与解压
- **IndexedDB** —— 本地历史记录存储
- **localStorage** —— 语言与主题偏好记忆

## ⚠️ 使用提示

- **文件大小建议**：受限于浏览器内存，建议单个文件不超过 **200 MB**
- **复杂格式兼容**：复杂排版的 DOCX 转 PDF 时，可能存在部分样式差异（依赖前端渲染能力）
- **离线样式**：PWA 模式下 Tailwind CSS 资源已通过 Service Worker 缓存，断网时样式正常加载
- **下载后乱码**：中文系统打开 `.js`、`.md` 等文本文件时，FormatHub 已自动附加 UTF-8 BOM，确保中文不乱码
- **GitHub 下载预览**：文件下载后浏览器可能直接预览，手机端可点击浏览器分享按钮保存到本地文件管理

## 📄 License

MIT
