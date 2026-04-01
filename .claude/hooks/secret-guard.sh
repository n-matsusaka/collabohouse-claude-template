#!/bin/bash
# シークレット漏洩防止hook
# git commit 実行時に、ステージされた差分にAPIキーやトークンが含まれていないかチェック

# 標準入力からJSONを読み取り、コマンドを抽出
COMMAND=$(cat /dev/stdin | jq -r '.tool_input.command // empty')

# git commit 以外は無視
echo "$COMMAND" | grep -q "git commit" || exit 0

# ステージされたファイルの差分をチェック
STAGED=$(git diff --cached --unified=0 2>/dev/null)

# ステージがなければ無視
[ -z "$STAGED" ] && exit 0

# 危険パターン（APIキー・トークン・パスワード）
PATTERNS=(
  'X-ChatWorkToken:\s*[a-f0-9]{20,}'
  'AIzaSy[A-Za-z0-9_-]{33}'
  'AKIA[0-9A-Z]{16}'
  'sk-[A-Za-z0-9]{20,}'
  'ghp_[A-Za-z0-9]{36}'
  'xoxb-[0-9]{10,}'
)

for p in "${PATTERNS[@]}"; do
  if echo "$STAGED" | grep -qP "$p" 2>/dev/null || echo "$STAGED" | grep -qE "$p" 2>/dev/null; then
    echo "{\"block\": true, \"message\": \"⛔ シークレットの混入を検出しました。ステージされた差分にAPIキーまたはトークンのパターンが含まれています。環境変数(.env)に移してからコミットしてください。\"}"
    exit 2
  fi
done

exit 0
