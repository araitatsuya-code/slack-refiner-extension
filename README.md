# Slack Message Refiner 拡張機能

この拡張機能は、Slack の Web クライアント上でメッセージ入力欄にホットキーを押すだけで、OpenAI の LLM（GPT-4o-mini）を使って文章を推敲し、そのまま送信できるようにする Chrome（および対応ブラウザ）拡張です。

---

## 主な機能

* **ホットキーによる推敲**: デフォルトで `Ctrl+Enter`（Mac は `⌘+Enter` も対応）を押すと下書き文を自動で LLM に送信し、推敲結果を取得します。
* **プレビュー＆適用**: 推敲後の文章をダイアログで確認し、ワンクリックで入力欄を置き換え可能。
* **API キー 管理画面**: 拡張アイコンのポップアップから OpenAI API Key を安全に保存。

---

## インストール方法

1. Chrome（または対応ブラウザ）で `chrome://extensions/` を開く
2. **デベロッパーモード** をオンにする
3. 「パッケージ化されていない拡張機能を読み込む」をクリック
4. 本プロジェクトのルートディレクトリを選択（`manifest.json` がある場所）
5. 拡張機能一覧に「Slack Message Refiner」が表示されれば成功

---

## 初期設定

1. ブラウザのツールバーに表示される拡張アイコンをクリック
2. 表示されるポップアップで **OpenAI API Key** を入力
3. `保存` ボタンを押して、キーをローカルストレージに保存

キーは `chrome.storage.local` にのみ保存され、外部に漏洩しません。

---

## 使い方

1. Slack の Web クライアントで、任意のチャンネルまたはダイレクトメッセージ欄を開く
2. メッセージ入力欄に下書きを入力
3. `Ctrl+Enter`（または `⌘+Enter`）を押す
4. 推敲後の文章プレビューが表示されるので **適用** を選択
5. 入力欄が置き換わったら、通常の `Enter` で送信

---

## ホットキーのカスタマイズ

* `content.js` の `addEventListener('keydown', ...)` 部分で、`e.ctrlKey` や `e.metaKey` の判定を変更してください。
* 再読み込み後（`chrome://extensions` の更新ボタン）に反映されます。

---

## 開発 / デバッグ

1. リポジトリをクローン

   ```bash
   git clone https://github.com/あなたのリポジトリ/slack-refiner-extension.git
   cd slack-refiner-extension
   ```
2. `manifest.json`, `background.js`, `content.js`, `popup.html`, `popup.js` を編集
3. `chrome://extensions/` で「更新」して動作確認
4. 必要に応じて DevTools の Console タブでログを確認
