#!/bin/bash
# 設計書の整合チェックhook（PostToolUse: Write / Edit）
# docs/output/ に設計書が書き込まれたとき、全4文書が揃っているか確認する
# 揃っていたら品質検査エージェントの起動を促す

# 入力をJSONとして読み取る
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | grep -o '"file_path":"[^"]*"' | head -1 | sed 's/"file_path":"//;s/"$//')

# file_pathが取れない場合は何もしない
if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# docs/output/ 配下のファイルかチェック
echo "$FILE_PATH" | grep -qi "docs[/\\\\]output[/\\\\]" || exit 0

# 設計書関連のファイルかチェック（要件定義・設計・計画を含むファイル名）
echo "$FILE_PATH" | grep -qiE "(要件|設計|計画|requirement|design|test-plan|operation)" || exit 0

# プロジェクトルートを探す（.gitがあるディレクトリ）
PROJECT_DIR=$(echo "$FILE_PATH" | sed 's|[/\\]docs[/\\]output[/\\].*||')
DOCS_DIR="$PROJECT_DIR/docs/output"

# docs/outputが見つからなければ何もしない
if [ ! -d "$DOCS_DIR" ]; then
  exit 0
fi

# 4つの設計書が揃っているかチェック
HAS_BUSINESS=$(ls "$DOCS_DIR" 2>/dev/null | grep -ciE "(業務要件|business.requirement)")
HAS_SYSTEM=$(ls "$DOCS_DIR" 2>/dev/null | grep -ciE "(システム要件|system.requirement|system.design)")
HAS_TEST=$(ls "$DOCS_DIR" 2>/dev/null | grep -ciE "(テスト計画|test.plan)")
HAS_OPS=$(ls "$DOCS_DIR" 2>/dev/null | grep -ciE "(運用設計|operation)")

# 全部揃っていたら品質検査を促す
if [ "$HAS_BUSINESS" -gt 0 ] && [ "$HAS_SYSTEM" -gt 0 ] && [ "$HAS_TEST" -gt 0 ] && [ "$HAS_OPS" -gt 0 ]; then
  echo "【品質検査】全4設計書が揃いました。品質検査エージェントを立ち上げて、以下の観点で横断的な整合チェックを実施してください："
  echo "1. ドキュメント間の用語・名称の統一"
  echo "2. 業務要件がシステム要件に漏れなく反映されているか"
  echo "3. テスト計画がシステム要件の全機能をカバーしているか"
  echo "4. 運用設計がシステム要件の技術構成と整合しているか"
  echo "5. 矛盾・抜け漏れがあれば修正指示を出し、修正後に再チェックすること"
  echo ""
  echo "対象ファイル: $DOCS_DIR/"
fi
