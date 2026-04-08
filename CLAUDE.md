# {{PROJECT_NAME}}

## WHY
{{PURPOSE}}

## HOW
- 技術: {{TECH_STACK}}
- 構成: `docs/input/` に要件・参考資料、`docs/output/` に仕様書等の成果物

## ルール
- コメントは日本語
- 変更前に目的を説明する
- `rm -rf` / `git push --force` 禁止
- 仕様書・ドキュメント等の成果物は `docs/output/` に保存する
- ユーザーからの提供資料は `docs/input/` に整理する

## セキュリティ
- APIキー・トークンはコードにハードコードしない（グローバルCLAUDE.mdの管理ルールに従う）
- `.env` に保存し `.gitignore` で除外されていることを確認済み
- GASの場合は `PropertiesService.getScriptProperties()` を使う
- APIキーはこのプロジェクト専用に発行されたものを使う（使い回し禁止）
