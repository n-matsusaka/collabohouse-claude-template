# コラボハウス Claude Code セットアップガイド

このガイドでは、Claude Codeのプロジェクトテンプレートを自分のPCに導入する手順を説明します。
Windows / Mac どちらでも使えます。

---

## 前提条件

以下がインストール済みであること：
- [VS Code](https://code.visualstudio.com/)
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview)（VS Code拡張）
- [Git](https://git-scm.com/)

---

## セットアップ手順

### 1. テンプレートをダウンロードする

ターミナル（Windows: Git Bash / Mac: Terminal）を開いて、以下を実行：

```bash
git clone https://github.com/n-matsusaka/collabohouse-claude-template.git ~/collabohouse-claude-template
```

### 2. テンプレートを所定の場所にコピーする

```bash
cp -r ~/collabohouse-claude-template ~/\_template
```

※ `~/_template` がプロジェクト作成時のコピー元になります。

### 3. スキルを設定する

Claude Codeの「新プロジェクト作成」スキルを使えるようにします。

```bash
mkdir -p ~/.claude/skills/new-project
```

以下の内容で `~/.claude/skills/new-project/SKILL.md` を作成してください：

```markdown
---
name: new-project
description: 新しいプロジェクトを開始する。「新プロジェクト」「プロジェクト作って」「新規プロジェクト」と言われたら自動的にこのスキルを使う。
---

# 新プロジェクト作成スキル

## 手順

1. **プロジェクト名を確認する**
   - まだ聞いていなければ「プロジェクト名を教えてください」と聞く

2. **テンプレートをコピーする**
   ```bash
   cp -r "$HOME/_template" "$HOME/projects/[プロジェクト名]"
   ```

3. **CLAUDE.mdの編集を促す**
   以下を確認してユーザーに記入してもらう：
   - プロジェクト名
   - 目的（WHY）
   - 使用技術（HOW）

4. **完了を伝える**
   「プロジェクトの準備ができました。VS Codeで新しいウィンドウで開いてください：」
   - Ctrl + Shift + N（Windows）または Cmd + Shift + N（Mac）→ フォルダーを開く
```

### 4. プロジェクト用フォルダを作成する

```bash
mkdir -p ~/projects
```

### 5. グローバル設定ファイルを作成する（任意）

`~/.claude/CLAUDE.md` に自分の情報を書いておくと、Claude Codeが自分に合わせた対応をしてくれます：

```markdown
# [あなたの名前]のグローバル設定

## 私について
- 名前：[名前]
- 会社：コラボハウス
- 役職：[役職]
- 役割：[担当業務]

## 共通ルール
- 返答は必ず日本語
- コードのコメントは日本語
```

---

## 使い方

### 新しいプロジェクトを始める

1. VS Codeで任意のフォルダを開く
2. Claude Codeを起動する
3. 「新プロジェクト作って」と入力する
4. プロジェクト名を聞かれるので答える
5. CLAUDE.mdの目的・技術スタックを記入する

### プロジェクトの構成

作成されるプロジェクトは以下の構成です：

```
[プロジェクト名]/
├── CLAUDE.md              ← プロジェクト設定（最初に編集する）
├── .claude/
│   ├── settings.json      ← hook設定
│   ├── hooks/
│   │   └── block-dangerous.sh  ← 危険コマンドの自動ブロック
│   └── skills/            ← プロジェクト固有スキル（必要に応じて追加）
└── docs/
    ├── input/             ← 参考資料・要件を入れる
    ├── output/            ← 成果物の出力先
    └── decisions.md       ← 重要決定事項の記録
```

---

## テンプレートの更新

テンプレートが更新された場合は、以下で最新版を取得できます：

```bash
cd ~/collabohouse-claude-template
git pull
cp -r ~/collabohouse-claude-template/* ~/\_template/
cp -r ~/collabohouse-claude-template/.claude ~/\_template/
```

---

## 困ったら

松坂に聞いてください。
