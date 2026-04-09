# BISIN ウェブサイト制作プロジェクト 総括レポート

**作成日：** 2026-04-09
**対象サイト：** bisincool.co.jp
**リポジトリ：** github.com/bisincool/bisin-website

---

## 1. プロジェクト概要

合同会社BISIN（美信）の脂肪冷却マシン「COOLSPA」の販売・サロン導入支援を目的とした静的Webサイト。美容サロンオーナーをターゲットに、日本語・中文・英語の3言語対応で制作。

---

## 2. 技術スタック

| 項目 | 内容 |
|------|------|
| 構成 | 静的HTML + CSS + JS（フレームワークなし） |
| デプロイ | Cloudflare Pages（mainブランチ自動） |
| 多言語 | `data-i18n` / `data-i18n-html` + `js/i18n.js` |
| アニメーション | `js/particles.js`（六角形雪花、Canvas自己生成） |
| CSS管理 | CSS変数 + バージョンクエリ（現在 `v=9`） |

---

## 3. ページ構成（6ページ）

| ファイル | 内容 |
|---------|------|
| `index.html` | LP メイン（12セクション） |
| `product.html` | COOLSPA製品詳細・症例 |
| `service.html` | 導入支援・3プラン |
| `about.html` | 会社情報・ミッション |
| `contact.html` | お問い合わせ・FAQ |
| `outsourcing.html` | 業務委託（AIマーケ・IT） |

---

## 4. 今回のセッションでの主な改修（contact.html）

### 4-1. FAQアコーディオン実装
- 従来：質問リストのみ（`<ul><li>`）
- 改修：クリックで回答開閉（`<dl>` アコーディオン構造）
- 機能：`aria-expanded` によるアクセシビリティ対応

### 4-2. FAQ コンテンツ充実
- 4問すべてに詳細な回答文を追加
- `A.` プレフィックスを回答に表示（CSS `::before`）
- `<mark class="faq-hl">` で重要キーワードをブルー太字ハイライト

### 4-3. 三言語対応
- `data-i18n-html` を回答 `<dd>` に付与
- `js/i18n.js` に `faq.a1〜a4` キーを ja / zh / en 全追加
- 質問文も `<span data-i18n>` でラップし言語切替に対応

### 4-4. 営業時間更新
- 旧：平日 10:00〜20:00（土日祝休）
- 新：月曜から土曜 10:00〜20:00（日祝休）
- i18n.js の ja / zh / en すべて更新済み

### 4-5. Q. ラベルの位置ズレ修正（3段階）
1. `align-items: center` → `flex-start` で複数行対応
2. CSS `::before` → HTML `<span class="faq-q-label">` に変更しブラウザ差異を排除
3. 質問テキスト span に `flex: 1` を付与し `space-between` による不均等gap を解消

---

## 5. Claude Code 自動化設定（settings.json）

| フック | タイミング | 動作 |
|--------|-----------|------|
| PostToolUse（Edit/Write） | bisin-website HTML編集時 | フラグファイル作成 + i18n更新リマインダーをClaudeに注入 |
| Stop | 1ターン終了時 | フラグあれば `index.html` をブラウザで1回だけ開く |

---

## 6. Git コミット履歴（今回セッション）

| コミット | 内容 |
|---------|------|
| `2598795` | FAQアコーディオン実装・三言語対応 |
| `a4bf1fe` | chevronサイズ縮小（14px→10px） |
| `67259dc` | CSS v=8 キャッシュバスト |
| `f120347` | Q.ラベル位置ズレ修正（span化・flex:1） |
| `20cf910` | CSS v=9 キャッシュバスト |

---

## 7. 学んだ教訓・運用ルール

1. **CSS変更時は必ずバージョン番号を +1**（Cloudflareキャッシュ対策）
2. **Q.などのラベルはCSSの `::before` ではなくHTMLのspanで実装**（ブラウザ・flex環境での位置ズレを防ぐ）
3. **`justify-content: space-between` + 複数flex子要素の場合は `flex:1` で余白制御**
4. **FAQの回答はHTML込みなので `data-i18n-html` を使用**（`data-i18n` はtextContentのみ）

---

## 8. 現在のバージョン状況

| ファイル | バージョン |
|---------|-----------|
| `style.css` | v=9 |
| `i18n.js` | v=4 |
| `main.js` | v=6 |
| `particles.js` | v=5 |
