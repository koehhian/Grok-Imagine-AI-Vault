<div align="center">
  <img src="public/logo.png" alt="Grok Imagine AI Vault Logo" width="120" />
</div>

# Grok Imagine AI Vault

[English](README.md) | [繁體中文](README_zh-TW.md) | **简体中文** | [日本語](README_ja.md)

<div align="center">
  <img src="public/preview.png" alt="App Preview" width="100%" style="border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" />
</div>

这是一个专为 Grok 设计的 AI 生成图片管理系统，让你能优雅、高效地整理你的创意作品。

## 功能特色

- **自动缩略图生成 (Automated Thumbnail Generation)**: 自动从 Grok 帖子链接推导并显示缩略图。
- **数据可移植性 (Data Portability)**: 轻松导出与导入完整的 JSON 数据库，方便在不同设备间迁移。
- **多标签系统 (Multi-Tag System)**: 支持多标签分类管理，并提供“更多标签”下拉菜单方便过滤。
- **智能去重 (Smart Deduplication)**: 自动防止重复加入相同的链接。
- **Grok 风格界面**: 极简、高对比度的深色模式设计，完美契合 AI 美学。
- **批量操作 (Batch Operations)**: 支持多选、批量删除与批量标签管理。
- **隐私优先 (Privacy First)**: 内置一键模糊功能，保护浏览隐私。
- **搜索与过滤**: 可通过标题、网址或标签快速查找图片。

## 使用技巧

### Grok 缩略图
为了获得最佳体验：
> [!IMPORTANT]
> **静态图片要求**: 从 Grok 复制公开帖子链接时，请确保你是在查看 **静态图片 (Static Image)** 的状态。如果你在图片生成中或动态预览时复制链接，可能会导致缩略图无法正确读取。

### 视频手动缩略图
目前视频（包括已制作过视频的图片链接）不支持自动缩略图，需手动加入，方法如下：
1. 点击卡片上的图标弹窗，开启 Grok 页面。
2. 在 Grok 中手动从 **视频 (Video)** 切换到 **图片 (Image)**。
3. 将该图片直接**拖拽**回到 Grok Imagine AI Vault 的卡片上，即可完成缩略图绑定。

### 批量上传
你可以在批量新增字段中粘贴多个链接（每行一个），并一次性为它们加上标签。

### 导出/导入 (Export/Import)
使用页首的 **导出** ![export](assets/export.png) 与 **导入** ![import](assets/import.png) 按钮来备份你的数据，或将数据转移到另一个 Vault 实例。

## 技术栈

- **Frontend**: React, TailwindCSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express.
- **Storage**: JSON-based flat file system (`data/links.json`).

## 快速开始

1. Clone 此项目。
2. 安装依赖：
   ```bash
   npm install
   ```
3. 启动应用程序：
   ```bash
   node server.js & npm run dev
   ```
4. 在浏览器打开 [http://localhost:5179](http://localhost:5179)。


## 💎 进阶神器：Grok Link Detector

如何有效率获取 `grok.com/imagine` 链接：

1.  **安装 Tampermonkey**：浏览器油猴插件。
2.  **建立脚本**：建立新脚本，並貼入 [`grok-detector.js`](grok-detector.js) 的内容。
3.  **自动捕捉**：在 Grok 页面滚动，右下角会显示捕捉数量。
4.  **同步入库**：点击 **"Copy for Vault"**，然后在您的 Vault 中使用“导入 (Import)”功能即可。

---
🚀 祝您的 AI 创作库日益壮大！

## 授权 (License)

本道目采用 **GNU GPL v3** 开源授权。详情请见 [LICENSE](https://www.gnu.org/licenses/gpl-3.0.html)。

## 请我喝杯咖啡 (Buy Me a Coffee)

如果你觉得这个工具对你有帮助，欢迎请我喝杯咖啡支持开发！
[赞助链接](https://buymeacoffee.com/koehhian)
