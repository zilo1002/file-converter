# FormatHub

> 纯前端多格式转换工具 —— 浏览器直接处理，不上传服务器，支持 40+ 格式互转 + GitHub/Gitee 代码下载。

![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![PWA](https://img.shields.io/badge/PWA-Supported-5A0FC8?logo=pwa)

---

## 功能亮点

| 功能 | 说明 |
|------|------|
| 📄 **文档转换** | Word、Excel、PPT、PDF、TXT、Markdown、HTML 等格式互转 |
| 🖼️ **图像转换** | JPG、PNG、WebP、GIF、BMP、SVG 等格式互转，支持压缩/旋转/尺寸调整 |
| 📚 **电子书转换** | EPUB、MOBI、AZW3 → TXT / HTML |
| 💾 **数据格式互转** | JSON、XML、CSV、YAML、TOML 等格式互转，支持 ZIP 提取/打包 |
| 📕 **PDF 工具箱** | PDF 拆分、合并、水印、密码保护 |
| 🐙 **GitHub 下载** | 粘贴链接直接下载文件/文件夹/仓库根目录/Release 资产，支持镜像源加速 |
| 🔷 **Gitee 下载** | 国内镜像平台，访问更流畅 |
| 🪞 **镜像源切换** | GitHub Raw 支持 GHProxy / Mirror.gh / FastGit 加速 |
| 🔁 **断点续传** | 大文件夹下载中断后可恢复，避免重复下载 |
| 🌐 **中英双语** | 一键切换中文/英文界面 |
| 📱 **全平台适配** | 手机/平板/电脑自适应，PWA 支持离线使用 |
| 🔒 **完全免费** | 无广告、无注册、无限制 |

---

## 支持格式一览

### 文档

| 源格式 | 目标格式 |
|--------|---------|
| DOCX | TXT、Markdown、HTML、PDF |
| XLSX / XLS / CSV / ODS | CSV、JSON、HTML、XLSX |
| TXT / Markdown | PDF、HTML、DOCX |
| PDF / PPT / PPTX / ODP / KEY / DOC / RTF / ODT / PAGES / XLSM | ⚠️ 暂不支持转换 |

### 图像

| 源格式 | 目标格式 |
|--------|---------|
| JPG / JPEG / PNG / GIF / BMP / WebP / TIFF / TIF | 互转全部格式 |
| SVG | PNG、JPG、WebP、BMP |
| HEIC / AVIF | ⚠️ 暂不支持转换 |

### 电子书

| 源格式 | 目标格式 |
|--------|---------|
| EPUB | TXT、HTML |
| MOBI / AZW3 | TXT |
| PDF | ⚠️ 暂不支持转换 |

### 数据与压缩包

| 源格式 | 目标格式 |
|--------|---------|
| JSON / XML / CSV / YAML / YML / TOML | 互转全部格式 |
| ZIP | 提取内容 / 重新打包 |
| RAR / 7Z | ⚠️ 暂不支持转换 |

### 代码仓库下载

| 平台 | 支持类型 |
|------|---------|
| GitHub | 单文件(blob)、文件夹(tree)、仓库根目录、Release 资产 |
| Gitee | 单文件(blob)、文件夹(tree)、仓库根目录 |

---

## 隐私与安全

- **纯本地处理**：所有文件转换均在浏览器内完成，不上传任何服务器
- **无账号体系**：无需注册、无需登录、无数据收集
- **离线可用**：PWA 安装后断网也能使用核心功能
- **代码下载直连**：GitHub/Gitee 下载走浏览器原生 fetch，不经过第三方代理服务器

---

## 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl + V` | 粘贴文件/截图到当前转换页面 |
| `Ctrl + A` | 全选文件列表 |
| `Esc` | 关闭弹窗/模态框 |
| `Enter` | 确认下载/转换（焦点在按钮时） |

---

## 项目结构

```
src/
├── main.js                 # 主入口：路由、UI 渲染、事件绑定
├── utils.js                # 工具函数：i18n、文件操作、下载、断点续传 IndexedDB
├── converters/
│   ├── github.js           # GitHub 链接解析 + 文件/文件夹/Release 下载
│   ├── gitee.js            # Gitee 链接解析 + 文件/文件夹下载
│   ├── image.js            # 图像格式转换（Canvas）
│   ├── document.js         # 文档格式转换
│   ├── data.js             # 数据格式转换
│   ├── ebook.js            # 电子书格式转换
│   ├── archive.js          # 压缩包处理
│   └── format.js           # JSON 格式化
├── workers/
│   ├── data.worker.js      # 数据转换 Worker
│   ├── doc.worker.js       # 文档转换 Worker
│   └── ebook.worker.js     # 电子书转换 Worker
└── index.html              # 入口 HTML（含 Tailwind CDN + JSZip）
```

---

## 技术栈

| 技术 | 用途 |
|------|------|
| **ES Modules** | 原生模块化，无打包依赖 |
| **Tailwind CSS** | 原子化样式，暗色主题 |
| **Web Workers** | 大数据/文档转换不阻塞主线程 |
| **JSZip** | ZIP 打包与解压 |
| **IndexedDB** | 断点续传进度持久化 |
| **GitHub Tree API** | 一次性获取完整文件树（无需递归） |
| **PWA** | Service Worker 离线缓存 |

---

## 使用提示（踩坑经验）

1. **GitHub 根目录下载**：直接粘贴 `github.com/owner/repo` 即可下载整个仓库，无需手动找 tree 链接；也支持 `github.com/owner/repo/tree/main` 格式的根目录链接
2. **镜像源加速**：国内用户若 GitHub Raw 访问慢，可在下载页切换 GHProxy / Mirror.gh / FastGit
3. **大文件夹下载**：22+ 文件的嵌套文件夹已验证可用，中断后刷新页面可续传
4. **下载预览与保存**：部分文件下载后浏览器会直接预览（而非保存），手机端需点击浏览器**分享按钮 → 保存到本地文件管理**，电脑端可右键另存为
5. **API 速率限制**：GitHub 未认证 API 限 60 次/小时，文件夹下载仅消耗 1 次 API 调用（Tree API）
6. **中文防乱码**：`.js` `.md` `.txt` 等文本文件下载时自动附加 UTF-8 BOM，避免手机系统用 GBK 打开乱码

---

## License

MIT License — 自由使用、修改、分发。
