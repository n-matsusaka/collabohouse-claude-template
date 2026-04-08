#!/bin/bash
# Excel(.xlsx)ファイル破損検証hook（PostToolUse: Bash, Write）
# xlsxファイルを出力するコマンド/書き込みの後に、ZIPとして正常に開けるか、
# 必須XMLが壊れていないかを自動検証する。

INPUT=$(cat /dev/stdin)

# jqがない環境ではpythonでJSON解析
parse_json() {
  python -c "
import json, sys
data = json.load(sys.stdin)
key_path = sys.argv[1].split('.')
val = data
for k in key_path:
    if isinstance(val, dict) and k in val:
        val = val[k]
    else:
        val = ''
        break
print(val if val is not None else '')
" "$1" <<< "$INPUT"
}

TOOL_NAME=$(parse_json "tool_name")

# 対象ファイルパスを特定
XLSX_PATH=""

if [ "$TOOL_NAME" = "Write" ]; then
  XLSX_PATH=$(parse_json "tool_input.file_path")
elif [ "$TOOL_NAME" = "Bash" ]; then
  COMMAND=$(parse_json "tool_input.command")
  STDOUT=$(parse_json "tool_result.stdout")
  EXIT_CODE=$(parse_json "tool_result.exit_code")

  # コマンドが失敗していたらスキップ
  [ "$EXIT_CODE" != "0" ] && [ -n "$EXIT_CODE" ] && exit 0

  # コマンドやstdoutから.xlsxパスを抽出（最後にマッチしたもの）
  XLSX_PATH=$(echo "$COMMAND $STDOUT" | grep -oE '[A-Za-z]:[^ "'"'"']+\.xlsx|/[^ "'"'"']+\.xlsx' | tail -1)
fi

# .xlsxファイルでなければスキップ
echo "$XLSX_PATH" | grep -qi '\.xlsx$' || exit 0

# ファイルが存在しなければスキップ（アップロード等の場合）
[ -f "$XLSX_PATH" ] || exit 0

# --- 検証開始 ---
RESULT=$(python -c "
import zipfile, sys

xlsx_path = sys.argv[1]
errors = []

# 1. ZIPとして開けるか
try:
    zf = zipfile.ZipFile(xlsx_path, 'r')
except Exception as e:
    print(f'ZIPとして開けません: {e}')
    sys.exit(0)

names = zf.namelist()

# 2. 必須ファイルの存在チェック
required = ['[Content_Types].xml', 'xl/workbook.xml']
missing = [r for r in required if r not in names]
if missing:
    errors.append(f'必須ファイルが欠落: {\",\".join(missing)}')

# 3. workbook.xmlの名前空間プレフィックスが壊れていないか
if 'xl/workbook.xml' in names:
    wb = zf.read('xl/workbook.xml').decode('utf-8')
    if 'ns0:' in wb or 'ns1:' in wb:
        errors.append('名前空間プレフィックスがns0/ns1に書き換えられています（ElementTree問題）')
    if '<sheets' in wb and 'r:id=' not in wb:
        errors.append('r:id属性が消失しています')

# 4. Content_Typesの整合性
if '[Content_Types].xml' in names:
    ct = zf.read('[Content_Types].xml').decode('utf-8')
    sheets = [n for n in names if n.startswith('xl/worksheets/') and n.endswith('.xml')]
    unreg = [s for s in sheets if '/' + s not in ct]
    if unreg:
        errors.append(f'Content_Typesに未登録のシート: {\",\".join(unreg)}')

zf.close()

if errors:
    print(' / '.join(errors))
" "$XLSX_PATH" 2>/dev/null)

if [ -n "$RESULT" ]; then
  echo "{\"decision\": \"block\", \"reason\": \"⚠️ Excel破損検出: ${RESULT}\\nファイル: ${XLSX_PATH}\\nElementTreeでXMLを書き換えるとExcelが壊れます。文字列操作方式を使ってください。\"}"
  exit 0
fi

# 正常
exit 0
