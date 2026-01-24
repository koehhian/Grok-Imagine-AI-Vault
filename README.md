<div align="center">
  <img src="public/logo.png" alt="Grok Imagine AI Vault Logo" width="120" />
</div>

# Grok Imagine AI Vault

**English** | [繁體中文](README_zh-TW.md) | [简体中文](README_zh-CN.md) | [日本語](README_ja.md)

An elegant management tool designed for [Grok.com](https://grok.com/imagine), allowing you to collect, categorize, and backup all your AI-generated works effortlessly.

[**🌐 Live Demo**](https://grok-imagine-ai-vault.vercel.app/) — See it in action!

---

### 🚀 Quick Start (3-Minute Setup)

1.  **Install Helper**: Load the `grok-extension` folder into Chrome Developer Mode ([Installation Guide](extension_newbie.md)).
2.  **Capture Images**: Click "COPY ALL" on the helper panel in Grok, or use `Shift + Drag` to select images.
3.  **Start Local**: Run `node server.js` and `npm run dev` ([Terminal User Guide](terminal_newbie.md)).
4.  **Paste & Save**: Press `Ctrl/Cmd + V` on the Vault web page, and you're done!

---

<div align="center">
  <img src="public/preview_en.png" alt="App Preview" width="100%" style="border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" />
</div>

## ✨ Key Features

### 🎨 Immersive User Interface
- **Masonry Gallery**: Smooth, responsive waterfall layout for browsing AI creations.
- **Fullscreen Slideshow**: Cinema-grade lightbox with **Auto-Play** mode and customizable transition intervals (1-60s).
- **Dark Mode Aesthetic**: Deep zinc-themed interface for reduced eye strain and premium feel.
- **macOS-style Fan-out UI**: Innovative "Derivative Fan-out" logic for viewing image variations and videos.
- **Sparkles Indicator**: High-performance indicator for AI-generated variations.
- **Categorized Settings Menu**: A professional sidebar-based settings UI (Privacy, Backup, Network).

### 🛡️ Privacy & Reliability
- **Privacy Blur Mode**: Immediate gallery obfuscation for screen sharing, with persistent "Default Blur" settings.
- **Local Backup (Cache)**: Automatic downloading of thumbnails to local storage to prevent CDN link expiration.
- **Advanced Security**: Enhanced exclusions to ensure personal databases are never uploaded to GitHub.

### 🌐 Connectivity & Networking
- **LAN Access Mode**: One-click toggle to allow other devices on the same Wi-Fi to visit the vault.
- **Real-IP Detection**: Automatic detection of the server's local IP (e.g., `192.168.x.x`) for easy cross-device connection.

### 🧩 Vault Helper (Chrome Extension)
- **Auto-Capture**: iOS-style toggle to seamlessly intercept images while browsing Grok.com.
- **Lasso Selection**: Fluid range selection tool for bulk managing images.
- **"Batch Like" Feature**: One-click hearting of all detected images to ensure link longevity.

### 📦 Data Management
- **System Batch Download**: Serial downloading of all creations directly to your **System Downloads Folder**.
- **JSON Import/Export**: Robust backup and restoration of the entire vault database.
- **Duplicate Protection**: Intelligent deduplication during link additions.

---

## 💡 Pro Tip: How to keep your images forever?

> [!TIP]
> **Highly recommended**: ALWAYS **"Like" (❤️)** your favorite images on Grok.com.
> This associates the images with your account metadata, significantly reducing the risk of links becoming inaccessible. You can use the "❤️ LIKE BATCH" button in the Vault Helper to do this quickly.

## 🛠️ How to Add Items?

1.  **Bulk Paste**: Paste one or more Grok Imagine links directly into the Vault interface (separated by newline, comma, or space).
    *   Examples:
        ```text
        https://grok.com/imagine/post/e8910ae5-f4e5-42d4-ae10-b5852027ae69
        https://grok.com/imagine/post/946bef9e-8884-4960-856e-336ae977ad97
        ```
2.  **Drag & Drop**: Simply drag images from Grok.com or your local folder into the Vault; the system will automatically recognize them.
3.  **Vault Helper (Recommended)**: Install the [grok-extension](grok-extension/) for the most seamless capture experience.

<div align="center">
  <img src="public/extension_en.png" alt="Extension Screenshot" width="80%" style="border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" />
</div>

## 🚀 Getting Started

1.  **Requirement**: Ensure you have [Node.js](https://nodejs.org/) installed.
2.  **Installation**:
    ```bash
    git clone https://github.com/koehhian/Grok-Imagine-AI-Vault.git
    cd Grok-Imagine-AI-Vault
    npm install
    ```
3.  **Running**: Launch `node server.js` (Backup/Backend) and `npm run dev` (Frontend).

---

> **Not familiar with the Terminal?** Check out the [💻 Terminal Beginner Guide](terminal_newbie.md)
> **Need help installing the extension?** Check out the [🧩 Extension Installation Guide](extension_newbie.md)

## License

This project is licensed under the **GNU GPL v3**. See [LICENSE](https://www.gnu.org/licenses/gpl-3.0.html) for details.

## Buy Me a Coffee

If you find this tool useful, feel free to buy me a coffee! ☕️
[**Buy Me a Coffee**](https://buymeacoffee.com/koehhian)
