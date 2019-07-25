// ****************************
// ***** 勤務実績報告関連 *****
// ****************************

// 残業カウント単位分
const OvertimeUnitMin = 15;

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

// ダミー計算ボタン生成
$(document).on('mouseenter', 'input[type="button"][value="計算(K)"]', function() {
  if(!isWorkRecordPage()) return;

  if ($('input[name="' + dummyButtonNameCalc +'"]').length == 0) {
    createDummyButton($(this), 'input[type="button"][value="計算(K)"]', dummyButtonNameCalc);
  }
});

// ダミー計算ボタンクリック
$(document).on('click', 'input[name="' + dummyButtonNameCalc + '"]', function() {
  
  var transferClassList = [];

  $('input[type="hidden"][name="Start_Fixed_Time"]').each(function(i, elem) {
    var startFixedTimeStr = $(elem).val(); // 定時開始時刻
    var row = $(elem).closest('tr');
    var recordStartTimeStr = row.find('input[type="hidden"][name="Record_Time_1"]').val(); // 出勤打刻時間
    var transferClass = row.find('select[name="Transfer_CL"]').val();
    transferClassList.push(transferClass);

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
    }
  });

  // 定時終了時刻がある行を取得
  $('input[type="hidden"][name="End_Fixed_Time"]').each(function(i, elem){
    var endFixedTimeStr = $(elem).val(); // 定時終了時刻
    var row = $(elem).closest('tr');
    var recordEndTimeStr = row.find('input[type="hidden"][name="Record_Time_2"]').val(); // 退勤打刻時間
    var transferClass = transferClassList[i];

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

      // 15分休憩を含んで退勤打刻が定時より一定時間後なら残業計算
      if((recordEndTimeHour * 60 + recordEndTimeMin) - (endFixedTimeHour * 60 + endFixedTimeMin) >= (15 + OvertimeUnitMin)) {
        var startOvertimeStr = row.find('input[type="text"][name="Starting_Of_The_Overtime_Work"]').val();
        if(!startOvertimeStr) {// すでに入力されている場合は上書きしない
          var startOvertimeHour = endFixedTimeHour;
          var startOvertimeMin = endFixedTimeMin + 15;
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
  });

  setTimeout(() => {
    // もとのボタンをクリック
    $($('input[name="' + dummyButtonNameCalc + '"]').attr("original_selector")).click();
  });
});

// チェックボックス切替時のチェック
$(document).on('change', 'input[type="checkbox"][name="Decide_chk"]', function() {
  if(!isWorkRecordPage()) return;

  var row1 = $(this).closest('tr');
  var row2 = $(this).closest('tr').next('tr');
  var row3 = $(this).closest('tr').next('tr').next('tr');

  var isChecked = $(this).prop("checked");
  var businessTripCL = row3.find('select[name="Business_Trip_CL"]').val();
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

  if (isChecked && (!recordTime_1 || !recordTime_2) && businessTripCL == "0") {
    tooltipDiv.addClass('alert_tooltip');
  } else {
    tooltipDiv.removeClass('alert_tooltip');
  }
});

// 出張外出区分切替時のチェック
$(document).on('change', 'select[name="Business_Trip_CL"]', function() {
  if(!isWorkRecordPage()) return;

  var row1 = $(this).closest('tr').prev('tr').prev('tr');
  var row2 = $(this).closest('tr').prev('tr');
  var row3 = $(this).closest('tr');

  var isChecked = row1.find('input[type="checkbox"][name="Decide_chk"]').prop("checked");
  var businessTripCL = $(this).val();
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

  if (isChecked && (!recordTime_1 || !recordTime_2) && businessTripCL == "0") {
    tooltipDiv.addClass('alert_tooltip');
  } else {
    tooltipDiv.removeClass('alert_tooltip');
  }
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

// ****** 残業時間計算 ******
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
});

$(document).on('change', 'input[type="text"][name="Ed_Interval_Night_Fixed_Holiday"]', function() {
  var row = $(this).closest('tr');
  calcOvertimeWork(row);
});


// 残業時間の計算
function calcOvertimeWork(row) {
  var startTimeStr = row.find('input[type="text"][name="Starting_Of_The_Overtime_Work"]').val();
  var endTimeStr = row.find('input[type="text"][name="Ending_Of_The_Overtime_Work"]').val();
  
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
    
    var overtimeMin = 0;
    var overtimeMidnightMin = 0;
    
    while(true) {
      if (clockHour > endHour || (clockHour == endHour && clockMin >= endMin)) break;
      
      clockMin += OvertimeUnitMin;
      if(clockMin === 60) {
        clockHour++;
        clockMin = 0;
      }
      
      if ((clockHour == 22 && clockMin > 0) || (clockHour > 22 && clockHour < 29) || (clockHour == 29 && clockMin == 0)) { // 22:00～29:00(5:00)は深夜残業
        overtimeMidnightMin += OvertimeUnitMin;
      } else {
        overtimeMin += OvertimeUnitMin;
      }
      
    }
    
    
    var intervalStr = row.find('input[type="text"][name="Ed_Interval_Usually_Fixed_Holiday"]').val();
    var intervalMidnightStr = row.find('input[type="text"][name="Ed_Interval_Night_Fixed_Holiday"]').val();
    
    // 休憩が入力されている場合
    if (intervalStr) {
      var interval = intervalStr.split(/:/g);
      
      var intervalHour = parseInt(interval[0]);
      var intervalMin = parseInt(interval[1]);
      
      overtimeMin = overtimeMin - (intervalHour * 60 + intervalMin);
    } else {
      row.find('input[type="text"][name="Ed_Interval_Usually_Fixed_Holiday"]').val("00:00")
    }
    
    if (intervalMidnightStr) {
      var intervalMidnght = intervalMidnightStr.split(/:/g);
      
      var intervalMidnghtHour = parseInt(intervalMidnght[0]);
      var intervalMidnghtMin = parseInt(intervalMidnght[1]);
      
      overtimeMidnightMin = overtimeMidnightMin - (intervalMidnghtHour * 60 + intervalMidnghtMin);
    } else {
      row.find('input[type="text"][name="Ed_Interval_Night_Fixed_Holiday"]').val("00:00")
    }
    
    var overtimeHour = Math.floor(overtimeMin / 60);
    overtimeMin = overtimeMin % 60;
    var overtimeMidnightHour = Math.floor(overtimeMidnightMin / 60);
    overtimeMidnightMin = overtimeMidnightMin % 60;
    
    row.find('input[type="text"][name="Ed_Overtime_Usually_Fixed_Holiday"]').val(overtimeHour + ":" + ("0" + overtimeMin).slice(-2));
    row.find('input[type="text"][name="Ed_Overtime_Night_Fixed_Holiday"]').val(overtimeMidnightHour + ":" + ("0" + overtimeMidnightMin).slice(-2));
  }
}
