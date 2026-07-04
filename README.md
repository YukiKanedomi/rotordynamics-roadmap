# Rotordynamics Roadmap

回転機械全般のローターダイナミクス技術ロードマップ。社会動向 → 需要シフト → RD課題 → 要素技術の
4層因果を、一次資料（IEA・法定規制・OEM一次・査読・規格）に接地したダッシュボードで俯瞰する。

**Live**: https://yukikanedomi.github.io/rotordynamics-roadmap/

- **BOARD** — 6ドライバ・チャンネル × 二層タイムライン（実線=〜2035／破線=2035〜）× KPI レール
- **STORY** — 11文のナラティブ（各文に一次出典）
- **LINKAGE** — 4層リンク図＋ストーリーツアー
- **RD MAP** — 横断課題9クラスタ（分類骨格は API TR 684-1 ／ ISO 20816・21940・14839）
- **SOURCES** — 注釈付き出典解説（約80点）

デザイン: "Clinical Grid"（純白・角丸ゼロ・hairline罫・ネイビー単色アクセント）。
姉妹サイト: [Rotordynamics Hub](https://yukikanedomi.github.io/rotordynamics-hub/)

## Dev

```bash
npm ci
npm run dev      # 開発
npm run build    # ビルド（GitHub Actions が main push で自動デプロイ）
```
