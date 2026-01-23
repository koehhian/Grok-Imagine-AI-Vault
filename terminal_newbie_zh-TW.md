# 💻 電腦小白終端機入門指南

歡迎！如果你不熟悉「終端機 (Terminal)」或「命令提示字元 (CMD)」，這份指南將手把手教你如何啟動 **Grok Imagine AI Vault**。

## 1. 如何開啟終端機

### macOS 用戶
1. 按下 `Command + Space` 開啟 Spotlight 搜尋。
2. 輸入 **"Terminal"** 並按 `Enter`。
3. 會出現一個黑色視窗，這就是你的終端機。

### Windows 用戶
1. 按下鍵盤上的 `開始 (Start)` 鍵。
2. 輸入 **"PowerShell"** 或 **"cmd"** 並按 `Enter`。
3. 會出現一個藍色或黑色的視窗，這就是你的命令提示字元。

---

## 2. 環境準備

請依照順序，一段一段貼入下方指令並按 `Enter`。

### A. 檢查是否已安裝 Node.js
```bash
node -v
```
*如果顯示版本號（例如 v20.x.x），代表 OK！如果沒有，請去 [nodejs.org](https://nodejs.org/) 下載並安裝。*

### B. 下載專案程式碼
```bash
git clone https://github.com/koehhian/Grok-Imagine-AI-Vault.git
cd Grok-Imagine-AI-Vault
```

---

## 3. 啟動程式 (簡單 3 步驟)

請在終端機視窗中執行：

### 1. 安裝必要套件
```bash
npm install
```

### 2. 啟動後端伺服器 (負責自動備份圖片)
```bash
node server.js
```
*(請保持這個視窗開啟，不要關掉！)*

### 3. 啟動管理介面網頁 (需開啟「新」的終端機視窗)
請再開一個新的分頁或視窗，輸入：
```bash
cd Grok-Imagine-AI-Vault
npm run dev
```
現在，打開瀏覽器並輸入 `http://localhost:5173` 即可開始使用！

---

## 還是搞不定？
別擔心！你可以隨時在 GitHub 上開一個 [Issue](https://github.com/koehhian/Grok-Imagine-AI-Vault/issues) 留言詢問。

[⬅️ 返回首頁 README](README_zh-TW.md)
