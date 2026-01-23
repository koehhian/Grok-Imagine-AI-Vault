# 💻 电脑小白终端机入门指南

欢迎！如果你不熟悉“终端机 (Terminal)”或“命令提示符 (CMD)”，这份指南将手把手教你如何启动 **Grok Imagine AI Vault**。

## 1. 如何开启终端机

### macOS 用户
1. 按下 `Command + Space` 开启 Spotlight 搜索。
2. 输入 **"Terminal"** 并按 `Enter`。
3. 会出现一个黑色窗口，这就是你的终端机。

### Windows 用户
1. 按下键盘上的 `开始 (Start)` 键。
2. 输入 **"PowerShell"** 或 **"cmd"** 并按 `Enter`。
3. 会出现一个蓝色或黑色的窗口，这就是你的命令提示符。

---

## 2. 环境准备

请依照顺序，一段一段贴入下方指令并按 `Enter`。

### A. 检查是否已安装 Node.js
```bash
node -v
```
*如果显示版本号（例如 v20.x.x），代表 OK！如果没有，请去 [nodejs.org](https://nodejs.org/) 下载并安装。*

### B. 下载项目代码
```bash
git clone https://github.com/koehhian/Grok-Imagine-AI-Vault.git
cd Grok-Imagine-AI-Vault
```

---

## 3. 启动程序 (简单 3 步骤)

请在终端机窗口中执行：

### 1. 安装必要组件
```bash
npm install
```

### 2. 启动后端服务器 (负责自动备份图片)
```bash
node server.js
```
*(请保持这个窗口开启，不要关闭！)*

### 3. 启动管理界面网页 (需开启“新”的终端机窗口)
请再开一个新的分页或窗口，输入：
```bash
cd Grok-Imagine-AI-Vault
npm run dev
```
现在，打开浏览器并输入 `http://localhost:5173` 即可开始使用！

---

## 还是搞不定？
别担心！你可以随时在 GitHub 上开一个 [Issue](https://github.com/koehhian/Grok-Imagine-AI-Vault/issues) 留言询问。

[⬅️ 返回首页 README](README_zh-CN.md)
