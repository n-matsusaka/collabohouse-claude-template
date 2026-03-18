/**
 * anketeHtml.gs（v3.0）— 全画面アンケートWebApp
 * STEP0（スタッフ記入）→ STEP1（個人情報）→ STEP2（家族情報）→ STEP3（住宅計画）→ 完了
 */
function getAnketeHtml() {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<style>
  @import url("https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap");
  :root{--primary:#1a1a2e;--accent:#c8a45c;--bg:#faf9f6;--card-bg:#fff;--text:#2c2c2c;--text-light:#6b6b6b;--border:#e8e4dc;--radius:12px;--error:#c0392b;--success:#27ae60}
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:"Zen Kaku Gothic New","Noto Sans JP",sans-serif;background:var(--bg);color:var(--text);min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:24px}
  .logo-area{text-align:center;margin-bottom:20px;animation:fadeDown .8s ease}
  .logo-area .brand{font-size:22px;letter-spacing:8px;color:var(--primary);font-weight:700}
  .card{background:var(--card-bg);border-radius:var(--radius);box-shadow:0 2px 24px rgba(0,0,0,.06),0 0 0 1px rgba(0,0,0,.03);padding:36px 32px;max-width:520px;width:100%;animation:fadeUp .6s ease .2s both}
  .step-ind{display:flex;align-items:center;gap:8px;margin-bottom:24px;font-size:12px;color:var(--text-light);font-weight:500;letter-spacing:1px}
  .step-ind .dot{width:8px;height:8px;border-radius:50%;background:var(--accent)}
  .step-dots{display:flex;gap:8px;justify-content:center;margin-bottom:24px}
  .step-dots .sdot{width:10px;height:10px;border-radius:50%;background:var(--border);transition:all .3s}
  .step-dots .sdot.active{background:var(--accent);transform:scale(1.2)}
  .step-dots .sdot.done{background:var(--success)}
  .fg{margin-bottom:18px}
  .fg label{display:block;font-size:13px;font-weight:500;margin-bottom:6px;letter-spacing:.5px}
  .fg label .req{color:var(--error);font-size:11px;margin-left:4px}
  .fg .hint{font-size:11px;color:var(--text-light);margin-top:4px}
  select,input[type="text"],input[type="number"],input[type="email"],input[type="tel"],input[type="date"],input[type="month"],textarea{width:100%;padding:13px 16px;border:1.5px solid var(--border);border-radius:8px;font-size:15px;font-family:inherit;color:var(--text);background:#fff;transition:all .25s ease}
  select{appearance:none;cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%236b6b6b' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 16px center;padding-right:44px}
  textarea{min-height:80px;resize:vertical}
  select:focus,input:focus,textarea:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px rgba(200,164,92,.15)}
  .input-row{display:flex;gap:12px}
  .input-row .fg{flex:1}
  .staff-list{display:flex;flex-direction:column;gap:8px}
  .staff-btn{display:flex;align-items:center;gap:12px;width:100%;padding:13px 16px;background:#fff;border:1.5px solid var(--border);border-radius:8px;text-align:left;font-size:15px;font-family:inherit;cursor:pointer;transition:all .2s ease}
  .staff-btn:hover{border-color:var(--accent);background:#fffdf7}
  .staff-btn.selected{border-color:var(--accent);background:linear-gradient(135deg,#fffdf7,#fdf6e3);box-shadow:0 0 0 3px rgba(200,164,92,.12)}
  .radio-circle{width:20px;height:20px;border-radius:50%;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .2s ease}
  .staff-btn.selected .radio-circle{border-color:var(--accent);background:var(--accent)}
  .staff-btn.selected .radio-circle::after{content:"";width:6px;height:6px;border-radius:50%;background:#fff}
  .choice-btn{display:inline-block;padding:10px 18px;margin:4px;border:1.5px solid var(--border);border-radius:20px;font-size:14px;font-family:inherit;cursor:pointer;background:#fff;transition:all .2s}
  .choice-btn:hover{border-color:var(--accent);background:#fffdf7}
  .choice-btn.selected{border-color:var(--accent);background:linear-gradient(135deg,#fffdf7,#fdf6e3);color:var(--primary);font-weight:500}
  .check-btn{display:inline-block;padding:8px 14px;margin:3px;border:1.5px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit;cursor:pointer;background:#fff;transition:all .2s}
  .check-btn.selected{border-color:var(--accent);background:#fdf6e3}
  .btn-row{display:flex;gap:12px;margin-top:16px}
  .btn{flex:1;padding:15px;border:none;border-radius:8px;font-size:15px;font-weight:700;font-family:inherit;letter-spacing:2px;cursor:pointer;transition:all .3s ease}
  .btn-primary{background:var(--primary);color:#fff}
  .btn-primary:hover:not(:disabled){background:#2a2a4e;transform:translateY(-1px);box-shadow:0 4px 16px rgba(26,26,46,.3)}
  .btn-secondary{background:#fff;color:var(--text);border:1.5px solid var(--border)}
  .btn-secondary:hover{border-color:var(--accent)}
  .btn:disabled{background:#ccc;cursor:not-allowed;color:#999}
  .btn.processing{background:#666;cursor:wait}
  .empty-msg{text-align:center;padding:20px;color:var(--text-light);font-size:13px;border:1.5px dashed var(--border);border-radius:8px}
  .search-box{display:flex;gap:8px}
  .search-box input{flex:1}
  .search-box button{padding:12px 20px;border:1.5px solid var(--accent);background:var(--accent);color:#fff;border-radius:8px;font-family:inherit;font-size:14px;font-weight:500;cursor:pointer}
  .search-result{margin-top:12px;max-height:240px;overflow-y:auto}
  .search-item{padding:12px 16px;border:1.5px solid var(--border);border-radius:8px;margin-bottom:8px;cursor:pointer;transition:all .2s}
  .search-item:hover{border-color:var(--accent);background:#fffdf7}
  .search-item.selected{border-color:var(--accent);background:linear-gradient(135deg,#fffdf7,#fdf6e3);box-shadow:0 0 0 3px rgba(200,164,92,.12)}
  .search-item.selected::before{content:"✓ ";color:var(--accent);font-weight:700}
  .search-item .si-name{font-weight:500;font-size:15px;display:inline}
  .search-item .si-detail{font-size:12px;color:var(--text-light);margin-top:4px}
  .family-block{background:#f8f7f4;border-radius:8px;padding:16px;margin-bottom:12px}
  .family-block h4{font-size:13px;font-weight:500;margin-bottom:10px;color:var(--accent)}
  .note{text-align:center;font-size:11px;color:var(--text-light);margin-top:16px;line-height:1.7}
  .complete-icon{font-size:64px;text-align:center;margin:20px 0}
  .complete-msg{text-align:center;font-size:18px;font-weight:500;margin-bottom:12px}
  .complete-sub{text-align:center;font-size:14px;color:var(--text-light);line-height:1.8}
  .hidden{display:none}
  .fade-in{animation:fadeUp .35s ease both}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
  @media(min-width:768px){.card{padding:44px 40px}.logo-area .brand{font-size:26px}}
</style>
</head>
<body>
<div class="logo-area"><div class="brand">COLLABOHOUSE</div></div>

<!-- ===== STEP 0: スタッフ記入 ===== -->
<div class="card" id="step0">
  <div class="step-ind"><span class="dot"></span><span>STEP 0 — スタッフ記入欄</span></div>
  <div class="fg">
    <label>スタジオ名 <span class="req">必須</span></label>
    <select id="studioSelect" onchange="onStudioChange()">
      <option value="" disabled selected>スタジオを選択してください</option>
      <optgroup label="愛媛県"><option value="束本">束本</option><option value="久万ノ台">久万ノ台</option><option value="今治">今治</option><option value="新居浜">新居浜</option></optgroup>
      <optgroup label="香川県"><option value="高松">高松</option><option value="丸亀">丸亀</option><option value="国分寺">国分寺</option></optgroup>
      <optgroup label="徳島県"><option value="徳島北島">徳島北島</option><option value="徳島沖浜">徳島沖浜</option></optgroup>
      <optgroup label="大阪府"><option value="中百舌鳥">中百舌鳥</option><option value="和泉府中">和泉府中</option></optgroup>
      <optgroup label="秋田県"><option value="秋田山王">秋田山王</option></optgroup>
      <optgroup label="岡山県"><option value="岡山倉敷">岡山倉敷</option><option value="岡山辰巳">岡山辰巳</option></optgroup>
      <optgroup label="高知県"><option value="高知知寄">高知知寄</option></optgroup>
      <optgroup label="広島県"><option value="広島福山">広島福山</option></optgroup>
    </select>
  </div>
  <div class="fg hidden" id="staffGroup">
    <label>案内担当者 <span class="req">必須</span></label>
    <div class="staff-list" id="staffList"></div>
  </div>
  <div class="fg">
    <label>来場日 <span class="req">必須</span></label>
    <input type="date" id="visitDate">
  </div>
  <div class="fg">
    <label>お客さまの種別 <span class="req">必須</span></label>
    <div style="display:flex;gap:12px">
      <button type="button" class="choice-btn" onclick="setCustomerType(false)" id="btnNew">新規のお客さま</button>
      <button type="button" class="choice-btn" onclick="setCustomerType(true)" id="btnExisting">既存のお客さま</button>
    </div>
  </div>
  <div class="fg hidden" id="searchGroup">
    <label>既存顧客検索</label>
    <div style="display:flex;gap:8px;margin-bottom:8px">
      <button type="button" class="choice-btn selected" id="searchByName" onclick="setSearchType('name')">名前で検索</button>
      <button type="button" class="choice-btn" id="searchByPhone" onclick="setSearchType('phone')">電話番号で検索</button>
    </div>
    <div class="search-box">
      <input type="text" id="searchQuery" placeholder="名前を入力">
      <button onclick="doSearch()">検索</button>
    </div>
    <div class="search-result" id="searchResult"></div>
  </div>
  <div class="btn-row">
    <button class="btn btn-primary" id="startBtn" disabled onclick="goToStep1()">アンケートを始める</button>
  </div>
</div>

<!-- ===== STEP 1: 個人情報 ===== -->
<div class="card hidden" id="step1">
  <div class="step-dots"><span class="sdot active"></span><span class="sdot"></span><span class="sdot"></span></div>
  <div class="step-ind"><span class="dot"></span><span>STEP 1 — お客さま情報</span></div>
  <div class="input-row">
    <div class="fg"><label>お名前 <span class="req">必須</span></label><input type="text" id="inName" placeholder="山田 太郎"></div>
  </div>
  <div class="fg"><label>フリガナ（カタカナ）<span class="req">必須</span></label><input type="text" id="inFurigana" placeholder="ヤマダ タロウ"></div>
  <div class="fg"><label>年齢</label><input type="number" id="inAge" placeholder="35" min="0" max="120"></div>
  <div class="input-row">
    <div class="fg" style="flex:0 0 140px"><label>郵便番号</label><input type="text" id="inZip" placeholder="790-0001" maxlength="8" oninput="onZipInput()"></div>
    <div class="fg"><label>都道府県</label><input type="text" id="inPref" placeholder="自動入力" readonly></div>
  </div>
  <div class="fg"><label>住所</label><input type="text" id="inAddress" placeholder="郵便番号入力で自動入力されます"></div>
  <div class="fg"><label>電話番号</label><input type="tel" id="inPhone" placeholder="090-1234-5678"></div>
  <div class="fg"><label>メールアドレス</label><input type="email" id="inEmail" placeholder="example@mail.com"></div>
  <div class="fg"><label>ご家族の人数（ご本人を除く）</label>
    <select id="inFamilyCount" onchange="onFamilyCountChange()">
      <option value="0">0人</option><option value="1">1人</option><option value="2">2人</option><option value="3">3人</option><option value="4">4人</option>
    </select>
  </div>
  <div class="btn-row">
    <button class="btn btn-secondary" onclick="goToStep0()">戻る</button>
    <button class="btn btn-primary" id="step1Next" onclick="goToStep2()">次へ</button>
  </div>
</div>

<!-- ===== STEP 2: 家族情報 ===== -->
<div class="card hidden" id="step2">
  <div class="step-dots"><span class="sdot done"></span><span class="sdot active"></span><span class="sdot"></span></div>
  <div class="step-ind"><span class="dot"></span><span>STEP 2 — ご家族情報</span></div>
  <div id="familyForms"></div>
  <div class="btn-row">
    <button class="btn btn-secondary" onclick="showStep('step1')">戻る</button>
    <button class="btn btn-primary" onclick="goToStep3()">次へ</button>
  </div>
</div>

<!-- ===== STEP 3: 住宅計画 ===== -->
<div class="card hidden" id="step3">
  <div class="step-dots"><span class="sdot done"></span><span class="sdot done"></span><span class="sdot active"></span></div>
  <div class="step-ind"><span class="dot"></span><span>STEP 3 — 住まいづくりについて</span></div>
  <div class="fg"><label>ご職業</label>
    <select id="inOccupation"><option value="">選択してください</option><option>会社員</option><option>自営業</option><option>公務員</option><option>パート・アルバイト</option><option>学生</option><option>その他</option></select>
  </div>
  <div class="fg"><label>コラボハウスへのお問い合わせは？</label>
    <div id="inquiryChoices" class="choice-group"></div>
  </div>
  <div class="fg"><label>ご来場のきっかけは？（1つ選択）</label>
    <div id="reasonChoices" class="choice-group"></div>
  </div>
  <div class="fg hidden" id="referrerGroup"><label>紹介者名</label><input type="text" id="inReferrer" placeholder="紹介者のお名前"></div>
  <div class="fg hidden" id="snsGroup"><label>【SNS】（複数選択可）</label><div id="snsChoices"></div></div>
  <div class="fg hidden" id="tvGroup"><label>【テレビ・動画広告】（複数選択可）</label><div id="tvChoices"></div></div>
  <div class="fg hidden" id="magGroup"><label>【雑誌・WEB】（複数選択可）</label><div id="magChoices"></div></div>
  <div class="fg hidden" id="flyerGroup"><label>【チラシ・DM】（複数選択可）</label><div id="flyerChoices"></div></div>
  <div class="fg hidden" id="otherMediaGroup"><label>【その他】（複数選択可）</label><div id="otherMediaChoices"></div></div>
  <div class="fg"><label>現在、コラボハウス以外にご検討中の住宅会社はありますか？</label>
    <div id="competitorChoices" class="choice-group"></div>
  </div>
  <div class="fg hidden" id="competitorNameGroup"><label>検討中の会社名</label><input type="text" id="inCompetitorNames" placeholder="会社名をご記入ください"></div>
  <div class="fg"><label>モデルハウス・完成見学会への参加回数（他社含む）</label>
    <select id="inVisitCount"><option value="">選択してください</option><option>初めて</option><option>2回目</option><option>3〜5回</option><option>6回以上</option></select>
  </div>
  <div class="fg"><label>現在のお住まいは？</label>
    <select id="inCurrentHousing"><option value="">選択してください</option><option>持ち家（一戸建て）</option><option>持ち家（マンション）</option><option>賃貸（アパート・マンション）</option><option>賃貸（一戸建て）</option><option>社宅・寮</option><option>実家</option><option>その他</option></select>
  </div>
  <div class="fg"><label>現在の家賃（万円）</label><input type="number" id="inRent" placeholder="7" min="0"></div>
  <div class="fg"><label>今回のご計画は？</label>
    <select id="inPlan"><option value="">選択してください</option><option>新築</option><option>建て替え</option><option>住み替え</option><option>土地探しから</option><option>まだ決まっていない</option></select>
  </div>
  <div class="fg"><label>ご入居の希望時期は？</label>
    <select id="inMoveTiming"><option value="">選択してください</option><option>半年以内</option><option>1年以内</option><option>2年以内</option><option>3年以上先</option><option>未定</option></select>
  </div>
  <div class="fg"><label>家づくりにおいて気になることは？（複数選択可）</label><div id="concernChoices"></div></div>
  <div class="fg"><label>今後の完成見学会やイベントの案内をお送りしてもよろしいですか？</label>
    <div id="dmChoices" class="choice-group"></div>
  </div>
  <div class="btn-row">
    <button class="btn btn-secondary" onclick="showStep('step2')">戻る</button>
    <button class="btn btn-primary" id="submitBtn" onclick="submitForm()">送信する</button>
  </div>
</div>

<!-- ===== 完了画面 ===== -->
<div class="card hidden" id="stepComplete">
  <div class="complete-icon">✓</div>
  <div class="complete-msg">ありがとうございました</div>
  <div class="complete-sub">アンケートへのご協力ありがとうございます。<br>スタッフにiPadをお返しください。</div>
  <p class="note" style="margin-top:24px" id="autoResetMsg"></p>
</div>

<p class="note" id="footerNote">スタッフが記入後、お客さまにiPadをお渡しください。<br>お客さまはそのままアンケートに進みます。</p>

<script>
// ==================== 状態管理 ====================
var allStaffData = {};
var selectedStaff = "";
var isExistingCustomer = false;
var selectedCustomer = null;
var searchType = "name";
var singleChoiceValues = {};

// ==================== 初期化 ====================
document.getElementById("visitDate").value = new Date().toISOString().split("T")[0];

google.script.run.withSuccessHandler(function(data){
  allStaffData = data || {};
}).getAllStaffByStudio();

// 選択肢を動的生成
initChoices();

function initChoices() {
  // コラボハウスへのお問い合わせ（単一選択）
  renderSingleChoices("inquiryChoices", "inquiry", ["初めての来場","資料請求したことがある","電話で問い合わせたことがある","イベントに参加したことがある"]);

  // ご来場のきっかけ（単一選択）
  renderSingleChoices("reasonChoices", "reason", ["紹介","SNS","テレビ・動画広告","雑誌・WEB","チラシ・DM","看板・通りがかり","その他・イベント"]);

  // SNS（複数選択）
  renderMultiChoices("snsChoices", ["Instagram","YouTube","TikTok","Facebook","LINE","X（旧Twitter）","Pinterest"]);
  // テレビ・動画広告
  renderMultiChoices("tvChoices", ["テレビCM","TVer広告","YouTube広告"]);
  // 雑誌・WEB
  renderMultiChoices("magChoices", ["ホームページ","SUUMO","e-house","住まいの窓口","その他"]);
  // チラシ・DM
  renderMultiChoices("flyerChoices", ["新聞折込チラシ","ポスティングチラシ","DM（ダイレクトメール）"]);
  // その他・イベント
  renderMultiChoices("otherMediaChoices", ["住宅展示場","完成見学会","相談会","その他"]);

  // 検討中の住宅会社
  renderSingleChoices("competitorChoices", "competitor", ["ある","ない"]);
  // DM可否
  renderSingleChoices("dmChoices", "dm", ["はい","いいえ"]);

  // 家づくりで気になること（複数選択）
  renderMultiChoices("concernChoices", ["間取り・プラン","資金計画・住宅ローン","土地探し","デザイン・内装","断熱・省エネ","耐震性能","アフターサービス","収納","外構・庭","その他"]);
}

function renderSingleChoices(containerId, groupName, choices) {
  var container = document.getElementById(containerId);
  choices.forEach(function(c) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice-btn";
    btn.textContent = c;
    btn.onclick = function() {
      container.querySelectorAll(".choice-btn").forEach(function(b){b.classList.remove("selected")});
      btn.classList.add("selected");
      singleChoiceValues[groupName] = c;
      onReasonChange(groupName, c);
    };
    container.appendChild(btn);
  });
}

function renderMultiChoices(containerId, choices) {
  var container = document.getElementById(containerId);
  choices.forEach(function(c) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "check-btn";
    btn.textContent = c;
    btn.onclick = function() { btn.classList.toggle("selected"); };
    container.appendChild(btn);
  });
}

function getMultiValues(containerId) {
  var btns = document.getElementById(containerId).querySelectorAll(".check-btn.selected");
  return Array.from(btns).map(function(b){return b.textContent}).join(", ");
}

function onReasonChange(group, value) {
  if (group === "reason") {
    document.getElementById("referrerGroup").classList.toggle("hidden", value !== "紹介");
    document.getElementById("snsGroup").classList.toggle("hidden", value !== "SNS");
    document.getElementById("tvGroup").classList.toggle("hidden", value !== "テレビ・動画広告");
    document.getElementById("magGroup").classList.toggle("hidden", value !== "雑誌・WEB");
    document.getElementById("flyerGroup").classList.toggle("hidden", value !== "チラシ・DM");
    document.getElementById("otherMediaGroup").classList.toggle("hidden", value !== "その他・イベント");
  }
  if (group === "competitor") {
    document.getElementById("competitorNameGroup").classList.toggle("hidden", value !== "ある");
  }
}

// ==================== STEP0 ロジック ====================
function onStudioChange() {
  var studio = document.getElementById("studioSelect").value;
  var staffGroup = document.getElementById("staffGroup");
  var staffList = document.getElementById("staffList");
  selectedStaff = "";
  staffList.innerHTML = "";
  updateStep0Button();
  if (!studio) { staffGroup.classList.add("hidden"); return; }
  staffGroup.classList.remove("hidden");
  var names = allStaffData[studio] || [];
  if (names.length === 0) {
    staffList.innerHTML = '<div class="empty-msg">このスタジオの担当者が登録されていません</div>';
    return;
  }
  names.forEach(function(name, i) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "staff-btn fade-in";
    btn.style.animationDelay = (i * 0.06) + "s";
    btn.innerHTML = '<span class="radio-circle"></span><span>' + name + '</span>';
    btn.onclick = function() { selectStaff(name, btn); };
    staffList.appendChild(btn);
  });
}

function selectStaff(name, btn) {
  document.querySelectorAll(".staff-btn").forEach(function(b){b.classList.remove("selected")});
  btn.classList.add("selected");
  selectedStaff = name;
  updateStep0Button();
}

function setCustomerType(isExisting) {
  isExistingCustomer = isExisting;
  selectedCustomer = null;
  document.getElementById("btnNew").classList.toggle("selected", !isExisting);
  document.getElementById("btnExisting").classList.toggle("selected", isExisting);
  document.getElementById("searchGroup").classList.toggle("hidden", !isExisting);
  if (!isExisting) document.getElementById("searchResult").innerHTML = "";
  updateStep0Button();
}

function setSearchType(type) {
  searchType = type;
  document.getElementById("searchByName").classList.toggle("selected", type === "name");
  document.getElementById("searchByPhone").classList.toggle("selected", type === "phone");
  document.getElementById("searchQuery").placeholder = type === "name" ? "名前を入力" : "電話番号を入力";
  document.getElementById("searchQuery").value = "";
}

function doSearch() {
  var query = document.getElementById("searchQuery").value.trim();
  if (!query) return;
  var resultDiv = document.getElementById("searchResult");
  resultDiv.innerHTML = '<div class="empty-msg">検索中...</div>';
  google.script.run.withSuccessHandler(function(results) {
    resultDiv.innerHTML = "";
    if (!results || results.length === 0) {
      resultDiv.innerHTML = '<div class="empty-msg">該当するお客さまが見つかりませんでした</div>';
      return;
    }
    results.forEach(function(r) {
      var div = document.createElement("div");
      div.className = "search-item";
      div.innerHTML = '<div class="si-name">' + r.name + '（' + (r.kana || '') + '）</div><div class="si-detail">TEL: ' + (r.phone || '未登録') + ' / ' + (r.studio || '') + '</div>';
      div.onclick = function() {
        resultDiv.querySelectorAll(".search-item").forEach(function(el){el.classList.remove("selected")});
        div.classList.add("selected");
        selectedCustomer = r;
        updateStep0Button();
      };
      resultDiv.appendChild(div);
    });
  }).searchExistingCustomer(query, searchType, document.getElementById("studioSelect").value);
}

function updateStep0Button() {
  var studio = document.getElementById("studioSelect").value;
  var date = document.getElementById("visitDate").value;
  var typeSelected = document.getElementById("btnNew").classList.contains("selected") || document.getElementById("btnExisting").classList.contains("selected");
  var existingOk = !isExistingCustomer || selectedCustomer;
  document.getElementById("startBtn").disabled = !(studio && selectedStaff && date && typeSelected && existingOk);
}
document.getElementById("visitDate").addEventListener("change", updateStep0Button);

// ==================== 画面遷移 ====================
function showStep(stepId) {
  ["step0","step1","step2","step3","stepComplete"].forEach(function(id){
    document.getElementById(id).classList.add("hidden");
  });
  document.getElementById(stepId).classList.remove("hidden");
  document.getElementById("footerNote").classList.toggle("hidden", stepId !== "step0");
  window.scrollTo(0, 0);
}

function goToStep0() { showStep("step0"); }

function goToStep1() {
  // 既存顧客の場合、お名前と電話番号をプリフィル
  if (isExistingCustomer && selectedCustomer) {
    document.getElementById("inName").value = selectedCustomer.name || "";
    document.getElementById("inFurigana").value = selectedCustomer.kana || "";
    document.getElementById("inPhone").value = selectedCustomer.phone || "";
  }
  showStep("step1");
}

function goToStep2() {
  // STEP1バリデーション
  var name = document.getElementById("inName").value.trim();
  var furigana = document.getElementById("inFurigana").value.trim();
  if (!name) { alert("お名前を入力してください"); return; }
  if (!furigana) { alert("フリガナを入力してください"); return; }
  // カタカナチェック
  if (!/^[ァ-ヶー\\s　]+$/.test(furigana)) { alert("フリガナはカタカナで入力してください"); return; }

  var count = parseInt(document.getElementById("inFamilyCount").value) || 0;
  if (count === 0) { goToStep3(); return; }
  buildFamilyForms(count);
  showStep("step2");
}

function goToStep3() { showStep("step3"); }

// ==================== 郵便番号→住所 ====================
var zipTimer = null;
function onZipInput() {
  clearTimeout(zipTimer);
  var zip = document.getElementById("inZip").value.replace(/[-\\s]/g, "");
  if (zip.length === 7) {
    zipTimer = setTimeout(function() {
      google.script.run.withSuccessHandler(function(result) {
        if (result && !result.error) {
          document.getElementById("inPref").value = result.prefecture;
          document.getElementById("inAddress").value = result.address;
        }
      }).lookupAddress(zip);
    }, 300);
  }
}

// ==================== 家族フォーム動的生成 ====================
function onFamilyCountChange() {}

function buildFamilyForms(count) {
  var container = document.getElementById("familyForms");
  container.innerHTML = "";
  var labels = ["①","②","③","④"];
  for (var i = 0; i < count; i++) {
    var div = document.createElement("div");
    div.className = "family-block fade-in";
    div.style.animationDelay = (i * 0.1) + "s";
    div.innerHTML = '<h4>ご家族' + labels[i] + '</h4>' +
      '<div class="input-row"><div class="fg"><label>氏名</label><input type="text" id="fam' + (i+1) + 'Name" placeholder="山田 花子"></div></div>' +
      '<div class="input-row"><div class="fg"><label>フリガナ（カタカナ）</label><input type="text" id="fam' + (i+1) + 'Furigana" placeholder="ヤマダ ハナコ"></div>' +
      '<div class="fg" style="flex:0 0 100px"><label>年齢</label><input type="number" id="fam' + (i+1) + 'Age" min="0" max="120"></div></div>';
    container.appendChild(div);
  }
}

// ==================== 送信 ====================
function submitForm() {
  var btn = document.getElementById("submitBtn");
  btn.disabled = true;
  btn.textContent = "送信中...";
  btn.classList.add("processing");

  var familyCount = parseInt(document.getElementById("inFamilyCount").value) || 0;
  var formData = {
    // STEP0
    studioName: document.getElementById("studioSelect").value,
    staffName: selectedStaff,
    visitDate: document.getElementById("visitDate").value,
    isExisting: isExistingCustomer,
    andpadCustomerId: selectedCustomer ? selectedCustomer.customerId : "",
    andpadSystemId: selectedCustomer ? selectedCustomer.systemId : "",
    // STEP1
    name: document.getElementById("inName").value.trim(),
    furigana: document.getElementById("inFurigana").value.trim(),
    age: document.getElementById("inAge").value,
    familyCount: familyCount,
    zipcode: document.getElementById("inZip").value.trim(),
    prefecture: document.getElementById("inPref").value,
    address: document.getElementById("inAddress").value.trim(),
    phone: document.getElementById("inPhone").value.trim(),
    email: document.getElementById("inEmail").value.trim(),
    // STEP3
    occupation: document.getElementById("inOccupation").value,
    inquiry: singleChoiceValues["inquiry"] || "",
    visitReason: singleChoiceValues["reason"] || "",
    referrerName: document.getElementById("inReferrer").value.trim(),
    sns: getMultiValues("snsChoices"),
    tvAd: getMultiValues("tvChoices"),
    magazineWeb: getMultiValues("magChoices"),
    flyer: getMultiValues("flyerChoices"),
    otherMedia: getMultiValues("otherMediaChoices"),
    hasCompetitor: singleChoiceValues["competitor"] || "",
    competitorNames: document.getElementById("inCompetitorNames").value.trim(),
    visitCount: document.getElementById("inVisitCount").value,
    currentHousing: document.getElementById("inCurrentHousing").value,
    currentRent: document.getElementById("inRent").value,
    plan: document.getElementById("inPlan").value,
    moveTiming: document.getElementById("inMoveTiming").value,
    concerns: getMultiValues("concernChoices"),
    dmPermission: singleChoiceValues["dm"] || ""
  };

  // 家族情報
  for (var i = 1; i <= familyCount; i++) {
    var nameEl = document.getElementById("fam" + i + "Name");
    var furiEl = document.getElementById("fam" + i + "Furigana");
    var ageEl = document.getElementById("fam" + i + "Age");
    if (nameEl) {
      formData["family" + i] = {
        name: nameEl.value.trim(),
        furigana: furiEl ? furiEl.value.trim() : "",
        age: ageEl ? ageEl.value : ""
      };
    }
  }

  google.script.run
    .withSuccessHandler(function() {
      showStep("stepComplete");
      var sec = 30;
      var msgEl = document.getElementById("autoResetMsg");
      var timer = setInterval(function() {
        sec--;
        msgEl.textContent = sec + "秒後に最初の画面に戻ります";
        if (sec <= 0) {
          clearInterval(timer);
          resetAll();
        }
      }, 1000);
    })
    .withFailureHandler(function(err) {
      alert("エラーが発生しました: " + err.message);
      btn.disabled = false;
      btn.textContent = "送信する";
      btn.classList.remove("processing");
    })
    .writeAnketeData(formData);
}

function resetAll() {
  // フォームリセット
  document.getElementById("studioSelect").value = "";
  selectedStaff = "";
  isExistingCustomer = false;
  selectedCustomer = null;
  singleChoiceValues = {};
  document.getElementById("staffGroup").classList.add("hidden");
  document.getElementById("staffList").innerHTML = "";
  document.getElementById("visitDate").value = new Date().toISOString().split("T")[0];
  document.getElementById("btnNew").classList.remove("selected");
  document.getElementById("btnExisting").classList.remove("selected");
  document.getElementById("searchGroup").classList.add("hidden");
  document.getElementById("searchResult").innerHTML = "";
  document.getElementById("startBtn").disabled = true;
  // STEP1リセット
  ["inName","inFurigana","inAge","inZip","inPref","inAddress","inPhone","inEmail"].forEach(function(id){document.getElementById(id).value=""});
  document.getElementById("inFamilyCount").value = "0";
  // STEP3リセット
  document.querySelectorAll(".choice-btn.selected,.check-btn.selected").forEach(function(b){b.classList.remove("selected")});
  ["inOccupation","inVisitCount","inCurrentHousing","inPlan","inMoveTiming"].forEach(function(id){document.getElementById(id).value=""});
  ["inReferrer","inCompetitorNames","inRent"].forEach(function(id){document.getElementById(id).value=""});
  ["referrerGroup","snsGroup","tvGroup","magGroup","flyerGroup","otherMediaGroup","competitorNameGroup"].forEach(function(id){document.getElementById(id).classList.add("hidden")});
  document.getElementById("submitBtn").disabled = false;
  document.getElementById("submitBtn").textContent = "送信する";
  document.getElementById("submitBtn").classList.remove("processing");
  showStep("step0");
}
</script>
</body>
</html>`;
}
