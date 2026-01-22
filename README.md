<div align="center">
  <img src="public/logo.png" alt="Grok Imagine AI Vault Logo" width="120" />
</div>

# Grok Imagine AI Vault

**English** | [繁體中文](README_zh-TW.md) | [简体中文](README_zh-CN.md) | [日本語](README_ja.md)

<div align="center">
  <img src="public/preview.png" alt="App Preview" width="100%" style="border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" />
</div>

An elegant repository for managing and organizing your AI-generated images, specifically optimized for Grok.

## 💎 Advanced Tool: Grok Link Detector

To efficiently capture links from `grok.com/imagine`:

1.  **Install Tampermonkey**: A browser extension for userscripts.
2.  **Add Script**: Create a new script and paste the content of [`grok-detector.js`](grok-detector.js).
3.  **Capture**: Scroll through Grok's gallery; the detector will automatically capture links.
4.  **Sync**: Click **"Copy for Vault"** and then use the **"Import"** function in your AI Vault.

---
🚀 Happy Archiving!

## Features

- **Comprehensive Grok Link Support**: Support for `post`, `video`, `share`, and direct `imagine-public` image links.
- **Auto-Thumbnail & UUID Extraction**: Automatically extracts UUIDs from various Grok link formats to generate .jpg thumbnails.
- **CDN-to-Post Magic**: Dragging a Grok CDN image link automatically converts it to a canonical Grok post URL while keeping the image as a high-quality thumbnail.
- **Robust Drag-and-Drop**: Intelligent filtering of Base64 data and improved compatibility across different browsers and drop sources.
- **Data Portability**: Easily Export and Import your entire vault data (JSON) for simple device switching.
- **Multi-Tag System**: Organize images with multiple categories; filter by tags with a custom dropdown.
- **Grok-Style UI**: A minimal, high-contrast dark mode aesthetic with a **Sticky Header** for easy navigation.
- **Batch Operations**: Support for multi-selection, bulk deletion, and tag organization. Bulk add supports newlines, commas, and spaces.
- **Privacy First**: Built-in privacy blur toggle for discrete browsing.

## Usage Tips

### Grok Thumbnails
For the best experience with Grok Imagine links:
> [!IMPORTANT]
> **Static Image Requirement**: When copying a public post link from Grok, ensure you are viewing a **static image**. If you copy a link while the image is still generating or in a dynamic view, the thumbnail derivation may fail.

### Manual Video Thumbnails
Currently, videos (including image links that have already been made into videos) do not support automatic thumbnails and need to be added manually. The method is simple:
1. Click the icon popup on the card to open the Grok page.
2. Manually switch from **Video** to **Image** in Grok.
3. Drag the preview image back to the **Grok Imagine AI Vault** card to add the thumbnail.

### Batch Upload
You can paste multiple links in the bulk add field. It supports separators like **newlines**, **commas**, or **spaces**. You can also specify tags for the entire batch at once.

### Export/Import
Use the **Export** ![export](assets/export.png) and **Import** ![import](assets/import.png) buttons in the header to backup your data or transfer it to another Vault instance.

## Tech Stack

- **Frontend**: React, TailwindCSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express.
- **Storage**: JSON-based flat file system (`data/links.json`).

## Getting Started

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   node server.js & npm run dev
   ```
4. Open [http://localhost:5179](http://localhost:5179) in your browser.

## License

This project is licensed under the **GNU GPL v3**. See the [LICENSE](https://www.gnu.org/licenses/gpl-3.0.html) for details.

## Buy Me a Coffee

If you find this tool helpful and want to support its development, feel free to buy me a coffee!
[Donation link](https://buymeacoffee.com/koehhian)
