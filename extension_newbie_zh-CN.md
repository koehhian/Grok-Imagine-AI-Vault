# 🧩 如何安装 Vault 助手扩展 (Extension)

如果你从未手动安装过浏览器插件，请参考以下步骤。只需一分钟即可完成！

## 1. 准备扩展文件夹
首先，请确保你已经下载了项目代码（请参考 [主指南](README_zh-CN.md#getting-started)）。
在项目目录中找到名为 `grok-extension` 的文件夹。

---

## 2. 将扩展加载到浏览器

### Chrome, Edge 或 Brave 用户
1. 打开浏览器，进入 `chrome://extensions/` (或是 `edge://extensions/`)。
2. **关键步骤：** 开启右上角的 **“开发者模式 (Developer mode)”** 开关。
3. 点击 **“加载解压缩的扩展 (Load unpacked)”** 按钮。
4. 选择你刚下载的项目文件夹中的 `grok-extension` 文件夹。
5. **成功！** 你现在应该能在工具栏看到“Vault 助手”的图标了。

### Firefox 用户
1. 打开 Firefox，进入 `about:debugging#/runtime/this-firefox`。
2. 点击 **“加载临时附加组件... (Load Temporary Add-on...)”**。
3. 导航至 `grok-extension` 文件夹，随便选一個里面的文件（例如 `manifest.json`）。
4. **注意：** Firefox 的临时扩展在重启浏览器后会消失。若要永久安装，则需经过 Mozilla 的正式签名（进阶操作）。

---

## 3. 开始使用
1. 前往 `https://grok.com/imagine`。
2. 画面右下角会出现一个可爱的小面板 **“Vault 助手”**。
3. 如果没看到，请刷新页面，或点击工具栏上的扩展图标。

[⬅️ 返回首页 README](README_zh-CN.md)
