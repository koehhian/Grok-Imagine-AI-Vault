<div align="center">
  <img src="public/logo.png" alt="Grok Imagine AI Vault Logo" width="120" />
</div>

# Grok Imagine AI Vault

[English](README.md) | **繁體中文** | [简体中文](README_zh-CN.md) | [日本語](README_ja.md)

一個專門為 [Grok.com](https://grok.com/imagine) 打造的優雅圖卡管理工具，讓你輕鬆收藏、分類與備份所有的 AI 作品。

[**🌐 線上點選體驗 (Live Demo)**](https://grok-imagine-ai-vault.vercel.app/) — 直接看看它的樣子！

---

### 🚀 快速上手 (三分鐘搞定)

1.  **安裝助手**：將 `grok-extension` 資料夾載入 Chrome 開發者模式（[新手安裝指南](extension_newbie_zh-TW.md)）。
2.  **擷取圖片**：在 Grok 網頁點擊助手面板的「複製全部」，或按住 `Shift` 拖曳框選圖片。
3.  **啟動本機**：執行 `node server.js` 與 `npm run dev`（[終端機啟動指南](terminal_newbie_zh-TW.md)）。
4.  **貼入收藏**：在 Vault 網頁按下 `Ctrl/Cmd + V` 貼上，搞定！

---

<div align="center">
  <img src="public/preview.png" alt="App Preview" width="100%" style="border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" />
</div>

## ✨ 核心亮點

### 🎨 沉浸式使用者介面
- **瀑布流畫廊 (Masonry Gallery)**：流暢且響應式的佈局，讓瀏覽 AI 創作成為享受。
- **全螢幕投影片 (Slideshow)**：劇院級燈箱預覽，支援 **自動播放** 與可自訂的切換間隔 (1-60秒)。
- **深色模式美學**：採用深鋅色調介面，減少眼睛疲勞並提升質感。
- **macOS 風格扇形 UI**：創新的「衍生作品展示 (Derivative Fan-out)」邏輯，用於查看圖片變化與影片。
- **Sparkles 魔法閃爍指示器**：精緻的 AI 變化版動態標示。
- **分類導覽式設定選單**：專業的雙欄式側邊欄介面 (隱私、備份、網路)。

### 🛡️ 隱私與可靠性
- **隱私模糊模式**：即時糊化畫廊以利螢幕分享，支援「預設模糊」持久化設定。
- **圖片本地備份 (快取)**：自動將縮圖下載至本地空間，防止 CDN 連結失效。
- **進階安全性**：強化過濾規則，確保個人資料庫不會意外上傳至 GitHub。

### 🌐 連線與網路
- **區網存取模式 (LAN Access)**：一鍵開啟，讓同一個 Wi-Fi 下的其他裝置也能造訪保管庫。
- **真・IP 自動偵測**：後端自動偵測伺服器所在的區域網路 IP（如 `192.168.x.x`），方便跨裝置連線。

### 🧩 Vault 助手 (Chrome 擴充功能)
- **自動捕捉 (Auto-Capture)**：iOS 風格開關，可在瀏覽 Grok.com 時無縫攔截圖片。
- **套索選取 (Lasso Selection)**：流暢的範圍選取工具，便於批次管理圖片。
- **「批次按讚」功能**：一鍵同時對所有偵測到的圖片按讚，確保連結持久。

### 📦 數據管理
- **系統批次下載**：將所有創作依序直接下載到電腦的 **系統下載資料夾**。
- **JSON 匯入/匯出**：強大的資料備份與還原功能。
- **重複項保護**：在加入項目時具備智慧型去重功能，告別雜訊。

---

## 💡 小提示：如何長久保存圖片？

> [!TIP]
> **強烈建議**在 Grok.com 上為妳喜歡的圖片**按愛心 (❤️)**。
> 這會將圖片存入妳的帳號資訊中，有效減少圖片過期無法存取的風險。妳可以使用 Vault 助手的「❤️ 批次按愛心」按鈕快速完成。

## 🛠️ 如何加入圖卡？

1.  **批次貼上**：直接在管理介面貼上多個連結（用換行、逗號或空格分隔）。
    *   範例：
        ```text
        https://grok.com/imagine/post/e8910ae5-f4e5-42d4-ae10-b5852027ae69
        https://grok.com/imagine/post/946bef9e-8884-4960-856e-336ae977ad97
        ```
2.  **拖放功能**：直接從 Grok 網頁或本地資料夾將圖片拖入管理介面，系統會自動識別。
3.  **Vault 助手 (推薦)**：安裝 [grok-extension](grok-extension/) 以獲得自動擷取體驗。

<div align="center">
  <img src="public/extension_zh.png" alt="Extension Screenshot" width="80%" style="border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" />
</div>

## 🚀 開始使用

1.  **準備**：確保本機已安裝 [Node.js](https://nodejs.org/)。
2.  **安裝**：
    ```bash
    git clone https://github.com/koehhian/Grok-Imagine-AI-Vault.git
    cd Grok-Imagine-AI-Vault
    npm install
    ```
3.  **啟動**：執行 `node server.js` (備份伺服器) 與 `npm run dev` (管理介面)。

---

> **不懂如何使用終端機？** 請參考 [💻 終端機新手指南](terminal_newbie_zh-TW.md)
> **不懂如何安裝套件？** 請參考 [🧩 套件安裝新手指南](extension_newbie_zh-TW.md)

## 授權 (License)

本專案採用 **GNU GPL v3** 開源授權。詳情請見 [LICENSE](https://www.gnu.org/licenses/gpl-3.0.html)。

## 請我喝杯咖啡 (Buy Me a Coffee)

如果你覺得這個工具對你有幫助，歡迎請我喝杯咖啡支持開發！☕️
[**請我喝杯咖啡**](https://buymeacoffee.com/koehhian)
