#!/bin/bash
# シークレット漏洩防止hook（Write/Edit用）
# ファイル書き込み時に、内容にAPIキーやトークンが含まれていないかチェック

# 標準入力からJSONを読み取り、書き込み内容を抽出
INPUT=$(cat /dev/stdin)
CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# 内容が空なら無視
[ -z "$CONTENT" ] && exit 0

# .env ファイルへの書き込みは許可（シークレットの正しい保存先）
case "$FILE_PATH" in
  *.env|*.env.*) exit 0 ;;
esac

# 危険パターン（APIキー・トークン・パスワード）
PATTERNS=(
  'AIzaSy[A-Za-z0-9_-]{33}'
  'AKIA[0-9A-Z]{16}'
  'sk-[A-Za-z0-9]{20,}'
  'ghp_[A-Za-z0-9]{36}'
  'xoxb-[0-9]{10,}'
  'GOCSPX-[A-Za-z0-9_-]{20,}'
  '1//[A-Za-z0-9_-]{40,}'
  'ya29\.[A-Za-z0-9_-]{50,}'
  'sk-ant-[A-Za-z0-9_-]{20,}'
)

for p in "${PATTERNS[@]}"; do
  if echo "$CONTENT" | grep -qP "$p" 2>/dev/null || echo "$CONTENT" | grep -qE "$p" 2>/dev/null; then
    echo "{\"block\": true, \"message\": \"⛔ シークレットの混入を検出しました。ファイルにAPIキーまたはトークンのパターンが含まれています。環境変数(.env)またはPropertiesServiceを使ってください。\"}"
    exit 2
  fi
done

exit 0
