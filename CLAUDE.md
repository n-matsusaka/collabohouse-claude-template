# Project: アンケート自動化（Survey Automation）

## WHY（このプロジェクトの目的）
初来場のお客さまが手書きで記入しているアンケートをデジタル化する。
Google Formでアンケート回答 → AppSheetで顧客管理 → ANDPADへインポート連携
という一気通貫の仕組みを構築し、手作業・転記ミスをなくす。

## WHAT（リポジトリ構成）
- `.claude/skills/` : 再利用可能なスキル定義
- `.claude/hooks/`  : 自動実行ガードレール
- `docs/input/`     : ユーザーからの提供情報（要件・参考資料など）
- `docs/output/`    : 成果物（設計書・仕様書など）
- `docs/decisions.md` : 重要決定事項ログ
- `src/`            : アプリケーション本体

## HOW（プロジェクト固有のルール）
### 技術スタック
- Google Forms（アンケート入力）
- Google Sheets（回答の蓄積）
- AppSheet（顧客管理アプリ）
- Google Apps Script（データ変換・連携の自動化）
- ANDPAD（施工管理 — CSVインポート機能で連携）

### コーディングルール
- コメントは日本語で書く
- ファイル変更前に必ず目的を説明する
- 要件をヒアリングしたら、 `docs/input/` に整理する
- GASから直接APIを叩いて確認出来ることは自分でやること

### 禁止事項
- `rm -rf` や `git push --force` は使わない
- 本番環境への直接デプロイ禁止

## 重要決定事項
過去の決定事項は `docs/decisions.md` を参照すること