// ****************************
// ***** 勤務実績報告関連 *****
// ****************************

// 残業カウント単位分
const OvertimeUnitMin = 15;
 // 固定の休憩時間 (かつては定時前後は15分休憩必須となっていたがなくなった)
const FixedRestMinutes = 0;

const dummyButtonNameCalc = "the_amoeba_support_dummy_button_calc";

// 勤務実績報告ページ判定
function isWorkRecordPage() {
  if($('#MenuIDData').length > 0) {
    var menuId = $('#MenuIDData').val();
    return menuId == "PKTO318-1";
  } else {
    return false;
  }
}

// Enter押下で検索
$(document).on('keydown', function(e) {
  if(!isWorkRecordPage()) return;
  if (e.keyCode == 13) {
    if (TheAmoebaSupportSetting.isChoiceEnterSearch) {
      // チェックボタンがチェックされていない場合のみ、
      var checkedList = $('input[type="checkbox"][name="Decide_chk"]:checked');
      if (checkedList.length == 0) {
        $('input[type="button"][accesskey="Z"][value="検索(Z)"]').click();
      }
    }
  }
});

// ダミー計算ボタン生成
$(document).on('mouseenter', 'input[type="button"][value="計算(K)"][title="計算"]', function() {
  if(!isWorkRecordPage()) return;

  if ($('input[name="' + dummyButtonNameCalc +'"]').length == 0) {
    createDummyButton($(this), 'input[type="button"][value="計算(K)"][title="計算"]', dummyButtonNameCalc);
  }
});

// ダミー計算ボタンクリック
$(document).on('click', 'input[name="' + dummyButtonNameCalc + '"]', function() {

  // 定時開始時刻の要素がある行(中段)を取得
  $('input[type="hidden"][name="Start_Fixed_Time"]').each(function(i, elem) {
    var row = $(elem).closest('tr');
    calcMiddleRow(row);
  });

  // 定時終了時刻の要素がある行(下段)を取得
  $('input[type="hidden"][name="End_Fixed_Time"]').each(function(i, elem){
    var row = $(elem).closest('tr');
    calcBottomRow(row);
  });

  setTimeout(() => {
    // もとのボタンをクリック
    $($('input[name="' + dummyButtonNameCalc + '"]').attr("original_selector")).click();
  });
});

// ダミー計算ボタン(個別行)生成
$(document).on('mouseenter', 'input[type="button"][value="計算"][title="計算"]', function() {
  if(!isWorkRecordPage()) return;

  var dummyName = dummyButtonNameCalc + "_r"

  if ($(this).closest('tr').find('input[name="' + dummyName +'"]').length == 0) {
    createDummyButton($(this), 'input[type="button"][value="計算"][title="計算"]', dummyName);
  }
});

// ダミー計算ボタン(個別行)クリック
$(document).on('click', 'input[name="' + dummyButtonNameCalc + '_r"]', function() {
  var row1 = $(this).closest('tr');

  // 定時開始時刻の要素がある行(中段)を取得
  var row2 = $(this).closest('tr').next('tr');
  calcMiddleRow(row2);

  // 定時終了時刻の要素がある行(下段)を取得
  var row3 = $(this).closest('tr').next('tr').next('tr');
  calcBottomRow(row3);

  setTimeout(() => {
    // もとのボタンをクリック
    row1.find($(this).attr("original_selector")).click();
  });
});

function checkBuisinessTripCL(row1, row2, row3) {
  var isChecked = row1.find('input[type="checkbox"][name="Decide_chk"]').prop("checked");
  var businessTripCL = row3.find('select[name="Business_Trip_CL"]').val();
  var absenceCL = row3.find('select[name="Absence_CL"]').val();
  var recordTime_1 = row2.find('input[name="Record_Time_1"]').val();
  var recordTime_2 = row3.find('input[name="Record_Time_2"]').val();

  var tooltipDivs = row3.find('div[name="Business_Trip_CL_tooltip"]');
  var tooltipDiv = null;
  if (tooltipDivs.length == 0) {
    tooltipDiv = $('<div name="Business_Trip_CL_tooltip" style="height:0px;" data-tooltip="打刻がない場合は出張・外出区分を指定してください"></div>')
    row3.find('select[name="Business_Trip_CL"]').before(tooltipDiv)
  } else {
    tooltipDiv = $(tooltipDivs[0]);
  }

  if (isChecked && (!recordTime_1 || !recordTime_2) && absenceCL != "21" && businessTripCL == "0") {
    tooltipDiv.addClass('alert_tooltip');
  } else {
    tooltipDiv.removeClass('alert_tooltip');
  }
}

// 休憩時間のチェック
function checkIntervalReason(row1, row2, row3) {
  var isChecked = row1.find('input[type="checkbox"][name="Decide_chk"]').prop("checked");
  var comment = row1.find('input[type="text"][name="Ed_Comment"]').val();

  var intervalUsuallyEarly = row2.find('input[type="text"][name="Ed_Interval_Usually_Early"]').val();
  var intervalNightEarly = row2.find('input[type="text"][name="Ed_Interval_Night_Early"]').val();
  var intervalUsuallyFixedHoliday = row3.find('input[type="text"][name="Ed_Interval_Usually_Fixed_Holiday"]').val();
  var intervalNightFixedHoliday = row3.find('input[type="text"][name="Ed_Interval_Night_Fixed_Holiday"]').val();
  
  var intervalTotal = 0;

  function addInterval(timeText) {
    if (timeText) {
      var interval = timeText.split(/:/g);
      
      intervalTotal += (parseInt(interval[0]) * 60);
      intervalTotal += parseInt(interval[1]);
    }
  }

  addInterval(intervalUsuallyEarly);
  addInterval(intervalNightEarly);
  addInterval(intervalUsuallyFixedHoliday);
  addInterval(intervalNightFixedHoliday);

  var tooltipDivs = row1.find('div[name="Ed_Comment_tooltip"]');
  var tooltipDiv = null;
  if (tooltipDivs.length == 0) {
    tooltipDiv = $('<div name="Ed_Comment_tooltip" style="height:0px;" data-tooltip="休憩理由を入力してください (HH:MM ～ HH:MM 休憩理由)"></div>')
    row1.find('input[name="Ed_Comment"]').before(tooltipDiv)
  } else {
    tooltipDiv = $(tooltipDivs[0]);
  }

  // 休憩時間がある場合はアラート
  if (isChecked && intervalTotal > 0 && !comment) {
    tooltipDiv.addClass('alert_tooltip');
  } else {
    tooltipDiv.removeClass('alert_tooltip');
  }
}

// チェックボックス切替時のチェック
$(document).on('change', 'input[type="checkbox"][name="Decide_chk"]', function() {
  if(!isWorkRecordPage()) return;

  var row1 = $(this).closest('tr');
  var row2 = $(this).closest('tr').next('tr');
  var row3 = $(this).closest('tr').next('tr').next('tr');

  checkBuisinessTripCL(row1, row2, row3);
  checkIntervalReason(row1, row2, row3);
});

// コメント変更時のチェック
$(document).on('change', 'input[type="text"][name="Ed_Comment"]', function() {
  if(!isWorkRecordPage()) return;

  var row1 = $(this).closest('tr');
  var row2 = $(this).closest('tr').next('tr');
  var row3 = $(this).closest('tr').next('tr').next('tr');

  checkIntervalReason(row1, row2, row3);
});

// 欠勤区分切替時のチェック
$(document).on('change', 'select[name="Absence_CL"]', function() {
  if(!isWorkRecordPage()) return;

  var row1 = $(this).closest('tr').prev('tr').prev('tr');
  var row2 = $(this).closest('tr').prev('tr');
  var row3 = $(this).closest('tr');

  checkBuisinessTripCL(row1, row2, row3);
});

// 出張外出区分切替時のチェック
$(document).on('change', 'select[name="Business_Trip_CL"]', function() {
  if(!isWorkRecordPage()) return;

  var row1 = $(this).closest('tr').prev('tr').prev('tr');
  var row2 = $(this).closest('tr').prev('tr');
  var row3 = $(this).closest('tr');

  if($(this).val().match(/^3\d$/)) {
    // 在宅,直行直帰など(30番台)の場合は開始日時と終了日時に定時の時刻を自動入力する
    if(!row2.find('input[name="Starting_Of_The_Business_Time"]').val()){
      row2.find('input[name="Starting_Of_The_Business_Time"]').val(row2.find('input[name="Start_Fixed_Time"]').val());
    }
    if(!row3.find('input[name="Ending_Of_The_Business_Time"]').val()){
      row3.find('input[name="Ending_Of_The_Business_Time"]').val(row3.find('input[name="End_Fixed_Time"]').val());
    }
  }

  checkBuisinessTripCL(row1, row2, row3);
});

// 振徹休区分
$(document).on('mousedown', 'select[name="Transfer_CL"]', function() {
  if(!isWorkRecordPage()) return;

  $(this).css('width', "42px"); // 幅を固定
  
  $(this).children('option').each(function(i, elem){
    var code = $(elem).val();
    $(elem).text(code + ":" + getTransferLabel(code));
  });
});

// 遅刻早退外出区分
$(document).on('mousedown', 'select[name="Late_Leave_Out_CL"]', function() {
  if(!isWorkRecordPage()) return;

  $(this).css('width', "52px"); // 幅を固定
  
  $(this).children('option').each(function(i, elem){
    var code = $(elem).val();
    $(elem).text(code + ":" + getLateLeaveOutLabel(code));
  });
});

// 欠勤区分
$(document).on('mousedown', 'select[name="Absence_CL"]', function() {
  if(!isWorkRecordPage()) return;

  $(this).css('width', "46px"); // 幅を固定
  
  $(this).children('option').each(function(i, elem){
    var code = $(elem).val();
    $(elem).text(code + ":" + getAbsenceLabel(code));
  });
});

// 出張・外出区分
$(document).on('mousedown', 'select[name="Business_Trip_CL"]', function() {
  if(!isWorkRecordPage()) return;

  $(this).css('width', "46px"); // 幅を固定
  
  $(this).children('option').each(function(i, elem){
    var code = $(elem).val();
    $(elem).text(code + ":" + getBusinessTripLabel(code));
  });
});

function getTransferLabel(code) {
  const codeMap = {
    "0": "平日",
    "1": "振出",
    "2": "振休",
    "3": "休出",
    "4": "振替休出",
    "5": "徹残休",
    "6": "振出徹残休",
    "7": "徹残休休出",
    "8": "出徹残休休出",
    "9": "休日",
    "A": "",
    "B": "",
  };
  
  return codeMap[code];
}

function getLateLeaveOutLabel(code) {
  const codeMap = {
   "000": "通常",
   "100": "遅刻",
   "010": "早退",
   "001": "外出",
   "200": "遅刻(仮)",
   "020": "早退(仮)",
   "002": "外出(仮)",
   "110": "遅刻&早退",
   "101": "遅刻&外出",
   "011": "早退&外出",
   "120": "遅刻&早退(仮)",
   "102": "遅刻&外出(仮)",
   "012": "早退&外出(仮)",
   "210": "遅刻(仮)&早退",
   "201": "遅刻(仮)&外出",
   "021": "早退(仮)&外出",
   "220": "遅刻(仮)&早退(仮)",
   "202": "遅刻(仮)&外出(仮)",
   "022": "早退(仮)&外出(仮)",
   "111": "遅刻&早退&外出",
   "211": "遅刻(仮)&早退&外出",
   "121": "遅刻&早退(仮)&外出",
   "112": "遅刻&早退&外出(仮)",
   "221": "遅刻(仮)&早退(仮)&外出",
   "212": "遅刻(仮)&早退&外出(仮)",
   "122": "遅刻&早退(仮)&外出(仮)",
   "222": "遅刻(仮)&早退(仮)&外出(仮)",
  };
  
  return codeMap[code];
}

function getAbsenceLabel(code) {
  const codeMap = {
    "0": "通常",
    "21": "欠勤",
    "31": "時間休",
    "71": "前半休",
    "76": "後半休",
    "20": "仮欠勤",
    "30": "仮時間休",
    "70": "仮前半休",
    "75": "仮後半休",
  };
  
  return codeMap[code];
}

function getBusinessTripLabel(code) {
  const codeMap = {
    "0": "通常",
    "31": "直行",
    "32": "直帰",
    "33": "直行・直帰",
    "34": "事業所出張",
    "35": "客先・業者出張",
    "36": "海外出張",
    "37": "在宅",
  };
  
  return codeMap[code];
}

// ****** 時間コントロール加減 ******
$(document).on('keydown', 'input[type="text"]', function(e) {
  if(!isWorkRecordPage()) return;

  if (e.keyCode != 38 && e.keyCode != 40) return;

  var timeText = $(this).val();
  if(!timeText) return;

  var pattern = /^-?\d{1,2}:\d{2}$/g;
  
  if (timeText.match(pattern)){
    // マイナス値の計算方法が異なるため、時刻なのか時間間隔なのか判別
    var thisName = $(this).attr('name');
    var timeType = "term"; 
    if (thisName == "Starting_Of_The_Business_Time" ||
      thisName == "Starting_Of_The_Overtime_Early" ||
      thisName == "Ending_Of_The_Overtime_Early" ||
      thisName == "Ending_Of_The_Business_Time" ||
      thisName == "Starting_Of_The_Overtime_Work" ||
      thisName == "Ending_Of_The_Overtime_Work") {
      timeType = "clock";
    }

    var t = timeText.split(/:/g);
      
    var tHour = parseInt(t[0]);
    var tMinute = parseInt(t[1]);

    tMinute = Math.floor(tMinute / OvertimeUnitMin) * OvertimeUnitMin; // 端数処理

    if (timeType != "clock") {
      // 時間間隔の場合
      var tTotalMinute = tHour * 60;
      if (timeText[0] == "-") {
        tTotalMinute -= tMinute;
      } else {
        tTotalMinute += tMinute;
      }

      switch (e.keyCode) {
        case 38:
          tTotalMinute += OvertimeUnitMin;
          break;
        case 40:
          tTotalMinute -= OvertimeUnitMin;
          break;
        default:
          break;
      }

      if (tTotalMinute < 0) {
        tTotalMinute = tTotalMinute * -1;
        
        tHour = Math.floor(tTotalMinute / 60);
        tMinute = tTotalMinute % 60;

        $(this).val("-" + tHour + ":" + ("0" + tMinute).slice(-2));
      } else {
        tHour = Math.floor(tTotalMinute / 60);
        tMinute = tTotalMinute % 60;
        $(this).val(tHour + ":" + ("0" + tMinute).slice(-2));
      }
    } else {
      // 時刻の場合
      switch (e.keyCode) {
        case 38:
          tMinute += OvertimeUnitMin;
          break;
        case 40:
          tMinute -= OvertimeUnitMin;
          break;
        default:
          break;
      }

      if (tMinute >= 60) {
        tHour += Math.floor(tMinute / 60);
        tMinute = tMinute % 60;
      } else if (tMinute < 0) {
        tHour += Math.floor(tMinute / 60);
        tMinute = 60 + (tMinute % 60);
      }
      
      $(this).val(tHour + ":" + ("0" + tMinute).slice(-2));
    }

    $(this).change();
  }
});

// ****** 残業時間計算 ******
$(document).on('change', 'input[type="text"][name="Starting_Of_The_Overtime_Early"]', function() {
  var row = $(this).closest('tr');
  calcEarlyOvertimeWork(row);
});

$(document).on('change', 'input[type="text"][name="Ending_Of_The_Overtime_Early"]', function() {
  var row = $(this).closest('tr');
  calcEarlyOvertimeWork(row);
});

$(document).on('change', 'input[type="text"][name="Ed_Interval_Usually_Early"]', function() {
  var row = $(this).closest('tr');
  calcEarlyOvertimeWork(row);

  var row1 = $(this).closest('tr').prev('tr');
  var row3 = $(this).closest('tr').next('tr');

  checkIntervalReason(row1, row, row3);
});

$(document).on('change', 'input[type="text"][name="Ed_Interval_Night_Early"]', function() {
  var row = $(this).closest('tr');
  calcEarlyOvertimeWork(row);
  
  var row1 = $(this).closest('tr').prev('tr');
  var row3 = $(this).closest('tr').next('tr');

  checkIntervalReason(row1, row, row3);
});

$(document).on('change', 'input[type="text"][name="Starting_Of_The_Overtime_Work"]', function() {
  var row = $(this).closest('tr');
  calcOvertimeWork(row);
});

$(document).on('change', 'input[type="text"][name="Ending_Of_The_Overtime_Work"]', function() {
  var row = $(this).closest('tr');
  calcOvertimeWork(row);
});

$(document).on('change', 'input[type="text"][name="Ed_Interval_Usually_Fixed_Holiday"]', function() {
  var row = $(this).closest('tr');
  calcOvertimeWork(row);
  
  var row1 = $(this).closest('tr').prev('tr').prev('tr');
  var row2 = $(this).closest('tr').prev('tr');

  checkIntervalReason(row1, row2, row);
});

$(document).on('change', 'input[type="text"][name="Ed_Interval_Night_Fixed_Holiday"]', function() {
  var row = $(this).closest('tr');
  calcOvertimeWork(row);
  
  var row1 = $(this).closest('tr').prev('tr').prev('tr');
  var row2 = $(this).closest('tr').prev('tr');

  checkIntervalReason(row1, row2, row);
});


// 残業時間の計算
function calcOvertimeWorkCommon(row, 
  elementNameOvertimeStart, 
  elementNameOvertimeEnd, 
  elementNameIntervalTime, 
  elementNameIntervalTimeMidnight, 
  elementNameOverTime, 
  elementNameOverTimeMidnight, 
  elementNameTimeTotal) {

  var startTimeStr = row.find('input[type="text"][name="' + elementNameOvertimeStart + '"]').val();
  var endTimeStr = row.find('input[type="text"][name="' + elementNameOvertimeEnd + '"]').val();
  
  if (startTimeStr && endTimeStr) {
    var start = startTimeStr.split(/:/g);
    var end =  endTimeStr.split(/:/g);
    
    var startHour = parseInt(start[0]);
    var startMin = parseInt(start[1]);

    var endHour = parseInt(end[0]);
    var endMin = parseInt(end[1]);

    if (startMin % 15 != 0 || endMin % 15 != 0) {
      return;
    }
    
    var clockHour = startHour;
    var clockMin = startMin;

    // 合計時間を計算
    var overtimeMin = 0;
    var overtimeMidnightMin = 0;
    
    while(true) {
      if (clockHour > endHour || (clockHour == endHour && clockMin >= endMin)) break;
      
      clockMin += OvertimeUnitMin;
      if(clockMin === 60) {
        clockHour++;
        clockMin = 0;
      }
      
      if ((clockHour == -2 && clockMin > 0) || (clockHour > -2 && clockHour < 5) || (clockHour == 5 && clockMin == 0) || // -2:00～5:00は深夜残業
        (clockHour == 22 && clockMin > 0) || (clockHour > 22 && clockHour < 29) || (clockHour == 29 && clockMin == 0)) { // 22:00～29:00(5:00)は深夜残業
        overtimeMidnightMin += OvertimeUnitMin;
      } else {
        overtimeMin += OvertimeUnitMin;
      }
    }
    
    // 合計時間の表示
    var totalTimeHour = Math.floor(overtimeMin / 60);
    var totalTimeMin = overtimeMin % 60;
    
    var totalTimeValue = totalTimeHour + ":" + ("0" + totalTimeMin).slice(-2);

    row.find('input[name="' + elementNameTimeTotal + '"]').val(totalTimeValue);
    row.find('span[id="' + elementNameTimeTotal + '_lbl"]').text(totalTimeValue);
    
    // 休憩が入力されている場合
    var intervalStr = row.find('input[type="text"][name="' + elementNameIntervalTime + '"]').val();
    var intervalMidnightStr = row.find('input[type="text"][name="' + elementNameIntervalTimeMidnight + '"]').val();
    
    if (intervalStr) {
      var interval = intervalStr.split(/:/g);
      
      var intervalHour = parseInt(interval[0]);
      var intervalMin = parseInt(interval[1]);
      
      overtimeMin = overtimeMin - (intervalHour * 60 + intervalMin);
    } else {
      row.find('input[type="text"][name="' + elementNameIntervalTime + '"]').val("00:00")
    }
    
    if (intervalMidnightStr) {
      var intervalMidnght = intervalMidnightStr.split(/:/g);
      
      var intervalMidnghtHour = parseInt(intervalMidnght[0]);
      var intervalMidnghtMin = parseInt(intervalMidnght[1]);
      
      overtimeMidnightMin = overtimeMidnightMin - (intervalMidnghtHour * 60 + intervalMidnghtMin);
    } else {
      row.find('input[type="text"][name="' + elementNameIntervalTimeMidnight + '"]').val("00:00")
    }
    
    var overtimeHour = Math.floor(overtimeMin / 60);
    overtimeMin = overtimeMin % 60;
    var overtimeMidnightHour = Math.floor(overtimeMidnightMin / 60);
    overtimeMidnightMin = overtimeMidnightMin % 60;
    
    var overtimeValue = overtimeHour + ":" + ("0" + overtimeMin).slice(-2);
    var overtimeMidnightValue = overtimeMidnightHour + ":" + ("0" + overtimeMidnightMin).slice(-2);

    row.find('input[name="' + elementNameOverTime + '"]').val(overtimeValue);
    row.find('span[id="' + elementNameOverTime + '_lbl"]').text(overtimeValue);
    row.find('input[name="' + elementNameOverTimeMidnight + '"]').val(overtimeMidnightValue);
    row.find('span[id="' + elementNameOverTimeMidnight + '_lbl"]').text(overtimeMidnightValue);
  }
}

// 早出残業時間の計算
function calcEarlyOvertimeWork(row) {
  calcOvertimeWorkCommon(row, 
    "Starting_Of_The_Overtime_Early",
    "Ending_Of_The_Overtime_Early",
    "Ed_Interval_Usually_Early",
    "Ed_Interval_Night_Early",
    "Ed_Overtime_Usually_Early",
    "Ed_Overtime_Night_Early",
    "Ed_TimeTotal_Early");
}

// 残業時間の計算
function calcOvertimeWork(row) {
  calcOvertimeWorkCommon(row, 
    "Starting_Of_The_Overtime_Work",
    "Ending_Of_The_Overtime_Work",
    "Ed_Interval_Usually_Fixed_Holiday",
    "Ed_Interval_Night_Fixed_Holiday",
    "Ed_Overtime_Usually_Fixed_Holiday",
    "Ed_Overtime_Night_Fixed_Holiday",
    "Ed_TimeTotal_Fixed_Holiday");
}

// 中段の計算全部
function calcMiddleRow(row) {
  var startFixedTimeStr = row.find('input[type="hidden"][name="Start_Fixed_Time"]').val(); // 定時開始時刻
  var recordStartTimeStr = row.find('input[type="hidden"][name="Record_Time_1"]').val(); // 出勤打刻時間
  var transferClass = row.find('select[name="Transfer_CL"]').val();

  // 打刻がある
  if(recordStartTimeStr) {
    
    var startFixedTimeHour = parseInt(startFixedTimeStr.split(/:/g)[0]);
    var startFixedTimeMin = parseInt(startFixedTimeStr.split(/:/g)[1]);
    var recordStartTimeHour = parseInt(recordStartTimeStr.split(/:/g)[0]);
    var recordStartTimeMin = parseInt(recordStartTimeStr.split(/:/g)[1]);

    var startBusinessTime = row.find('input[type="text"][name="Starting_Of_The_Business_Time"]').val();
    if (!startBusinessTime && (transferClass == "0" || transferClass == "1")) { // 入力されていない　通常or振出の場合
      if ((startFixedTimeHour * 60 + startFixedTimeMin) >= (recordStartTimeHour * 60 + recordStartTimeMin)) {
        // 定時開始時刻 ≧ 打刻
        row.find('input[type="text"][name="Starting_Of_The_Business_Time"]').val(startFixedTimeStr);
      } else {
        // 定時開始時刻 < 打刻 (遅刻)
        row.find('input[type="text"][name="Starting_Of_The_Business_Time"]').val(recordStartTimeStr);

        // カット時間
        var fixedTime = (startFixedTimeHour * 60 + startFixedTimeMin);
        var recordTime = (recordStartTimeHour * 60 + Math.floor(recordStartTimeMin / OvertimeUnitMin) * OvertimeUnitMin);
        
        var cutTime = recordTime - fixedTime;
        var cutTimeHour = Math.floor(cutTime / 60);
        var cutTimeMin = cutTime % 60;
        row.find('input[type="text"][name="Cut_Time_Usually"]').val(cutTimeHour + ":" + ("0" + cutTimeMin).slice(-2));
      }
    }

    
    // n分休憩を含んで出勤打刻が定時より一定時間前なら早出残業計算
    if((startFixedTimeHour * 60 + startFixedTimeMin) - (recordStartTimeHour * 60 + recordStartTimeMin) >= (FixedRestMinutes + OvertimeUnitMin)) {
      var startOvertimeStr = row.find('input[type="text"][name="Starting_Of_The_Overtime_Early"]').val();
      if(!startOvertimeStr) {// すでに入力されている場合は上書きしない

        var startOvertimeHour = recordStartTimeHour;
        var startOvertimeMin = Math.ceil(recordStartTimeMin / OvertimeUnitMin) * OvertimeUnitMin;
        if (startOvertimeMin == 60) {
          startOvertimeHour++;
          startOvertimeMin = 0;
        }
        
        row.find('input[type="text"][name="Starting_Of_The_Overtime_Early"]').val(startOvertimeHour + ":" + ("0" + startOvertimeMin).slice(-2)); // 残業開始時刻
      }
      
      var endOvertimeStr = row.find('input[type="text"][name="Ending_Of_The_Overtime_Early"]').val();
      if(!endOvertimeStr) {// すでに入力されている場合は上書きしない
        var endOvertimeHour = startFixedTimeHour;
        var endOvertimeMin = startFixedTimeMin - FixedRestMinutes;
        if (endOvertimeMin < 0) {
          endOvertimeHour--;
          endOvertimeMin = 60 + startOvertimeMin;
        }

        row.find('input[type="text"][name="Ending_Of_The_Overtime_Early"]').val(endOvertimeHour + ":" + ("0" + endOvertimeMin).slice(-2)); // 残業終了時刻
      }

      calcEarlyOvertimeWork(row);
    }
  }
}

// 下段の計算全部
function calcBottomRow(row) {
  var endFixedTimeStr = row.find('input[type="hidden"][name="End_Fixed_Time"]').val(); // 定時終了時刻
  var recordEndTimeStr = row.find('input[type="hidden"][name="Record_Time_2"]').val(); // 退勤打刻時間
  var transferClass = row.prev('tr').find('select[name="Transfer_CL"]').val();

  if(recordEndTimeStr) { // 打刻がある場合のみ

    var endFixedTimeHour = parseInt(endFixedTimeStr.split(/:/g)[0]);
    var endFixedTimeMin = parseInt(endFixedTimeStr.split(/:/g)[1]);
    var recordEndTimeHour = parseInt(recordEndTimeStr.split(/:/g)[0]);
    var recordEndTimeMin = parseInt(recordEndTimeStr.split(/:/g)[1]);

    if ((endFixedTimeHour - 8) > recordEndTimeHour) {
      recordEndTimeHour += 24; // 退勤打刻が定時終了時刻より以上に小さい場合(とりあえず8h)は日付をまたいだと考える
    }

    var endBusinessTime = row.find('input[type="text"][name="Ending_Of_The_Business_Time"]').val();
    if (!endBusinessTime && (transferClass == "0" || transferClass == "1")) { // 入力されていない　通常or振出の場合
      if ((endFixedTimeHour * 60 + endFixedTimeMin) <= (recordEndTimeHour * 60 + recordEndTimeMin)) {
        // 定時終了時刻 ≦ 打刻
        row.find('input[type="text"][name="Ending_Of_The_Business_Time"]').val(endFixedTimeStr);
      } else {
        // 定時開始時刻 > 打刻 (早退)
        var endTimeMin = Math.floor(recordEndTimeMin / OvertimeUnitMin) * OvertimeUnitMin // 早退って切り捨てでいいんだっけ？
        row.find('input[type="text"][name="Ending_Of_The_Business_Time"]').val(recordEndTimeHour + ":" + ("0" + endTimeMin).slice(-2));

        // TODO カット時間
      }
    }

    // n分休憩を含んで退勤打刻が定時より一定時間後なら残業計算
    if((recordEndTimeHour * 60 + recordEndTimeMin) - (endFixedTimeHour * 60 + endFixedTimeMin) >= (FixedRestMinutes + OvertimeUnitMin)) {
      var startOvertimeStr = row.find('input[type="text"][name="Starting_Of_The_Overtime_Work"]').val();
      if(!startOvertimeStr) {// すでに入力されている場合は上書きしない
        var startOvertimeHour = endFixedTimeHour;
        var startOvertimeMin = endFixedTimeMin + FixedRestMinutes;
        if (startOvertimeMin == 60) {
          startOvertimeHour++;
          startOvertimeMin = 0;
        }
        
        row.find('input[type="text"][name="Starting_Of_The_Overtime_Work"]').val(startOvertimeHour + ":" + ("0" + startOvertimeMin).slice(-2)); // 残業開始時刻
      }
      
      var endOvertimeStr = row.find('input[type="text"][name="Ending_Of_The_Overtime_Work"]').val();
      if(!endOvertimeStr) {// すでに入力されている場合は上書きしない
        var endOvertimeMin = Math.floor(recordEndTimeMin / OvertimeUnitMin) * OvertimeUnitMin;
        row.find('input[type="text"][name="Ending_Of_The_Overtime_Work"]').val(recordEndTimeHour + ":" + ("0" + endOvertimeMin).slice(-2)); // 残業終了時刻
      }

      calcOvertimeWork(row);
    }
  }
}