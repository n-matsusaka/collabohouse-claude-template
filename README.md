# Claude Code プロジェクトテンプレート

「新プロジェクト作って」と言うだけで、統一された構成のプロジェクトフォルダを自動作成するテンプレートです。

## セットアップ（初回のみ）

### 1. このリポジトリをクローン
```bash
git clone https://github.com/xxx/claude-project-template.git ~/\_template
```

### 2. スキルを配置
```bash
cp -r ~/_template/skills/new-project ~/.claude/skills/new-project
```

### 3. プロジェクト用フォルダを作成
```bash
mkdir -p ~/projects
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
