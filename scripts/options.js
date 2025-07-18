
function appendRow(tableBody) {
  const addTargetTableRow = tableBody.find('tr:first-child');
  const addTableRow = addTargetTableRow.clone(true);
  addTableRow.find("input").val("");
  tableBody.append(addTableRow);
  return addTableRow;
}

$(function () {
  $('#shortcut_menu_list .flex-table table tbody').sortable();

  $('#choice_shortcut_menu').prop('checked', false);
  $('#choice_performer_history').prop('checked', false);
  $('#choice_enter_search').prop('checked', false);

  // オプション画面の初期値を設定する
  chrome.storage.local.get("the_amoeba_support_setting", function (value) {
    var d = value.the_amoeba_support_setting;
    if (d) {
      if (d.company_code) {
        $('#company_code').val(d.company_code);
      }

      if (d.choice_shortcut_menu) {
        $('#choice_shortcut_menu').prop('checked', true);
      }

      if (d.choice_performer_history) {
        $('#choice_performer_history').prop('checked', true);
      }

      if (d.choice_enter_search) {
        $('#choice_enter_search').prop('checked', true);
      }

      if (d.shortcut_menu_list) {
        const tableBody = $("#shortcut_menu_list .flex-table table tbody");

        d.shortcut_menu_list.forEach(function (sm) {
          const row = tableBody.find('tr:last-child')
          row.find('input[name="program-id"]').val(sm.programId);
          row.find('input[name="display-name"]').val(sm.displayName);

          appendRow(tableBody);
        })
      }
    }
  });

});

// セーブボタンが押されたら、
// ストレージに保存する。
$(document).on("click", "#save", function () {

  var data = {};

  data.company_code = $('#company_code').val();

  if ($('#choice_shortcut_menu').is(':checked')) {
    data.choice_shortcut_menu = true;
  } else {
    data.choice_shortcut_menu = false;
  }

  if ($('#choice_performer_history').is(':checked')) {
    data.choice_performer_history = true;
  } else {
    data.choice_performer_history = false;
  }

  if ($('#choice_enter_search').is(':checked')) {
    data.choice_enter_search = true;
  } else {
    data.choice_enter_search = false;
  }

  data.shortcut_menu_list = [];
  $('#shortcut_menu_list .flex-table table tbody tr').each(function (index, element) {
    const programId = $(element).find('input[name="program-id"]').val().trim();
    const dsplayName = $(element).find('input[name="display-name"]').val().trim();

    if (!programId && !dsplayName) return;

    data.shortcut_menu_list.push({
      programId: programId,
      displayName: dsplayName
    })
  });

  chrome.storage.local.set({ "the_amoeba_support_setting": data }, function () { });
});


// テーブルの行追加
$(document).on("click", ".flex-table .add-btn", function () {
  const tableBody = $(this).closest(".flex-table").find("table tbody");
  appendRow(tableBody)
});

// テーブルの行削除
$(document).on("click", ".flex-table .remove-btn", function () {
  const tableBody = $(this).closest(".flex-table").find("table tbody");
  if (tableBody.children().length > 1) {
    $(this).closest("tr").remove();
  }
});