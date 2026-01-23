# 💻 ターミナル初心者向けガイド

ようこそ！「ターミナル (Terminal)」や「コマンドプロンプト」に詳しくない方でも、このガイドに従えば **Grok Imagine AI Vault** を起動できます。

## 1. ターミナルの開き方

### macOS の場合
1. `Command + Space` を押して Spotlight を開きます。
2. **「ターミナル」** と入力して `Enter` を押します。
3. 黒いウィンドウが表示されます。これがターミナルです。

### Windows の場合
1. `スタート` キーを押します。
2. **「PowerShell」** または **「cmd」** と入力して `Enter` を押します。
3. 青または黒のウィンドウが表示されます。これがコマンドプロンプトです。

---

## 2. 環境の準備

以下のコマンドを順番にコピー＆ペーストし、`Enter` を押してください。

### A. Node.js がインストールされているか確認
```bash
node -v
```
*バージョン番号（例: v20.x.x）が表示されれば OK です。表示されない場合は、[nodejs.org](https://nodejs.org/) からダウンロードしてインストールしてください。*

### B. プロジェクトのダウンロード
```bash
git clone https://github.com/koehhian/Grok-Imagine-AI-Vault.git
cd Grok-Imagine-AI-Vault
```

---

## 3. アプリの起動 (簡単 3 ステップ)

プロジェクトフォルダ内で以下のコマンドを実行します：

### 1. 必要なパッケージのインストール
```bash
npm install
```

### 2. バックエンドサーバーの起動 (画像の自動バックアップ用)
```bash
node server.js
```
*(このウィンドウは開いたままにしてください！)*

### 3. 管理画面の起動 (新しいターミナルウィンドウで)
新しいタブまたはウィンドウを開き、以下を実行します：
```bash
cd Grok-Imagine-AI-Vault
npm run dev
```
これで、ブラウザで `http://localhost:5173` を開けば使用開始できます！

---

## うまくいかない場合は？
心配いりません！GitHub の [Issue](https://github.com/koehhian/Grok-Imagine-AI-Vault/issues) でいつでも質問してください。

[⬅️ README に戻る](README_ja.md)
