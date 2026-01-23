<div align="center">
  <img src="public/logo.png" alt="Grok Imagine AI Vault Logo" width="120" />
</div>

# Grok Imagine AI Vault

[English](README.md) | [繁體中文](README_zh-TW.md) | **简体中文** | [日本語](README_ja.md)

一个专门为 [Grok.com](https://grok.com/imagine) 打造的优雅图卡管理工具，让你轻松收藏、分类与备份所有的 AI 作品。

[**🌐 线上点选体验 (Live Demo)**](https://grok-imagine-ai-vault.vercel.app/) — 直接看看它的样子！

---

### 🚀 快速上手 (三分钟搞定)

1.  **安装助手**：将 `grok-extension` 文件夹加载到 Chrome 开发者模式（[新手安装指南](extension_newbie_zh-CN.md)）。
2.  **抓取图片**：在 Grok 网页点击助手面板的“复制全部”，或按住 `Shift` 拖拽框选图片。
3.  **启动本地**：执行 `node server.js` 与 `npm run dev`（[终端启动指南](terminal_newbie_zh-CN.md)）。
4.  **贴入收藏**：在 Vault 网页按下 `Ctrl/Cmd + V` 粘贴，搞定！

---

<div align="center">
  <img src="public/preview.png" alt="App Preview" width="100%" style="border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" />
</div>

## ✨ 核心亮点

-   **沉浸式 Web 管理界面**：深色模式、瀑布流布局，优雅浏览你的所有 Grok作品。支持多选、批量删除与标签管理。
-   **智能识别图卡信息**：拖放图片或粘贴复杂数据时，系统会自动提取原始 Grok ID，告别噪音。
-   **本地自动备份**：开启服务器后，系统会自动将远程图片下载至本地 `backups/` 文件夹，防止网址失效。
-   **隐私与美学**：支持“隐私模糊”模式、沉浸式画中画预览、以及强大的标签管理系统。
-   **Vault 助手 (插件)**：支持自动侦测、范围导出、套索工具，并提供“批量按爱心”功能以保证链接持久。

## 💡 小提示：如何长久保存图片？

> [!TIP]
> **强烈建议**在 Grok.com 上为你喜欢的图片**点赞 (❤️)**。
> 这会将图片存入你的账号信息中，有效减少图片过期无法访问的风险。你可以使用 Vault 助手的“❤️ 批量按爱心”按钮快速完成。

## 🛠️ 如何加入图卡？

1.  **批量粘贴**：直接在管理界面粘贴多个链接（用换行、逗號或空格分隔）。
    *   示例：
        ```text
        https://grok.com/imagine/post/e8910ae5-f4e5-42d4-ae10-b5852027ae69
        https://grok.com/imagine/post/946bef9e-8884-4960-856e-336ae977ad97
        ```
2.  **拖放功能**：直接从 Grok 网页或本地文件夹将图片拖入管理界面，系统会自动识别。
3.  **Vault 助手 (推荐)**：安装 [grok-extension](grok-extension/) 以获得自动抓取体验。

<div align="center">
  <img src="public/extension_zh.png" alt="Extension Screenshot" width="80%" style="border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" />
</div>

---

## 📸 媒体制作指南 (Media Production Guide)

若要制作吸引人的社交分享素材，建议录制这四段核心画面：
1.  **极简工作流**：将 Grok 图片拖入 Vault，展示它瞬间出现并识别的样子。
2.  **套索选取 (Lasso)**：按住 `Shift` 并框选一群图片，展示流畅的青色选取效果。
3.  **即时插件侦测**：滚动 Grok 画廊，展示助手面板上的计数器不断跳动。
4.  **可视化 Vault**：快速滚动并展示你已经分类、打好标签的大型精美画廊。

---

> **不懂如何使用终端？** 请参考 [💻 终端新手指南](terminal_newbie_zh-CN.md)
> **不懂如何安装插件？** 请参考 [🧩 插件安装新手指南](extension_newbie_zh-CN.md)

## 授权 (License)

本项目采用 **GNU GPL v3** 开源授权。详情请见 [LICENSE](https://www.gnu.org/licenses/gpl-3.0.html)。

## 请我喝杯咖啡 (Buy Me a Coffee)

如果你觉得这个工具对你有帮助，欢迎请我喝杯咖啡支持开发！
