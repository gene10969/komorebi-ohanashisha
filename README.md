# こもれびおはなし舎／モモンガのフウ

「モモンガのフウ」シリーズの紹介サイトです。トップページ、各巻の紹介ページ、プライバシーポリシーを、GitHub Pagesでそのまま公開できる相対パス構成で収録しています。

## 公開URL

<https://gene10969.github.io/komorebi-ohanashisha/>

`main`ブランチへ反映すると、GitHub ActionsがサイトをGitHub Pagesへ公開します。

## GA4を有効にする

1. Googleアナリティクスで絵本サイト用のGA4プロパティを作成します。
2. 発行された `G-XXXXXXXXXX` 形式の測定IDを確認します。
3. `assets/analytics-config.js` にある空欄へ測定IDを入力します。

```js
window.KOMOREBI_ANALYTICS = {
  measurementId: "G-XXXXXXXXXX"
};
```

設定後はページ閲覧に加え、第1巻のAmazonボタンが押されたときに `amazon_click` イベントを送信します。イベントには `book_id`、`book_title`、`link_url` が含まれます。測定IDが空欄の間はGA4のスクリプトを読み込まず、計測も行いません。

## 第2巻・第3巻の販売URLを追加する

各巻の商品ページ公開後、該当ページの「近日公開」表示を、第1巻と同じ `data-amazon-link` 属性付きのリンクへ変更します。Amazon URLは短い `https://www.amazon.co.jp/dp/ASIN` 形式を使用します。

## ページ構成

- `index.html`：トップページ
- `books/mayonaka-no-akari/`：第1巻
- `books/ienai-gomenne/`：第2巻
- `books/hajimete-no-moriyochien/`：第3巻
- `privacy/`：プライバシーポリシー
