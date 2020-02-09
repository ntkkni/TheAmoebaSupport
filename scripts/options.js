
$(function(){

  $('#choice_performer_history_off').prop('checked', true);
  $('#choice_enter_search_off').prop('checked', true);

  // オプション画面の初期値を設定する
  chrome.storage.local.get("the_amoeba_support_setting", function (value) {
    var d = value.the_amoeba_support_setting;
    if(d) {
      if (d.company_code) {
        $('#company_code').val(d.company_code);
      }

      if (d.choice_performer_history) {
        $('#choice_performer_history_on').prop('checked', true);
      } else {
        $('#choice_performer_history_off').prop('checked', true);
      }

      if (d.choice_enter_search) {
        $('#choice_enter_search_on').prop('checked', true);
      } else {
        $('#choice_enter_search_off').prop('checked', true);
      }

    }
  });
  
});

// セーブボタンが押されたら、
// ストレージに保存する。
$(document).on("click", "#save", function () {
  
  var data = {};

  data.company_code = $('#company_code').val();

  if ($('#choice_performer_history_on').prop('checked')) {
    data.choice_performer_history = true;
  } else {
    data.choice_performer_history = false;
  }

  if ($('#choice_enter_search_on').prop('checked')) {
    data.choice_enter_search = true;
  } else {
    data.choice_enter_search = false;
  }
  
  chrome.storage.local.set({"the_amoeba_support_setting": data} , function(){});
});
