/**
 * =============================================================
 * コラボハウス 来場アンケートシステム（v3.0）
 * ファイル: コード.gs
 * =============================================================
 * v2.x → v3.0: Google Form廃止 → 全画面GAS WebApp化
 *   - STEP0〜STEP3+完了画面を1つのWebAppで提供
 *   - 郵便番号→住所自動入力
 *   - 既存顧客検索（顧客マスタ統合シートから）
 *   - カタカナ入力
 *   - 新カラム構成（データ3分類: A/B/C）
 * =============================================================
 */

// 定数
var SPREADSHEET_ID = '1hSeqXhnlxXebNGE8IArGy48V89X1UIcvLIysQwDgSCk';
var RESPONSE_SHEET_NAME = 'Form Responses 2';
var MASTER_SHEET_NAME = '顧客マスタ統合シート';
var EDIT_SHEET_NAME = '編集データシート';
var SHARED_DRIVE_FOLDER_ID = '1GTVeABzQ9WZNdIVjqYQ8zUne4frZLDOC';

// 編集データシートのヘッダー（データテーブル定義書T2に準拠・32列）
var EDIT_HEADERS = [
  // 紐付けキー
  'SystemID',              // 1: KEY。顧客マスタとのRef
  '元データ種別',          // 2: ANDPAD既存 / アンケート新規

  // 分類B: 双方向同期
  '担当設計士',            // 3
  '次回来場予定日',        // 4

  // 分類C: AppSheet専用
  '完了フラグ',            // 5
  '予算（万円）',          // 6
  '土地有無',              // 7: あり/なし/検討中
  '競合',                  // 8
  '親承諾',                // 9: 問題なし/懸念あり
  '親承諾メモ',            // 10
  '希望入居時期',          // 11: YYYY-MM形式

  // 設計士メモ5件
  '設計士メモ1',           // 12
  '設計士メモ1_記入者',    // 13
  '設計士メモ1_記入日',    // 14
  '設計士メモ2',           // 15
  '設計士メモ2_記入者',    // 16
  '設計士メモ2_記入日',    // 17
  '設計士メモ3',           // 18
  '設計士メモ3_記入者',    // 19
  '設計士メモ3_記入日',    // 20
  '設計士メモ4',           // 21
  '設計士メモ4_記入者',    // 22
  '設計士メモ4_記入日',    // 23
  '設計士メモ5',           // 24
  '設計士メモ5_記入者',    // 25
  '設計士メモ5_記入日',    // 26

  // クロススタジオ管理（D13）
  '閲覧許可スタジオ',      // 27: EnumList。管理者・エリアマネジャーのみ編集可

  // ANDPAD連携管理
  'ANDPAD連携済',          // 28
  '連携ステータス',        // 29: 未連携/連携済/エラー/要修正
  '連携エラー',            // 30

  // 内部管理
  '最終更新者',            // 31
  '最終更新日時'           // 32
];

// 新カラム構成ヘッダー（データテーブル定義書に準拠）
var HEADERS = [
  // 分類A: ANDPAD連携対象 — STEP0入力
  'Timestamp',             // 1: 記録日時
  'スタジオ名',            // 2
  '案内担当者名',          // 3
  '来場日',                // 4
  '既存顧客フラグ',        // 5
  'ANDPAD顧客ID',          // 6: 既存顧客の場合の紐付けキー
  'ANDPADシステムID',      // 7: ANDPADの更新キー

  // 分類A: ANDPAD連携対象 — お客さま入力
  'お名前（漢字）',        // 8
  'フリガナ（カタカナ）',  // 9
  '年齢',                  // 10
  'ご家族の人数',          // 11
  '郵便番号',              // 12
  '都道府県',              // 13
  '住所',                  // 14
  '電話番号',              // 15
  'メールアドレス',        // 16

  // 家族情報（最大4人）
  'ご家族① 氏名',         // 17
  'ご家族① フリガナ',     // 18
  'ご家族① 年齢',         // 19
  'ご家族② 氏名',         // 20
  'ご家族② フリガナ',     // 21
  'ご家族② 年齢',         // 22
  'ご家族③ 氏名',         // 23
  'ご家族③ フリガナ',     // 24
  'ご家族③ 年齢',         // 25
  'ご家族④ 氏名',         // 26
  'ご家族④ フリガナ',     // 27
  'ご家族④ 年齢',         // 28

  // アンケート質問
  'ご職業',                // 29
  'コラボハウスへのお問い合わせ', // 30
  'ご来場のきっかけ',      // 31
  '紹介者名',              // 32
  '【SNS】',               // 33
  '【テレビ・動画広告】',  // 34
  '【雑誌・WEB】',         // 35
  '【チラシ・DM】',        // 36
  '【その他】',            // 37
  '検討中の住宅会社有無',  // 38
  '検討中の会社名',        // 39
  '見学会参加回数',        // 40
  '現在のお住まい',        // 41
  '現在の家賃（万円）',    // 42
  '今回のご計画',          // 43
  '入居希望時期',          // 44
  '家づくりで気になること', // 45
  'DM可否',                // 46

  // 分類B: 双方向同期
  '担当設計士',            // 47
  '次回来場予定日',        // 48

  // 分類C: AppSheet専用 — ヒアリング・営業情報
  '完了フラグ',            // 49
  '予算（万円）',          // 50
  '土地有無',              // 51
  '競合',                  // 52
  '親承諾',                // 53
  '親承諾メモ',            // 54
  '希望入居時期',          // 55

  // 分類C: 設計士メモ5件
  '設計士メモ1',           // 56
  '設計士メモ1_記入者',    // 57
  '設計士メモ1_記入日',    // 58
  '設計士メモ2',           // 59
  '設計士メモ2_記入者',    // 60
  '設計士メモ2_記入日',    // 61
  '設計士メモ3',           // 62
  '設計士メモ3_記入者',    // 63
  '設計士メモ3_記入日',    // 64
  '設計士メモ4',           // 65
  '設計士メモ4_記入者',    // 66
  '設計士メモ4_記入日',    // 67
  '設計士メモ5',           // 68
  '設計士メモ5_記入者',    // 69
  '設計士メモ5_記入日',    // 70

  // 分類C: ANDPAD連携管理
  'ANDPAD連携済',          // 71
  'ANDPAD案件ID',          // 72
  '連携ステータス',        // 73
  '連携エラー',            // 74

  // 内部管理
  '仮行フラグ',            // 75
  '仮行書込時刻',          // 76
  'セッションID',          // 77
  '最終更新者',            // 78
  '最終更新日時'           // 79
];


// =============================================================
//  doGet — WebApp エントリポイント
// =============================================================
function doGet(e) {
  var html = HtmlService.createHtmlOutput(getAnketeHtml());
  html.setTitle('コラボハウス ご来場アンケート');
  html.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  html.addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
  return html;
}


// =============================================================
//  スプレッドシート初期化（新カラム構成にリセット）
// =============================================================
function initializeSheet() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(RESPONSE_SHEET_NAME);

  // 既存データをクリア
  sheet.clear();

  // 新ヘッダーを書き込み
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);

  // 列幅を調整
  sheet.setFrozenRows(1);

  Logger.log('✅ シート初期化完了: ' + HEADERS.length + '列');
}


// =============================================================
//  全スタッフをスタジオ別にまとめて返す
// =============================================================
function getAllStaffByStudio() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName('ユーザーマスタ');
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var nameIdx = headers.indexOf('氏名');
  var studioIdx = headers.indexOf('スタジオ名');
  var orderIdx = headers.indexOf('表示順');

  var result = {};
  for (var i = 1; i < data.length; i++) {
    var name = data[i][nameIdx];
    var studio = data[i][studioIdx];
    var order = data[i][orderIdx] || 9999;
    if (!name || !studio) continue;
    if (!result[studio]) result[studio] = [];
    result[studio].push({ name: name, order: order });
  }

  // 表示順でソートし、名前だけの配列に変換
  for (var key in result) {
    result[key].sort(function(a, b) { return a.order - b.order; });
    result[key] = result[key].map(function(item) { return item.name; });
  }

  return result;
}


// =============================================================
//  既存顧客検索（顧客マスタ統合シートから）
// =============================================================
function searchExistingCustomer(query, searchType, studioName) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(MASTER_SHEET_NAME);

  if (!sheet || sheet.getLastRow() <= 1) return [];

  var data = sheet.getDataRange().getValues();
  var headers = data[0];

  // カラムインデックスを取得
  var idxSystemId = headers.indexOf('システムID');
  var idxCustomerId = headers.indexOf('顧客ID');
  var idxName = headers.indexOf('顧客名');
  var idxKana = headers.indexOf('顧客名（カナ）');
  var idxPhone = headers.indexOf('顧客電話番号1');
  var idxStudio = headers.indexOf('担当者所属店舗');

  var results = [];
  var queryLower = query.toLowerCase().trim();

  for (var i = 1; i < data.length; i++) {
    // スタジオ名でフィルタリング（指定がある場合）
    if (studioName) {
      var rowStudio = String(data[i][idxStudio] || '');
      if (rowStudio !== studioName) continue;
    }

    var match = false;

    if (searchType === 'name') {
      // 名前の部分一致
      var name = String(data[i][idxName] || '');
      var kana = String(data[i][idxKana] || '');
      match = name.indexOf(queryLower) >= 0 ||
              name.toLowerCase().indexOf(queryLower) >= 0 ||
              kana.indexOf(queryLower) >= 0;
    } else if (searchType === 'phone') {
      // 電話番号の完全一致（ハイフン除去して比較）
      var phone = String(data[i][idxPhone] || '').replace(/[-\s]/g, '');
      var queryPhone = queryLower.replace(/[-\s]/g, '');
      match = phone === queryPhone && queryPhone.length >= 4;
    }

    if (match) {
      results.push({
        systemId: data[i][idxSystemId] || '',
        customerId: data[i][idxCustomerId] || '',
        name: data[i][idxName] || '',
        kana: data[i][idxKana] || '',
        phone: data[i][idxPhone] || '',
        studio: data[i][idxStudio] || ''
      });
    }

    // 最大20件まで
    if (results.length >= 20) break;
  }

  return results;
}


// =============================================================
//  郵便番号→住所変換（サーバーサイド）
// =============================================================
function lookupAddress(zipcode) {
  try {
    var zip = String(zipcode).replace(/[-\s]/g, '');
    if (zip.length !== 7) return { error: '郵便番号は7桁で入力してください' };

    var url = 'https://zipcloud.ibsnet.co.jp/api/search?zipcode=' + zip;
    var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    var json = JSON.parse(response.getContentText());

    if (json.status !== 200 || !json.results || json.results.length === 0) {
      return { error: '住所が見つかりませんでした' };
    }

    var r = json.results[0];
    return {
      prefecture: r.address1,
      city: r.address2,
      town: r.address3,
      address: r.address1 + r.address2 + r.address3
    };
  } catch (e) {
    return { error: '住所検索でエラーが発生しました: ' + e.message };
  }
}


// =============================================================
//  アンケートデータ書き込み（STEP0〜STEP3の全データ）
// =============================================================
function writeAnketeData(formData) {
  var sheet = getResponseSheet_();
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  // ヘッダーが空なら初期化
  if (headers.length === 0 || !headers[0]) {
    initializeSheet();
    headers = HEADERS;
  }

  var newRow = sheet.getLastRow() + 1;
  var rowData = new Array(headers.length).fill('');

  // ヘッダー名→インデックスのマップ
  var colMap = {};
  headers.forEach(function(h, i) { colMap[h] = i; });

  // Timestamp
  rowData[colMap['Timestamp']] = new Date();

  // STEP0データ
  rowData[colMap['スタジオ名']] = formData.studioName || '';
  rowData[colMap['案内担当者名']] = formData.staffName || '';
  rowData[colMap['来場日']] = formData.visitDate || '';
  rowData[colMap['既存顧客フラグ']] = formData.isExisting || false;
  rowData[colMap['ANDPAD顧客ID']] = formData.andpadCustomerId || '';
  rowData[colMap['ANDPADシステムID']] = formData.andpadSystemId || '';

  // STEP1データ（個人情報）
  rowData[colMap['お名前（漢字）']] = formData.name || '';
  rowData[colMap['フリガナ（カタカナ）']] = formData.furigana || '';
  rowData[colMap['年齢']] = formData.age || '';
  rowData[colMap['ご家族の人数']] = formData.familyCount || 0;
  rowData[colMap['郵便番号']] = formData.zipcode || '';
  rowData[colMap['都道府県']] = formData.prefecture || '';
  rowData[colMap['住所']] = formData.address || '';
  rowData[colMap['電話番号']] = formData.phone || '';
  rowData[colMap['メールアドレス']] = formData.email || '';

  // STEP2データ（家族情報）
  for (var i = 1; i <= 4; i++) {
    var fam = formData['family' + i];
    if (fam) {
      rowData[colMap['ご家族' + toCircledNum(i) + ' 氏名']] = fam.name || '';
      rowData[colMap['ご家族' + toCircledNum(i) + ' フリガナ']] = fam.furigana || '';
      rowData[colMap['ご家族' + toCircledNum(i) + ' 年齢']] = fam.age || '';
    }
  }

  // STEP3データ（アンケート）
  rowData[colMap['ご職業']] = formData.occupation || '';
  rowData[colMap['コラボハウスへのお問い合わせ']] = formData.inquiry || '';
  rowData[colMap['ご来場のきっかけ']] = formData.visitReason || '';
  rowData[colMap['紹介者名']] = formData.referrerName || '';
  rowData[colMap['【SNS】']] = formData.sns || '';
  rowData[colMap['【テレビ・動画広告】']] = formData.tvAd || '';
  rowData[colMap['【雑誌・WEB】']] = formData.magazineWeb || '';
  rowData[colMap['【チラシ・DM】']] = formData.flyer || '';
  rowData[colMap['【その他】']] = formData.otherMedia || '';
  rowData[colMap['検討中の住宅会社有無']] = formData.hasCompetitor || '';
  rowData[colMap['検討中の会社名']] = formData.competitorNames || '';
  rowData[colMap['見学会参加回数']] = formData.visitCount || '';
  rowData[colMap['現在のお住まい']] = formData.currentHousing || '';
  rowData[colMap['現在の家賃（万円）']] = formData.currentRent || '';
  rowData[colMap['今回のご計画']] = formData.plan || '';
  rowData[colMap['入居希望時期']] = formData.moveTiming || '';
  rowData[colMap['家づくりで気になること']] = formData.concerns || '';
  rowData[colMap['DM可否']] = formData.dmPermission || '';

  // 連携ステータス初期値
  rowData[colMap['ANDPAD連携済']] = false;
  rowData[colMap['連携ステータス']] = '未連携';

  // 書き込み
  sheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);

  Logger.log('✅ アンケートデータ書き込み完了: 行' + newRow + ' ' + (formData.name || ''));
  return 'OK';
}


// =============================================================
//  丸数字変換ヘルパー
// =============================================================
function toCircledNum(n) {
  var nums = ['', '①', '②', '③', '④'];
  return nums[n] || String(n);
}


// =============================================================
//  回答シート取得
// =============================================================
function getResponseSheet_() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  return ss.getSheetByName(RESPONSE_SHEET_NAME);
}


// =============================================================
//  顧客マスタ同期（共有ドライブの最新xlsx → 顧客マスタ統合シート）
// =============================================================
function syncAndpadMaster() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var masterSheet = ss.getSheetByName(MASTER_SHEET_NAME);

  // 共有ドライブのエクスポートフォルダから最新xlsxを取得
  var folder = DriveApp.getFolderById(SHARED_DRIVE_FOLDER_ID);
  // エクスポートデータサブフォルダを検索
  var subFolders = folder.getFolders();
  var exportFolder = null;
  while (subFolders.hasNext()) {
    var f = subFolders.next();
    if (f.getName().indexOf('エクスポートデータ') >= 0) {
      exportFolder = f;
      break;
    }
  }

  if (!exportFolder) {
    Logger.log('エクスポートデータフォルダが見つかりません');
    return;
  }

  // 最新のxlsxファイルを取得（更新日時が最新のもの）
  var files = exportFolder.getFilesByType('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  var latestFile = null;
  var latestDate = null;

  while (files.hasNext()) {
    var file = files.next();
    var date = file.getLastUpdated();
    if (!latestDate || date > latestDate) {
      latestDate = date;
      latestFile = file;
    }
  }

  if (!latestFile) {
    Logger.log('エクスポートxlsxファイルが見つかりません。スキップします。');
    return;
  }

  Logger.log('最新ファイル: ' + latestFile.getName() + ' (' + latestDate + ')');

  // xlsxをGoogleスプレッドシートに一時変換して読み込む
  var tempSs = convertXlsxToSheet_(latestFile);
  var tempSheet = tempSs.getActiveSheet();
  var data = tempSheet.getDataRange().getValues();

  // 顧客マスタ統合シートをクリアして書き込み
  masterSheet.clear();
  if (data.length > 0) {
    masterSheet.getRange(1, 1, data.length, data[0].length).setValues(data);
  }

  // 一時スプレッドシートを削除
  DriveApp.getFileById(tempSs.getId()).setTrashed(true);

  Logger.log('✅ 顧客マスタ同期完了: ' + (data.length - 1) + '件');
}


/**
 * xlsxファイルをGoogleスプレッドシートに変換
 */
function convertXlsxToSheet_(file) {
  var blob = file.getBlob();
  var resource = {
    title: '_temp_import_' + new Date().getTime(),
    mimeType: MimeType.GOOGLE_SHEETS
  };
  var newFile = Drive.Files.insert(resource, blob, {
    convert: true,
    supportsAllDrives: true
  });
  return SpreadsheetApp.openById(newFile.id);
}


// =============================================================
//  連携ステータス更新（編集データシートベース）
// =============================================================
/**
 * archiveフォルダに今日のファイルがあれば、
 * 編集データシートの「連携待ち」→「連携済」に更新する。
 */
function updateLinkageStatus() {
  var editSheet = getEditSheet_();
  var lastRow = editSheet.getLastRow();
  if (lastRow <= 1) return;

  var headers = editSheet.getRange(1, 1, 1, editSheet.getLastColumn()).getValues()[0];
  var colStatus = headers.indexOf('連携ステータス') + 1;
  var colLinked = headers.indexOf('ANDPAD連携済') + 1;

  if (colStatus === 0 || colLinked === 0) {
    Logger.log('連携ステータスカラムが見つかりません');
    return;
  }

  // 共有ドライブのインポートフォルダを確認
  var folder = DriveApp.getFolderById(SHARED_DRIVE_FOLDER_ID);
  var subFolders = folder.getFolders();
  var importFolder = null;
  while (subFolders.hasNext()) {
    var f = subFolders.next();
    if (f.getName().indexOf('インポートデータ') >= 0) {
      importFolder = f;
      break;
    }
  }

  if (!importFolder) {
    Logger.log('インポートデータフォルダが見つかりません');
    return;
  }

  // archiveサブフォルダの最新ファイルの日時を確認
  var archiveFolders = importFolder.getFolders();
  var archiveFolder = null;
  while (archiveFolders.hasNext()) {
    var af = archiveFolders.next();
    if (af.getName() === 'archive') {
      archiveFolder = af;
      break;
    }
  }

  if (!archiveFolder) {
    Logger.log('archiveフォルダが見つかりません。インポート未完了の可能性。');
    return;
  }

  // 今日のarchiveファイルがあるか確認
  var today = new Date();
  var todayStr = Utilities.formatDate(today, 'Asia/Tokyo', 'yyyy-MM-dd');
  var archiveFiles = archiveFolder.getFiles();
  var hasRecentArchive = false;

  while (archiveFiles.hasNext()) {
    var af = archiveFiles.next();
    var fileDate = Utilities.formatDate(af.getLastUpdated(), 'Asia/Tokyo', 'yyyy-MM-dd');
    if (fileDate === todayStr) {
      hasRecentArchive = true;
      break;
    }
  }

  if (!hasRecentArchive) {
    Logger.log('今日のインポート完了ファイルがありません。スキップ。');
    return;
  }

  // 「連携待ち」の行を「連携済」に更新
  var allData = editSheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
  var updated = 0;

  for (var i = 0; i < allData.length; i++) {
    var status = allData[i][colStatus - 1];

    if (status === '連携待ち') {
      var rowNum = i + 2;
      editSheet.getRange(rowNum, colLinked).setValue(true);
      editSheet.getRange(rowNum, colStatus).setValue('連携済');
      updated++;
    }
  }

  Logger.log('✅ 連携ステータス更新: ' + updated + '件を「連携済」に変更');
}


// =============================================================
//  編集データシート初期化（T2: 32列）
// =============================================================
function initializeEditSheet() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(EDIT_SHEET_NAME);

  // シートが無ければ新規作成
  if (!sheet) {
    sheet = ss.insertSheet(EDIT_SHEET_NAME);
    Logger.log('「' + EDIT_SHEET_NAME + '」シートを新規作成しました');
  } else {
    // 既存データがある場合はヘッダー行だけ上書き（データは残す）
    Logger.log('「' + EDIT_SHEET_NAME + '」シートは既に存在します。ヘッダーを更新します');
  }

  // ヘッダー書き込み
  sheet.getRange(1, 1, 1, EDIT_HEADERS.length).setValues([EDIT_HEADERS]);
  sheet.setFrozenRows(1);

  Logger.log('✅ 編集データシート初期化完了: ' + EDIT_HEADERS.length + '列');
}


// =============================================================
//  編集データシート取得ヘルパー
// =============================================================
function getEditSheet_() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(EDIT_SHEET_NAME);
  if (!sheet) {
    throw new Error('編集データシートが存在しません。initializeEditSheet()を先に実行してください。');
  }
  return sheet;
}


// =============================================================
//  アンケート → 編集データシート転記（日次バッチ 07:30）
// =============================================================
/**
 * Form Responses 2 の未転記行を編集データシートに転記する。
 * - 既存顧客（ANDPADシステムID有り）→ 元データ種別「ANDPAD既存」
 * - 新規顧客（ANDPADシステムID無し）→ 元データ種別「アンケート新規」
 * - 転記済みの行は「仮行フラグ」を「転記済」にマークしてスキップ
 */
function transferAnketeToEditSheet() {
  var responseSheet = getResponseSheet_();
  var editSheet = getEditSheet_();

  var responseLastRow = responseSheet.getLastRow();
  if (responseLastRow <= 1) {
    Logger.log('アンケートデータがありません。スキップ。');
    return;
  }

  // Form Responses 2 のデータ読み込み
  var responseHeaders = responseSheet.getRange(1, 1, 1, responseSheet.getLastColumn()).getValues()[0];
  var responseData = responseSheet.getRange(2, 1, responseLastRow - 1, responseHeaders.length).getValues();

  // カラムインデックス（Form Responses 2）
  var rCol = {};
  responseHeaders.forEach(function(h, i) { rCol[h] = i; });

  // 編集データシートのヘッダーとカラムマップ
  var editHeaders = editSheet.getRange(1, 1, 1, editSheet.getLastColumn()).getValues()[0];
  var eCol = {};
  editHeaders.forEach(function(h, i) { eCol[h] = i; });

  // 編集データシートの既存SystemID一覧（重複防止）
  var existingIds = {};
  var editLastRow = editSheet.getLastRow();
  if (editLastRow > 1) {
    var editSystemIds = editSheet.getRange(2, eCol['SystemID'] + 1, editLastRow - 1, 1).getValues();
    editSystemIds.forEach(function(row) {
      if (row[0]) existingIds[String(row[0])] = true;
    });
  }

  // 転記対象の行を収集
  var newRows = [];
  var transferredResponseRows = []; // 転記済みマークする行番号

  for (var i = 0; i < responseData.length; i++) {
    // 既に転記済みの行はスキップ
    var flag = responseData[i][rCol['仮行フラグ']];
    if (flag === '転記済') continue;

    // Timestampが無い行はスキップ（空行対策）
    if (!responseData[i][rCol['Timestamp']]) continue;

    var systemId = String(responseData[i][rCol['ANDPADシステムID']] || '');
    var isExisting = responseData[i][rCol['既存顧客フラグ']];

    // 新規顧客の場合、一意キーとしてTimestamp+氏名をIDに使う
    var editKey = systemId;
    if (!editKey) {
      // 新規顧客用の仮SystemID（後でANDPADインポート時に正式ID付与）
      editKey = 'NEW_' + Utilities.formatDate(
        new Date(responseData[i][rCol['Timestamp']]),
        'Asia/Tokyo',
        'yyyyMMddHHmmss'
      );
    }

    // 既に編集データシートに存在する場合はスキップ
    if (existingIds[editKey]) continue;

    // 編集データシートの新しい行を構築
    var newRow = new Array(editHeaders.length).fill('');

    newRow[eCol['SystemID']] = editKey;
    newRow[eCol['元データ種別']] = (isExisting === true || isExisting === 'TRUE') ? 'ANDPAD既存' : 'アンケート新規';

    // 連携ステータス初期値
    newRow[eCol['ANDPAD連携済']] = false;
    newRow[eCol['連携ステータス']] = '未連携';

    // 最終更新
    newRow[eCol['最終更新日時']] = new Date();
    newRow[eCol['最終更新者']] = 'system@batch';

    newRows.push(newRow);
    existingIds[editKey] = true;
    transferredResponseRows.push(i + 2); // シートの行番号（1始まり + ヘッダー行）
  }

  if (newRows.length === 0) {
    Logger.log('転記対象のアンケートデータはありません。');
    return;
  }

  // 編集データシートに一括書き込み
  var writeStart = editSheet.getLastRow() + 1;
  editSheet.getRange(writeStart, 1, newRows.length, editHeaders.length).setValues(newRows);

  // Form Responses 2 の転記済みマーク
  var flagCol = rCol['仮行フラグ'] + 1;
  transferredResponseRows.forEach(function(rowNum) {
    responseSheet.getRange(rowNum, flagCol).setValue('転記済');
  });

  Logger.log('✅ アンケート→編集データシート転記完了: ' + newRows.length + '件');
}


// =============================================================
//  トリガー一括登録
// =============================================================
function setupAllTriggers() {
  // 既存トリガーを削除
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(t) { ScriptApp.deleteTrigger(t); });

  // 毎日0:00 — ANDPADインポート用xlsx生成
  ScriptApp.newTrigger('exportToAndpadXlsx')
    .timeBased()
    .atHour(0)
    .everyDays(1)
    .create();

  // 毎日1:00 — 連携ステータス更新
  ScriptApp.newTrigger('updateLinkageStatus')
    .timeBased()
    .atHour(1)
    .everyDays(1)
    .create();

  // 毎日7:00 — 顧客マスタ同期
  ScriptApp.newTrigger('syncAndpadMaster')
    .timeBased()
    .atHour(7)
    .everyDays(1)
    .create();

  // 毎日7:30 — アンケート→編集データシート転記
  ScriptApp.newTrigger('transferAnketeToEditSheet')
    .timeBased()
    .atHour(7)
    .nearMinute(30)
    .everyDays(1)
    .create();

  Logger.log('✅ トリガー4件を登録しました');
}
