#!/bin/bash
# GASデプロイ検証hook（PostToolUse）
# clasp push 実行後に自動で結果を検証し、問題があれば警告する

# 標準入力からJSONを読み取る
INPUT=$(cat /dev/stdin)

COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')
STDOUT=$(echo "$INPUT" | jq -r '.tool_result.stdout // empty')
STDERR=$(echo "$INPUT" | jq -r '.tool_result.stderr // empty')
EXIT_CODE=$(echo "$INPUT" | jq -r '.tool_result.exit_code // 0')

# clasp push 以外は無視
echo "$COMMAND" | grep -q "clasp push" || exit 0

# clasp pushが失敗した場合
if [ "$EXIT_CODE" != "0" ]; then
  # よくあるエラーパターンを検出して具体的なアドバイスを出す
  if echo "$STDERR$STDOUT" | grep -qi "unauthorized\|login"; then
    echo '{"decision": "notify", "message": "⚠️ clasp push失敗: 認証切れです。clasp login を実行してください。"}'
  elif echo "$STDERR$STDOUT" | grep -qi "manifest\|appsscript.json"; then
    echo '{"decision": "notify", "message": "⚠️ clasp push失敗: appsscript.jsonに問題があります。スコープやランタイムの設定を確認してください。"}'
  elif echo "$STDERR$STDOUT" | grep -qi "quota\|rate"; then
    echo '{"decision": "notify", "message": "⚠️ clasp push失敗: API制限に達しました。少し待ってからリトライしてください。"}'
  else
    echo '{"decision": "notify", "message": "⚠️ clasp push失敗: エラー内容を確認し、修正してから再度pushしてください。"}'
  fi
  exit 0
fi

# 成功したが警告がある場合
if echo "$STDERR$STDOUT" | grep -qi "warning\|deprecated"; then
  echo '{"decision": "notify", "message": "⚠️ clasp pushは成功しましたが、警告があります。非推奨APIの使用がないか確認してください。"}'
  exit 0
fi

# 成功：pushされたファイル数を通知
FILE_COUNT=$(echo "$STDOUT" | grep -c "└─\|├─\|Pushed" 2>/dev/null || echo "")
if [ -n "$FILE_COUNT" ] && [ "$FILE_COUNT" -gt 0 ]; then
  echo "{\"decision\": \"notify\", \"message\": \"✅ clasp push成功。GASエディタでトリガーやログに異常がないか確認してください。\"}"
else
  echo '{"decision": "notify", "message": "✅ clasp push成功。GASエディタでトリガーやログに異常がないか確認してください。"}'
fi

exit 0
