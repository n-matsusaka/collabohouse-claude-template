---
name: new-project
description: 新しいプロジェクトを開始する。「新プロジェクト」「プロジェクト作って」「新規プロジェクト」と言われたら自動的にこのスキルを使う。
---

# 新プロジェクト作成スキル

## 手順

### 1. ヒアリング
まとめて聞く。すでに分かっている項目は飛ばす。

```
新しいプロジェクトを作ります。教えてください：
1. **プロジェクト名**（英語・ハイフン区切り。例: gas-automation）
2. **目的**（1〜2行で）
3. **使用技術**（例: GAS + スプレッドシート）
```

### 2. 作成
```bash
# 重複チェック
ls "$HOME/projects/[名前]" 2>/dev/null && echo "既に存在します"

# コピー
cp -r "$HOME/_template" "$HOME/projects/[名前]"

# CLAUDE.md のプレースホルダーを置換
# {{PROJECT_NAME}} / {{PURPOSE}} / {{TECH_STACK}}

# Git初期化
cd "$HOME/projects/[名前]"
git init && git add -A && git commit -m "初期セットアップ"
```

### 3. 完了報告
```
✅ ~/projects/[名前] を作成しました

VS Codeで開く → Ctrl+Shift+N → フォルダーを開く
```
