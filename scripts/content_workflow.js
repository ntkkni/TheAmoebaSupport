// ****************************
// ***** ワークフロー関連 *****
// ****************************

var performerList = [];

var PrevPerformerId = "";

// 送信先を履歴から選択するかどうかの設定値
var IsChoicePerformerHistory = false;

const dummyButtonNameExec = "the_amoeba_support_dummy_button_exec";

function loadSetting(setting) {
  if (setting && setting.choice_performer_history) {
    IsChoicePerformerHistory = true;
  } else {
    IsChoicePerformerHistory = false;
  }
}

// 設定のホットリロード
chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (namespace == "local") {
    if (changes.the_amoeba_support_setting) {
      loadSetting(changes.the_amoeba_support_setting.newValue);
    }
  }
});


(function(){

  // 設定のロード
  chrome.storage.local.get("the_amoeba_support_setting", function(value) {
    var d = value.the_amoeba_support_setting;
    loadSetting(d);
  });

  chrome.storage.local.get("the_amoeba_support_performer_history", function (value) {
    var d = value.the_amoeba_support_performer_history;
    setPerformerList(d);
  });
  
  $("body").append(
    $('<div id="performer_select"><div>送信先変更</div></div>')
      .append($('<div class="performer_select_table"></div>'))
      .append($('<div></div>')
        .append($('<input type="button" value="変更せず実行" id="performer_select_accept" class="btn amoeba-btn">'))
        .append($('<input type="button" value="閉じる" id="performer_select_close" class="btn amoeba-btn">'))
      )
  );
})();

function setPerformerList(value) {
  performerList = [];
  
  for (var i in value) {
    performerList.push({ 
      performer_id: value[i].performer_id, 
      performer_name: value[i].performer_name 
    });
  }
}


// ダミーボタン生成判定
function originalButtonHover(originalButton, originalButtonSelector) {
  if (!IsChoicePerformerHistory) { // 設定OFFの場合
    return;
  }

  if ($('input[name="' + dummyButtonNameExec +'"]').length == 0) {
    createDummyButton(originalButton, originalButtonSelector, dummyButtonNameExec);
      
    // 位置を調整
    var t = originalButton.offset().top + 30;
    var l = originalButton.offset().left;
    $('#performer_select').css({top: t + "px", left: l + "px"});
  }
}

// *************************************************************************************
// 本来のボタンのマウスホバー時に、上にダミーボタンを表示してクリック処理をオーバーライドする
// 更新ボタン
$(document).on('mouseenter', 'input#default_button[type="button"]', function() {
  if ($('input[name="PerformerID"]').length == 0) return; // name="PerformerID"のDOMがない場合は対象の画面ではない

  originalButtonHover($(this), 'input#default_button[type="button"]');
});

// 更新ボタン
$(document).on('mouseenter', 'input[type="button"][value="更新(S)"]', function() {
  if ($('input[name="PerformerID"]').length == 0) return; // name="Next_Performer"のDOMがない場合は対象の画面ではない

  originalButtonHover($(this), 'input[type="button"][value="更新(S)"]');
});

// ワークフローの承認ボタン
$(document).on('mouseenter', 'input[type="button"][value="承認(A)"]', function() {
  if ($('input[name="Next_Performer"]').length == 0) return; // name="Next_Performer"のDOMがない場合は対象の画面ではない

  originalButtonHover($(this), 'input[type="button"][value="承認(A)"]');
});
// *************************************************************************************

// 送信先選択を表示
function showPerformerSelect(buttonElem) {
  $('#performer_select .performer_select_table').empty();
  
  for(var i in performerList) {
    $('#performer_select .performer_select_table')
      .append(
        $('<div class="performer_select_row"></div>')
          .append($('<span class="performer_id"></span>').text(performerList[i].performer_id))
          .append($('<span class="performer_name"></span>').text(performerList[i].performer_name))
      );
  }

  $('#performer_select').show();
}

// ダミーボタンクリック
$(document).on('click', 'input[name="' + dummyButtonNameExec + '"]', function() {

  if(performerList.length == 0) {
    $($(this).attr("original_selector") + ":first").click();
    return;
  }
  
  showPerformerSelect($(this));
});


$(document).on({
  'mouseenter':function(){ $(this).addClass("hover"); },
  'mouseleave':function(){ $(this).removeClass("hover"); },
}, 'div.performer_select_row');
  
// 送信先選択 行クリック
$(document).on('click', 'div.performer_select_row', function() {
  
  $('input[name="PerformerID"]').val($(this).find('.performer_id').text());
  $('#PerformerID_lbl').text($(this).find('.performer_id').text());
  $('input[name="PerformerName"]').val($(this).find('.performer_name').text());
  $('#PerformerName_lbl').text($(this).find('.performer_name').text());
  
  $('input[name="Next_Performer"]').val($(this).find('.performer_id').text());
  $('#Next_Performer_lbl').text($(this).find('.performer_id').text());
  $('input[name="Next_PerformerNA"]').val($(this).find('.performer_name').text());
  $('#Next_PerformerNA_lbl').text($(this).find('.performer_name').text());

  $('#performer_select').hide();
  
  setTimeout(() => {
    // もとのボタンをクリック
    $($('input[name="' + dummyButtonNameExec + '"]').attr("original_selector") + ":first").click();
  });
});

// 変更せず実行ボタン
$(document).on('click', '#performer_select_accept', function() {
  $('#performer_select').hide();
  
  setTimeout(() => {
    $($('input[name="' + dummyButtonNameExec + '"]').attr("original_selector") + ":first").click();
  });
});

// 閉じるボタン
$(document).on('click', '#performer_select_close', function() {
  $('#performer_select').hide();
});

// インターバルで要素を監視し、起票(or 承認)画面かどうかをチェック。
// 起票(or 承認)画面である場合、送信先が変更されたら、履歴に追加。
function checkChangePerformer() {
  if ($('input[name="PerformerID"]').length == 0 && 
    $('input[name="Next_Performer"]').length == 0) {

    PrevPerformerId = "";
    $('#performer_select').hide();
    
    return;
  }
  
  // 起票(or 承認)画面である場合
  var performerId = "";
  var performerName = "";

  if ($('input[name="PerformerID"]').length > 0) {
    performerId = $('input[name="PerformerID"]').val();
    performerName = $('input[name="PerformerName"]').val();
  } else if($('input[name="Next_Performer"]').length > 0) {
    performerId = $('input[name="Next_Performer"]').val();
    performerName = $('input[name="Next_PerformerNA"]').val();
  }

  if (!PrevPerformerId || PrevPerformerId == performerId) {
    PrevPerformerId = performerId;
    return;
  }
  
  // すでに同じ要素がある場合は削除して末尾に追加
  while(true) {
    var idx = -1;
    for(var i in performerList) {
      if(performerList[i].performer_id == performerId) {
        idx = i;
        break;
      }
    }
    
    if(idx >= 0){
      performerList.splice(idx, 1);
    } else {
      break;
    }
  }
  
  performerList.push({ 
    performer_id: performerId, 
    performer_name: performerName 
  });
  
  // 最大10件
  if (performerList.length > 10) {
    performerList.shift();
  }
  
  PrevPerformerId = performerId;
  
  chrome.storage.local.set({"the_amoeba_support_performer_history": performerList} , function(){});
}

// 1秒ごと
setInterval(checkChangePerformer, 1000); 
