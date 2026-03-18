/**
 * =============================================================
 * ANDPAD顧客インポート用xlsxエクスポート（v3.0）
 * ファイル: andpadExport.gs
 * =============================================================
 * 新カラム構成（データ3分類）に対応
 * - 分類A: アンケート→ANDPADに送る項目
 * - 分類B: 双方向同期（担当設計士・次回来場予定日）
 * - 分類C: AppSheet専用（出力しない）
 * =============================================================
 */


// ANDPADインポート用の全376列ヘッダー
var ANDPAD_HEADERS = [
  '顧客ID','顧客管理ID','種別','顧客名','顧客名 敬称','顧客名（カナ）',
  '顧客名2','顧客名2 敬称','顧客名2（カナ）',
  '顧客郵便番号','顧客都道府県','顧客現住所','顧客緯度','顧客経度',
  '顧客担当者名','顧客担当者名（カナ）',
  '顧客電話番号1','顧客電話番号2','顧客メールアドレス','顧客FAX',
  '顧客ランク','顧客分類','性別','生年月日',
  '担当者所属店舗','担当者','紹介者','DMの可否','顧客備考',
  '顧客情報任意項目:家族名前','顧客情報任意項目:奥様　電話番号',
  '顧客情報任意項目:コラボハウスLINE登録','顧客情報任意項目:来場時の年齢',
  '顧客情報任意項目:連絡OK（digima連携）',
  '物件ID','物件管理ID','物件種別','物件名','物件名（カナ）','号室',
  '物件住所種別','物件郵便番号','物件都道府県','物件住所',
  '物件緯度','物件経度','物件電話番号','交通アクセス',
  '築年月','専有面積・延床面積','間取り','材質構造','総戸数',
  'アスベスト（選択）','アスベスト','工事可能時間（選択）','工事可能時間',
  '土曜日の工事（選択）','土曜日の工事','駐車スペース（選択）','駐車スペース',
  'タバコ喫煙ルール（選択）','タバコ喫煙ルール',
  '近隣承認（選択）','近隣承認','近隣挨拶範囲（選択）','近隣挨拶範囲',
  '管理人名','管理人TEL','管理人FAX','理事長名','理事長TEL',
  '管理会社名','管理会社担当名','管理会社TEL','管理会社FAX',
  '管理体制','勤務時間','エレベーター','オートロック','物件備考',
  'システムID','案件管理ID','案件名','問合番号','契約番号','本契約番号',
  '案件種別','案件フロー','案件ワークフロー','案件作成者','案件作成日時',
  '引合状況','成約確度',
  '売上見込 売上(税込)','売上見込 売上(税抜)','売上見込 原価','売上見込 粗利額','売上見込 粗利率',
  '工事場所','工事種類','工事内容','案件備考',
  '反響種別','反響元','反響日','受付者',
  '希望工事予算','希望工事時期','施工希望箇所','施工きっかけ','居住状態',
  '失注種別','失注日','失注理由','失注理由（備考）',
  '来場予約獲得日(予定)','来場予約獲得日(実績)',
  '初回来場日(予定)','初回来場日(実績)',
  '次回アポ日(予定)','次回アポ日(実績)',
  '現調日(予定)','現調日(実績)',
  '契約日(予定)','契約日(実績)',
  '外装・窓(予定)','外装・窓(実績)',
  '仕様完了(予定)','仕様完了(実績)',
  '本契約(予定)','本契約(実績)',
  '設計依頼(予定)','設計依頼(実績)',
  'BC(予定)','BC(実績)',
  '初回打合(予定)','初回打合(実績)',
  '融資確定(予定)','融資確定(実績)',
  '金消契約(予定)','金消契約(実績)',
  '土地決済(予定)','土地決済(実績)',
  '農業振興地域(予定)','農業振興地域(実績)',
  '農転申請(予定)','農転申請(実績)',
  '開発許可(予定)','開発許可(実績)',
  '解体完了(予定)','解体完了(実績)',
  '造成完了(予定)','造成完了(実績)',
  '道路申請完了(予定)','道路申請完了(実績)',
  '上下水完了(予定)','上下水完了(実績)',
  '電柱完了(予定)','電柱完了(実績)',
  '建確(予定)','建確(実績)',
  '地盤調査(予定)','地盤調査(実績)',
  '地鎮祭(予定)','地鎮祭(実績)',
  '☆予定調整★(予定)','☆予定調整★(実績)',
  '着工日(予定)','着工日(実績)',
  '上棟(予定)','上棟(実績)',
  '造完(予定)','造完(実績)',
  '登記可能(予定)','登記可能(実績)',
  '完了検査(予定)','完了検査(実績)',
  '写真撮影(予定)','写真撮影(実績)',
  '検査済証明(予定)','検査済証明(実績)',
  '完成日(予定)','完成日(実績)',
  '引渡日(予定)','引渡日(実績)',
  '残工事(予定)','残工事(実績)',
  '■転圧検査日(予定)','■転圧検査日(実績)',
  '■配筋検査日(予定)','■配筋検査日(実績)',
  '■金物検査日(予定)','■金物検査日(実績)',
  '■防水・断熱検査日(予定)','■防水・断熱検査日(実績)',
  '■造完検査日(予定)','■造完検査日(実績)',
  '■仕上げ検査日(予定)','■仕上げ検査日(実績)',
  '産廃(予定)','産廃(実績)',
  '入金予定日(予定)','入金予定日(実績)',
  '実行予算提出日(予定)','実行予算提出日(実績)',
  '検査是正予定日(予定)','検査是正予定日(実績)',
  '融資事前審査(予定)','融資事前審査(実績)',
  '最終図面スキャン(予定)','最終図面スキャン(実績)',
  '電気打合(予定)','電気打合(実績)',
  '照明打合(予定)','照明打合(実績)',
  '棚打合(予定)','棚打合(実績)',
  '竣工(予定)','竣工(実績)',
  '長期構造保証書兼検査報告書　済(予定)','長期構造保証書兼検査報告書　済(実績)',
  '解約日(予定)','解約日(実績)',
  'キーBOX','集合ポスト','養生範囲（共用部）',
  '遮音規制（選択）','遮音規制','スリーブ穴あけ可否（選択）','スリーブ穴あけ可否',
  'インターホン交換','専有部消火器','自火報工事の有無/指定業者',
  '挨拶不在者（選択）','挨拶不在者','その他',
  '主担当店舗','主担当',
  '役割:設計営業','役割:設計営業メイン','役割:設計営業サブ',
  '役割:営業','役割:設計','役割:実施設計サブ',
  '役割:工事','役割:工事サブ','役割:現場検査員',
  '役割:アフターメンテナンス','役割:その他',
  'ラベル:案件ラベル※1つだけ(複数不可)','ラベル:状態',
  '協力業者_担当情報:プレカット','協力業者_担当情報:大工','協力業者_担当情報:基礎',
  '協力業者_担当情報:電気','協力業者_担当情報:設備','協力業者_担当情報:内装',
  '協力業者_担当情報:外壁','協力業者_担当情報:建材',
  '協力業者_担当情報:キッチン','協力業者_担当情報:UB',
  '協力業者_担当情報:洗面','協力業者_担当情報:トイレ',
  '協力業者_担当情報:外壁メーカー','協力業者_担当情報:サッシ',
  '協力業者_担当情報:給湯器','協力業者_担当情報:照明',
  '協力業者_担当情報:瑕疵保険','協力業者_担当情報:瑕疵保険等　進捗',
  '協力業者_担当情報:長期構造保証書兼検査報告書',
  '協力業者_担当情報:住設延長保証申込','協力業者_担当情報:エアコン延長保証',
  '協力業者_担当情報:防蟻処理　必要','協力業者_担当情報:防蟻工法',
  '協力業者_担当情報:カーテン','協力業者_担当情報:火災保険',
  '協力業者_担当情報:外構','協力業者_担当情報:検査',
  '協力業者_担当情報:構造計算','協力業者_担当情報:作図',
  '協力業者_担当情報:建築確認提出','協力業者_担当情報:その他申請業務',
  'その他項目:融資・金額説明担当',
  'その他項目:プランニング設計担当①','その他項目:プランニング設計担当②','その他項目:プランニング設計担当③',
  'その他項目:仕様決め担当','その他項目:工事届',
  'その他項目:建確番号','その他項目:建確 設計者','その他項目:構造・規模ID',
  'その他項目:金融機関','その他項目:壁直下率','その他項目:耐震等級',
  'その他項目:外皮 UA値','その他項目:省エネ BEI','その他項目:長期優良住宅',
  'その他項目:延床面積（㎡）','その他項目:延床面積 (坪)','その他項目:建築面積 (坪)',
  'その他項目:補助金','その他項目:顧客備考','その他項目:備考',
  'その他項目:住居表示','その他項目:暮らしの設計室','その他項目:アルム',
  'その他項目:撮影・取材の可否','その他項目:プロ撮影写真',
  'その他項目:ホームページ掲載','その他項目:雑誌掲載',
  'その他項目:お客様の声アンケート','その他項目:視聴・閲覧メディア',
  'その他項目:初回来場','その他項目:見学会 来場邸名',
  'その他項目:敷地調査名','その他項目:地盤調査','その他項目:E工番あり',
  'その他項目:※注意※「仕様確定・本契約完了」をクリックした後の対応内容の担当者には「総務」を必ず選択する。',
  'digima連携項目:建築予定地・土地の有無','digima連携項目:競合',
  'digima連携項目:予算','digima連携項目:予約方法',
  'digima連携項目:打合せ回数','digima連携項目:問い合わせ内容（HP備考欄）',
  '入金:状態','入金:備考','入金:契約日','入金:着工日','入金:完成日','入金:引渡日',
  '請求先','請求者名','請求者名 敬称','請求者名 (カナ)',
  '請求者名2','請求者名2 敬称','請求者名2 (カナ)',
  '請求者郵便番号','請求者都道府県','請求者住所',
  '請求者電話番号','請求者FAX','請求者メールアドレス',
  '契約時:売上金額（税込）','契約時:売上金額（税抜）','契約時:原価','契約時:予備原価','契約時:粗利','契約時:粗利率',
  '実行予算確定時:売上金額（税込）','実行予算確定時:売上金額（税抜）','実行予算確定時:原価','実行予算確定時:予備原価','実行予算確定時:粗利','実行予算確定時:粗利率',
  '進行中:売上金額（税込）','進行中:売上金額（税抜）','進行中:原価','進行中:予備原価','進行中 粗利額','進行中 粗利率',
  '精算完了時:売上金額（税込）','精算完了時:売上金額（税抜）','精算完了時:原価','精算完了時:予備原価','精算完了時:粗利','精算完了時:粗利率',
  '税率','対応履歴',
  '進行報告(報告数)','完了報告(報告数)','日報(報告数)',
  '質問や相談(報告数)','苦情・クレーム報告(報告数)','事故報告(報告数)'
];


/**
 * スタジオ名→都道府県マッピング
 */
function getStudioPrefecture_(studioName) {
  var map = {
    '束本': '愛媛県', '久万ノ台': '愛媛県', '今治': '愛媛県', '新居浜': '愛媛県',
    '高松': '香川県', '丸亀': '香川県', '国分寺': '香川県',
    '徳島北島': '徳島県', '徳島沖浜': '徳島県',
    '中百舌鳥': '大阪府', '和泉府中': '大阪府',
    '秋田山王': '秋田県',
    '岡山倉敷': '岡山県', '岡山辰巳': '岡山県',
    '高知知寄': '高知県',
    '広島福山': '広島県'
  };
  return map[studioName] || '';
}


/**
 * 日付をANDPAD形式（yyyy-MM-dd）に変換
 */
function formatDate_(value) {
  if (!value) return '';
  if (value instanceof Date) {
    return Utilities.formatDate(value, 'Asia/Tokyo', 'yyyy-MM-dd');
  }
  return String(value);
}


/**
 * DM可否の変換
 */
function convertDmPermission_(value) {
  if (!value) return '';
  var v = String(value);
  if (v.indexOf('はい') >= 0) return '可';
  if (v.indexOf('いいえ') >= 0) return '不可';
  return '';
}


/**
 * 顧客備考を組み立て
 */
function buildCustomerNote_(row, hm) {
  var parts = [];
  var add = function(label, key) {
    var val = hm[key] !== undefined ? row[hm[key]] : '';
    if (val) parts.push(label + ': ' + val);
  };
  add('職業', 'ご職業');
  add('家族人数', 'ご家族の人数');
  add('現在の住まい', '現在のお住まい');
  add('家賃', '現在の家賃（万円）');
  add('計画', '今回のご計画');
  add('入居希望', '入居希望時期');
  add('気になること', '家づくりで気になること');
  add('問い合わせ', 'コラボハウスへのお問い合わせ');
  add('見学回数', '見学会参加回数');

  var competitor = hm['検討中の住宅会社有無'] !== undefined ? row[hm['検討中の住宅会社有無']] : '';
  if (competitor === 'ある') {
    var names = hm['検討中の会社名'] !== undefined ? row[hm['検討中の会社名']] : '';
    parts.push('検討中の他社: ' + (names || 'あり'));
  }
  return parts.join('\\n');
}


/**
 * 家族名をカンマ結合
 */
function buildFamilyNames_(row, hm) {
  var names = [];
  ['ご家族① 氏名', 'ご家族② 氏名', 'ご家族③ 氏名', 'ご家族④ 氏名'].forEach(function(key) {
    if (hm[key] !== undefined && row[hm[key]]) names.push(row[hm[key]]);
  });
  return names.join('、');
}


/**
 * 1行分をANDPADフォーマットに変換
 */
function mapRowToAndpad_(row, hm) {
  var out = new Array(ANDPAD_HEADERS.length).fill('');
  var h = {};
  ANDPAD_HEADERS.forEach(function(name, i) { h[name] = i; });

  var val = function(key) { return hm[key] !== undefined ? (row[hm[key]] || '') : ''; };

  var customerName = val('お名前（漢字）');
  var studioName = val('スタジオ名');

  // 既存顧客の場合、システムIDを更新キーとして設定
  var systemId = val('ANDPADシステムID');
  if (systemId) out[h['システムID']] = systemId;

  // 顧客基本情報（分類A）
  out[h['顧客名']] = customerName;
  out[h['顧客名（カナ）']] = val('フリガナ（カタカナ）');
  out[h['顧客郵便番号']] = val('郵便番号');
  out[h['顧客都道府県']] = val('都道府県');
  out[h['顧客現住所']] = val('住所');
  out[h['顧客電話番号1']] = val('電話番号');
  out[h['顧客メールアドレス']] = val('メールアドレス');

  // 担当者
  out[h['担当者所属店舗']] = studioName;
  out[h['担当者']] = val('案内担当者名');
  out[h['主担当店舗']] = studioName;
  out[h['主担当']] = val('案内担当者名');

  // DM可否
  out[h['DMの可否']] = convertDmPermission_(val('DM可否'));

  // 任意項目
  out[h['顧客情報任意項目:来場時の年齢']] = val('年齢');
  out[h['顧客情報任意項目:家族名前']] = buildFamilyNames_(row, hm);

  // 紹介者
  out[h['紹介者']] = val('紹介者名');

  // 案件情報
  out[h['案件名']] = customerName ? customerName + '様邸　新築工事' : '';
  out[h['物件名']] = customerName ? customerName + '様邸新築工事' : '';
  out[h['物件都道府県']] = getStudioPrefecture_(studioName);

  // 反響情報（反響日は空欄 — ANDPAD既存データを維持）
  out[h['反響種別']] = val('ご来場のきっかけ');

  // 初回来場日(実績) ← アンケート実施日（来場日）
  out[h['初回来場日(実績)']] = formatDate_(val('来場日'));

  // 分類B: 双方向同期
  out[h['役割:設計']] = val('担当設計士');
  out[h['次回アポ日(予定)']] = formatDate_(val('次回来場予定日'));
  out[h['役割:営業']] = val('案内担当者名');

  // ラベル・初回来場
  out[h['ラベル:案件ラベル※1つだけ(複数不可)']] = 'A：新築';
  out[h['その他項目:初回来場']] = studioName;

  // 顧客備考
  out[h['顧客備考']] = buildCustomerNote_(row, hm);

  return out;
}


/**
 * ANDPADインポート用xlsxを生成してGoogle Driveに保存
 */
function exportToAndpadXlsx() {
  var sheet = getResponseSheet_();
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();

  if (lastRow <= 1) {
    Logger.log('データがありません');
    return;
  }

  var allData = sheet.getRange(1, 1, lastRow, lastCol).getValues();
  var headers = allData[0];

  // ヘッダー名→列インデックスのマップ
  var hm = {};
  headers.forEach(function(name, i) { hm[name] = i; });

  // 抽出条件: 完了フラグ=TRUE AND ANDPAD連携済≠TRUE AND お名前あり
  var colComplete = hm['完了フラグ'];
  var colLinked = hm['ANDPAD連携済'];
  var colName = hm['お名前（漢字）'];

  var andpadRows = [];

  for (var i = 1; i < allData.length; i++) {
    var row = allData[i];

    // 完了フラグがTRUEでないものはスキップ
    var complete = colComplete !== undefined ? row[colComplete] : false;
    if (complete !== true && complete !== 'TRUE') continue;

    // ANDPAD連携済はスキップ
    var linked = colLinked !== undefined ? row[colLinked] : false;
    if (linked === true || linked === 'TRUE') continue;

    // 名前がないものはスキップ
    if (colName !== undefined && !row[colName]) continue;

    andpadRows.push(mapRowToAndpad_(row, hm));
  }

  if (andpadRows.length === 0) {
    Logger.log('エクスポート対象のデータがありません');
    return;
  }

  // 一時スプレッドシートを作成 → xlsx変換 → Driveに保存
  var tempSs = SpreadsheetApp.create('ANDPAD_import_temp');
  var tempSheet = tempSs.getActiveSheet();
  tempSheet.getRange(1, 1, 1, ANDPAD_HEADERS.length).setValues([ANDPAD_HEADERS]);
  tempSheet.getRange(2, 1, andpadRows.length, ANDPAD_HEADERS.length).setValues(andpadRows);
  SpreadsheetApp.flush();

  // xlsx形式でエクスポート
  var url = 'https://docs.google.com/spreadsheets/d/' + tempSs.getId() + '/export?format=xlsx';
  var token = ScriptApp.getOAuthToken();
  var response = UrlFetchApp.fetch(url, { headers: { 'Authorization': 'Bearer ' + token } });

  // ファイル名
  var dateStr = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy-MM-dd_HHmmss');
  var fileName = 'ANDPAD_import_' + dateStr + '.xlsx';

  // 共有ドライブのインポートデータフォルダに保存
  var parentFolder = DriveApp.getFolderById(SHARED_DRIVE_FOLDER_ID);
  var subFolders = parentFolder.getFolders();
  var importFolder = null;
  while (subFolders.hasNext()) {
    var f = subFolders.next();
    if (f.getName().indexOf('インポートデータ') >= 0) {
      importFolder = f;
      break;
    }
  }

  // インポートフォルダが見つからない場合はスプレッドシートと同じ場所に保存
  if (!importFolder) {
    var ssFile = DriveApp.getFileById(SPREADSHEET_ID);
    var folders = ssFile.getParents();
    importFolder = folders.hasNext() ? folders.next() : DriveApp.getRootFolder();
    Logger.log('⚠ インポートデータフォルダが見つかりません。代替フォルダに保存します。');
  }

  var xlsxBlob = response.getBlob().setName(fileName);
  var savedFile = importFolder.createFile(xlsxBlob);

  // 一時スプレッドシートを削除
  DriveApp.getFileById(tempSs.getId()).setTrashed(true);

  Logger.log('✅ エクスポート完了: ' + andpadRows.length + '件');
  Logger.log('📁 ファイル: ' + savedFile.getUrl());

  return { fileName: fileName, fileUrl: savedFile.getUrl(), rowCount: andpadRows.length };
}
