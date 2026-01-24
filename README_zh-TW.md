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

-   **分類導覽式設定選單**：專業的雙欄式側邊欄介面，將設定細分為 **隱私**、**備份** 與 **網路**，邏輯更清晰。
-   **智慧識別圖卡資訊**：拖放圖片或貼上複雜數據時，系統會自動提取原始 Grok ID，且**重複的連結會自動過濾**，告別雜訊。
-   **本機自動備份**：開啟伺服器後，系統會自動將遠端圖片縮圖下載至本機快取，防止網址失效。
-   **批量下載到系統**：直接將所有收藏的作品下載到你的**「系統預設下載資料夾」**，方便隨時調用。
-   **隱私與美學**：支援「隱私模糊」模式、沉浸式畫中畫預覽、以及採用 Stars (星星) 與 Aperture (光圈) 等高級圖示的精品介面。
-   **Vault 助手 (套件)**：支援自動偵測、範圍導出、套索工具，並提供「批次按愛心」功能以保證連結持久。

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
