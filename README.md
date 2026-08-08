FormatHub — 纯前端多格式转换工具

✨ 功能特性

• **纯前端处理** — 所有转换在浏览器本地完成，文件不上传任何服务器，保护隐私
 
• **支持 40+ 格式** — 文档、图片、数据、电子书、压缩包五大分类
 
• **批量转换** — 一次上传多个文件，支持批量设置目标格式
 
• **文件预览** — 上传后即时预览：图片缩略图、文档前 500 字、表格前 10 行、压缩包文件列表
    
• **多选操作** — 支持勾选多个文件进行合并下载、压缩下载或压缩合并下载
    
• **图片高级处理** — 支持质量调节、尺寸裁剪、旋转（0°/90°/180°/270°）
    
• **JSON 格式化** — 美化、压缩、校验 JSON 文件
    
• **文件合并** — 文档/电子书/数据/图片均可合并（图片合并为 PDF）
    
• **多语言** — 中文 / English 一键切换
    
• **PWA 离线支持** — 安装为桌面应用，断网也能用
    
• **响应式设计** — 完美适配手机、平板、电脑

📂 支持格式

分类	支持格式	可转换目标

📄 文档	DOCX, XLSX/XLS/CSV/ODS, TXT, MD, HTML	TXT, MD, HTML, PDF, CSV, JSON, XLSX

🖼️ 图像	JPG/JPEG, PNG, GIF, BMP, WebP, TIFF/TIF, SVG	PNG, JPG, WebP, GIF, BMP

💾 数据	JSON, XML, CSV, YAML/YML, TOML, ZIP	JSON, XML, CSV, YAML, TOML, ZIP

📚 电子书	EPUB, MOBI, AZW3	TXT, HTML

🚀 快速开始
 
# 安装依赖
npm install
 
# 本地开发
npm run dev
 
# 构建（输出到 dist 目录）
npm run build

🛠️ 技术栈
    • **Vite** — 构建工具
    • **Tailwind CSS** — 样式框架
    • **原生 JS** — 纯前端逻辑，无框架依赖
    • **第三方库** — JSZip, PapaParse, js-yaml, XLSX, Mammoth, html2canvas, jsPDF（CDN 引入）

📱 使用提示
    • 单文件最大支持 **200MB**
    • 在分类页内按 `Ctrl+V` 可直接粘贴截图或文件
    • 转换完成后可选择「普通下载」「压缩下载」「合并下载」「压缩合并下载」
    • 所有转换结果均可对比原文件/新文件大小变化

📄 License
MIT