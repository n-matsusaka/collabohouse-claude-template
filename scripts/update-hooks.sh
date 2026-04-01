#!/bin/bash
# 既存プロジェクトのhooksとsettings.jsonを最新テンプレートに更新する
# 使い方: プロジェクトのルートで実行
#   bash <(curl -s https://raw.githubusercontent.com/n-matsusaka/claude-template/master/scripts/update-hooks.sh)
# または:
#   bash ~/path/to/update-hooks.sh

set -e

# .claudeディレクトリの存在チェック
if [ ! -d ".claude" ]; then
  echo "❌ .claude ディレクトリが見つかりません。プロジェクトのルートで実行してください。"
  exit 1
fi

# hooksディレクトリがなければ作成
mkdir -p .claude/hooks

echo "🔄 hookファイルを更新中..."

# テンプレートのGitHub URLからダウンロード
BASE_URL="https://raw.githubusercontent.com/n-matsusaka/claude-template/master"

curl -sL "$BASE_URL/.claude/hooks/block-dangerous.sh"    -o .claude/hooks/block-dangerous.sh
curl -sL "$BASE_URL/.claude/hooks/secret-guard.sh"       -o .claude/hooks/secret-guard.sh
curl -sL "$BASE_URL/.claude/hooks/verify-gas-deploy.sh"  -o .claude/hooks/verify-gas-deploy.sh

echo "✅ hookファイルを更新しました"
echo "   - block-dangerous.sh（破壊コマンドブロック）"
echo "   - secret-guard.sh（シークレット漏洩防止）"
echo "   - verify-gas-deploy.sh（GASデプロイ検証）"

# settings.jsonのhooksセクションを更新
# 既存のpermissions.allowは保持し、hooksだけ上書きする
if [ -f ".claude/settings.json" ]; then
  # jqがあれば安全にマージ、なければ警告
  if command -v jq &> /dev/null; then
    EXISTING=$(cat .claude/settings.json)
    # 既存のpermissionsを保持しつつhooksを上書き
    echo "$EXISTING" | jq '.hooks = {
      "PreToolUse": [
        {
          "matcher": "Bash",
          "hooks": [
            { "type": "command", "command": "bash .claude/hooks/block-dangerous.sh" },
            { "type": "command", "command": "bash .claude/hooks/secret-guard.sh" }
          ]
        }
      ],
      "PostToolUse": [
        {
          "matcher": "Bash",
          "hooks": [
            { "type": "command", "command": "bash .claude/hooks/verify-gas-deploy.sh" }
          ]
        }
      ]
    }' > .claude/settings.json
    echo "✅ settings.json のhooks設定を更新しました（permissionsは保持）"
  else
    echo "⚠️  jqがインストールされていないため、settings.jsonの自動更新をスキップしました"
    echo "   手動で .claude/settings.json にhooks設定を追加してください"
  fi
else
  echo "⚠️  .claude/settings.json が見つかりません。新規プロジェクトの場合はテンプレートから作り直してください。"
fi

echo ""
echo "🎉 完了！次回のClaude Codeセッションから新しいhookが有効になります。"
