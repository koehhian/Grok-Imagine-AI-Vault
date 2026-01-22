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

- **自動サムネイル生成**: Grokの投稿リンクからサムネイルを自動的に取得して表示します。
- **データの移植性**: JSONデータベース全体を簡単にエクスポート/インポートでき、デバイス間の移行もスムーズです。
- **マルチタグシステム**: 複数のタグで画像を分類・管理。「その他のタグ」ドロップダウンで簡単にフィルタリングできます。
- **スマート重複排除**: 同じリンクが重複して追加されるのを自動的に防ぎます。
- **GrokスタイルUI**: AIの美学に完璧にフィットする、ミニマルで高コントラストなダークモードデザイン。
- **一括操作**: 複数選択、一括削除、一括タグ管理をサポート。
- **プライバシー優先**: ワンクリックで画像をぼかす機能を搭載し、閲覧時のプライバシーを保護します。
- **検索とフィルタ**: タイトル、URL、またはタグですばやく画像を検索できます。

## 使用上のヒント

### Grokサムネイル
最適な体験のために：
> [!IMPORTANT]
> **静止画の要件**: Grokから公開投稿リンクをコピーする際は、必ず **静止画 (Static Image)** の状態でコピーしてください。生成中や動的プレビュー画面でリンクをコピーすると、サムネイルが正しく読み込まれない場合があります。

### 一括アップロード
一括追加フィールドに複数のリンク（1行に1つ）を貼り付け、それらすべてに一度にタグを追加できます。

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
