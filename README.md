# FormatHub

[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![PWA](https://img.shields.io/badge/PWA-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

纯前端多格式转换工具，支持文档、图片、电子书、数据格式互转，以及 GitHub / Gitee 仓库下载。

## 功能亮点

- **40+ 格式互转**：文档、图片、电子书、数据格式一键转换
- **GitHub / Gitee 下载**：支持文件、文件夹 ZIP 打包下载，镜像源加速
- **纯文件下载（扁平化）**：下载无层级 ZIP，解压即得平铺文件，可选保留路径或仅文件名
- **断点续传**：大文件夹下载中途断网，刷新后可继续
- **本地处理**：浏览器内完成，不上传服务器
- **PWA 支持**：可安装为桌面应用，离线可用

## 支持格式一览

| 分类 | 输入格式 | 输出格式 |
|------|---------|---------|
| 文档与办公 | DOCX, DOC, TXT, MD, HTML, PDF, XLSX, XLS, CSV, ODS, PPT, PPTX, ODP, KEY, PAGES, RTF, ODT | DOCX, TXT, MD, HTML, PDF, CSV, JSON, XLSX |
| 图像与图片 | JPG, JPEG, PNG, GIF, BMP, WebP, TIFF, TIF, SVG | PNG, JPG, WebP, GIF, BMP |
| 电子书 | EPUB, MOBI, AZW3 | TXT, HTML |
| 数据与压缩包 | JSON, XML, CSV, YAML, YML, TOML, ZIP | JSON, XML, CSV, YAML, TOML, ZIP |
| PDF 工具箱 | PDF | 拆分、合并、水印、加密 |
| 代码仓库下载 | GitHub / Gitee 链接 | ZIP 打包（保留结构）/ 纯文件 ZIP（扁平化） |

## 隐私与安全

- 所有转换均在浏览器本地完成，文件不会上传到任何服务器
- GitHub / Gitee 下载直接走浏览器原生 fetch，不经过第三方代理
- 断点续传进度保存在本地 IndexedDB，不上传云端

## 快捷键

| 快捷键 | 功能 |
|--------|------|
| Ctrl + V | 粘贴文件/截图到当前分类 |

## 项目结构

```
├── public/
├── src/
│   ├── converters/
│   │   ├── github.js      # GitHub 链接解析与下载（含扁平化下载）
│   │   ├── gitee.js       # Gitee 链接解析与下载（含扁平化下载）
│   │   ├── archive.js     # ZIP 提取与打包
│   │   ├── image.js       # 图片格式转换
│   │   ├── document.js    # 文档格式转换
│   │   ├── data.js        # 数据格式转换
│   │   ├── ebook.js       # 电子书转换
│   │   └── format.js      # JSON 格式化
│   ├── workers/           # Web Worker 线程池
│   ├── main.js            # 主入口与 UI 渲染
│   ├── utils.js           # 工具函数与 i18n
│   └── style.css
├── index.html
├── vite.config.js
└── package.json
```

## 技术栈

- **Vite** — 构建工具
- **Vanilla JS** — 无框架，纯原生 JavaScript
- **Tailwind CSS** — 样式
- **JSZip** — ZIP 打包与解压
- **Web Worker** — 大文件转换不阻塞主线程
- **IndexedDB** — 断点续传进度持久化
- **PWA** — Service Worker 离线缓存
- **GitHub Tree API** — 递归获取仓库文件列表

## 使用提示

1. **根目录下载**：支持 `github.com/owner/repo` 直接下载整个仓库，无需指定子路径
2. **镜像源加速**：GitHub 下载可选择 GHProxy、Mirror.gh 等镜像源，提升国内访问速度
3. **大文件夹续传**：如果下载中途关闭页面，再次输入相同链接会提示是否继续下载
4. **API 速率限制**：GitHub API 每小时限 60 次，超限后请等待 1 小时或切换到镜像源
5. **UTF-8 BOM 防乱码**：下载的文本文件自动添加 BOM，避免 Windows 记事本打开乱码
6. **下载预览保存**：下载后部分文件会在浏览器中预览，请点击分享按钮保存到本地文件管理
7. **纯文件下载（扁平化）**：选择此模式后，下载的 ZIP 解压后无文件夹层级，所有文件平铺在同一目录。支持两种路径处理方式：
   - **保留路径信息**：`src/utils/helper.js` → `src_utils_helper.js`
   - **仅文件名**：`src/utils/helper.js` → `helper.js`（重名自动编号为 `helper_1.js`）

## License

MIT
