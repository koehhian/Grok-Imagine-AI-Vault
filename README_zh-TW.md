<div align="center">
  <img src="public/logo.png" alt="Grok Imagine AI Vault Logo" width="120" />
</div>

# Grok Imagine AI Vault

[English](README.md) | **繁體中文**

<div align="center">
  <img src="public/preview.png" alt="App Preview" width="100%" style="border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" />
</div>

這是一個專為 Grok 設計的 AI 生成圖片管理系統，讓你能優雅、高效地整理你的創意作品。

## 功能特色

- **自動縮圖生成 (Automated Thumbnail Generation)**: 自動從 Grok 貼文連結推導並顯示縮圖。
- **資料可攜性 (Data Portability)**: 輕鬆匯出與匯入完整的 JSON 資料庫，方便在不同裝置間遷移。
- **多標籤系統 (Multi-Tag System)**: 支援多標籤分類管理，並提供「更多標籤」下拉式選單方便過濾。
- **智慧去重 (Smart Deduplication)**: 自動防止重複加入相同的連結。
- **Grok 風格介面**: 極簡、高對比的深色模式設計，完美契合 AI 美學。
- **批次操作 (Batch Operations)**: 支援多選、批次刪除與批次標籤管理。
- **隱私優先 (Privacy First)**: 內建一鍵模糊功能，保護瀏覽隱私。
- **搜尋與過濾**: 可透過標題、網址或標籤快速查找圖片。

## 使用技巧

### Grok 縮圖
為了獲得最佳體驗：
> [!IMPORTANT]
> **靜態圖片要求**: 從 Grok複製公開貼文連結時，請確保你是在查看 **靜態圖片 (Static Image)** 的狀態。如果你在圖片生成中或動態預覽時複製連結，可能會導致縮圖無法正確讀取。

### 批量上傳
你可以在批量新增欄位中貼上多個連結（每行一個），並一次性為它們加上標籤。

### 匯出/匯入 (Export/Import)
使用頁首的 **匯出** ![export](assets/export.png)與 **匯入** ![import](assets/import.png)按鈕來備份你的資料，或將資料轉移到另一個 Vault 實例。

## 技術棧

- **Frontend**: React, TailwindCSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express.
- **Storage**: JSON-based flat file system (`data/links.json`).

## 快速開始

1. Clone 此專案。
2. 安裝依賴：
   ```bash
   npm install
   ```
3. 啟動應用程式：
   ```bash
   node server.js & npm run dev
   ```
4. 在瀏覽器打開 [http://localhost:5179](http://localhost:5179)。

## 授權 (License)

本專案採用 **GNU GPL v3** 開源授權。詳情請見 [LICENSE](https://www.gnu.org/licenses/gpl-3.0.html)。

## 請我喝杯咖啡 (Buy Me a Coffee)

如果你覺得這個工具對你有幫助，歡迎請我喝杯咖啡支持開發！
[贊助連結](https://buymeacoffee.com/koehhian)
