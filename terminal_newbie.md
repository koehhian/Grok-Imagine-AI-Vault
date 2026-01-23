# 💻 Terminal Beginner Guide

Welcome! If you are not familiar with the command line (Terminal), this guide will help you get the **Grok Imagine AI Vault** up and running.

## 1. Opening the Terminal

### For macOS Users
1. Press `Command + Space` to open Spotlight.
2. Type **"Terminal"** and press `Enter`.
3. A black window will appear—this is your Terminal.

### For Windows Users
1. Press the `Start` key.
2. Type **"PowerShell"** or **"cmd"** and press `Enter`.
3. A blue or black window will appear—this is your Command Prompt.

---

## 2. Setting Up the Environment

Copy and paste these commands one by one and press `Enter`.

### A. Check if you have Node.js
```bash
node -v
```
*If it shows a version number (like v20.x.x), you are good! If not, download it from [nodejs.org](https://nodejs.org/).*

### B. Clone the Project
```bash
git clone https://github.com/koehhian/Grok-Imagine-AI-Vault.git
cd Grok-Imagine-AI-Vault
```

---

## 3. Running the App (The 1-2-3 Steps)

Run these commands inside the project folder:

### 1. Install dependencies
```bash
npm install
```

### 2. Start the Backend Server (Handles backups)
```bash
node server.js
```
*(Keep this window open!)*

### 3. Start the Web UI (In a NEW terminal window/tab)
Open a new tab and run:
```bash
cd Grok-Imagine-AI-Vault
npm run dev
```
Now, open your browser and go to `http://localhost:5173`.

---

## Still having trouble?
Don't worry! You can always open an [Issue](https://github.com/koehhian/Grok-Imagine-AI-Vault/issues) on GitHub.

[⬅️ Back to README](README.md)
