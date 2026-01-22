<div align="center">
  <img src="public/logo.png" alt="Grok Imagine AI Vault Logo" width="120" />
</div>

# Grok Imagine AI Vault

[English](README.md) | [繁體中文](README_zh-TW.md) | [简体中文](README_zh-CN.md) | **日本語**

<div align="center">
  <img src="public/preview.png" alt="App Preview" width="100%" style="border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" />
</div>

Grokのために特別に設計された、AI生成画像をエレガントかつ効率的に整理・管理するためのリポジトリです。

## 機能の特長

- **Grok リンクの包括的サポート**: `post`、`video`、`share`、さらには `imagine-public` 直接画像リンクのキャプチャをサポート。
- **自動サムネイルと UUID 抽出**: 様々な Grok リンク形式から UUID を自動抽出し、.jpg サムネイルを表示します。
- **CDN-to-Post 変換機能**: Grok の画像 CDN リンクを直接ドラッグ＆ドロップすると、リンクを正規の投稿 URL に自動変換し、元の画像を高画質サムネイルとして保持します。
- **堅牢なドラッグ＆ドロップ**: Base64 データをスマートにフィルタリングし、ブラウザを問わず確実に動作します。
- **データの移植性**: JSON データベース全体を簡単にエクスポート/インポートでき、デバイス間の移行もスムーズです。
- **マルチタグシステム**: 複数のタグで画像を分類・管理。専用ドロップダウンによるフィルタリングも可能。
- **Grok スタイル UI**: ミニマルで高コントラストなダークモード。操作を快適にする **固定ヘッダー (Sticky Header)** を採用。
- **一括操作**: 複数選択、一括削除、一括タグ管理をサポート。一括追加は改行、カンマ、スペース区切りに対応。
- **プライバシー優先**: ワンクリックで画像をぼかす機能を搭載し、閲覧時のプライバシーを保護。

## 使用上のヒント

### Grokサムネイル
最適な体験のために：
> [!IMPORTANT]
> **静止画の要件**: Grokから公開投稿リンクをコピーする際は、必ず **静止画 (Static Image)** の状態でコピーしてください。生成中や動的プレビュー画面でリンクをコピーすると、サムネイルが正しく読み込まれない場合があります。

### 動画の手動サムネイル設定
現在、動画（動画化済みの画像リンクを含む）は自動サムネイルに対応しておらず、手動で追加する必要があります。
1. カード上のアイコンをクリックして Grok ページを開きます。
2. Grok 側で手動で **動画 (Video)** から **画像 (Image)** に切り替えます。
3. その画像を直接 **Grok Imagine AI Vault** のカードに **ドラッグ＆ドロップ** すれば完了です。

### 一括アップロード
一括追加フィールドに複数のリンクを貼り付けることができます。**改行**、**カンマ**、または **スペース** で区切ることで、一度に大量のリンクを追加し、共通のタグを付与できます。

### エクスポート/インポート
ヘッダーの **エクスポート** ![export](assets/export.png) と **インポート** ![import](assets/import.png) ボタンを使用して、データのバックアップや別のVaultインスタンスへの移行を行えます。

## 技術スタック

- **Frontend**: React, TailwindCSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express.
- **Storage**: JSON-ベースのフラットファイルシステム (`data/links.json`).

## 始め方

1. リポジトリをクローンします。
2. 依存関係をインストールします：
   ```bash
   npm install
   ```
3. アプリケーションを起動します：
   ```bash
   node server.js & npm run dev
   ```
4. ブラウザで [http://localhost:5179](http://localhost:5179) を開きます。

## ライセンス

## 💎 高度なツール：Grok Link Detector

`grok.com/imagine` からリンクを効率的に取得する方法：

1.  **Tampermonkey をインストール**：ブラウザ用のユーザースクリプト拡張機能。
2.  **スクリプトの追加**：新しいスクリプトを作成し、[`grok-detector.js`](grok-detector.js) の内容を貼り付けます。
3.  **自動キャプチャ**：Grok のギャラリーをスクロールすると、検出器が自動的にリンクをキャプチャします。
4.  **同期**：**"Copy for Vault"** をクリックし、Vault の「インポート (Import)」機能を使用します。

---
🚀 あなたの AI 創作ライフをより豊かに！

本プロジェクトは **GNU GPL v3** オープンソースライセンスの下で公開されています。詳細は [LICENSE](https://www.gnu.org/licenses/gpl-3.0.html) をご覧ください。

## Buy Me a Coffee

このツールが役に立ったなら、コーヒーを一杯ご馳走していただけると開発の励みになります！
[寄付リンク](https://buymeacoffee.com/koehhian)
