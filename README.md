# Claude Code プロジェクトテンプレート

「新プロジェクト作って」と言うだけで、統一された構成のプロジェクトフォルダを自動作成するテンプレートです。

## セットアップ（初回のみ）

VS Codeのターミナル（PowerShell）で、以下を順に実行してください。

### 1. このリポジトリをクローン
```powershell
git clone https://github.com/n-matsusaka/claude-template.git $HOME\_template
```

### 2. スキルを配置
```powershell
Copy-Item -Recurse $HOME\_template\skills\new-project $HOME\.claude\skills\new-project
```

### 3. プロジェクト用フォルダを作成
```powershell
New-Item -ItemType Directory -Force -Path $HOME\projects
```

これで準備完了です。

## 使い方

Claude Codeで「新プロジェクト作って」と言うと、以下が自動で行われます：

1. プロジェクト名・目的・技術をヒアリング
2. `~/projects/[名前]` にテンプレートをコピー
3. CLAUDE.md にヒアリング内容を記入
4. Git初期化＋初回コミット

## テンプレートの中身

```
_template/
├── CLAUDE.md              ← プロジェクト概要（自動記入される）
├── .gitignore             ← ローカルファイル除外
├── .claude/
│   ├── settings.json      ← 危険コマンドブロック用フック
│   ├── hooks/             ← ガードレール
│   ├── rules/             ← プロジェクト固有ルールを追加
│   └── skills/            ← プロジェクト固有スキルを追加
└── docs/
    ├── decisions.md       ← 決定事項ログ
    ├── input/             ← 要件・参考資料
    └── output/            ← 仕様書等の成果物
```
