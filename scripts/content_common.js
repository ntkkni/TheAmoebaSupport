// ****************************
// ***** 共通処理 *****
// ****************************

// グローバル設定
var TheAmoebaSupportSetting = {
    companyCode: 15,
    isChoiceShortcutMenu: false,
    shortcutMenuList: [],
    isChoicePerformerHistory: false, // ワークフロー画面で送信先を履歴から選択するかどうか
    performerList: [], // 送信先履歴
    isChoiceEnterSearch: false // 勤務実績報告画面でEnter押下で検索するかどうか
};

function trimAnyChar(str, anyChar) {
    return str.replace(new RegExp("^" + anyChar + "+|" + anyChar + "+$", "g"), '');
}

function loadSetting(setting) {
    if (setting && setting.company_code) {
        TheAmoebaSupportSetting.companyCode = setting.company_code;
    }

    if (setting && setting.choice_shortcut_menu) {
        TheAmoebaSupportSetting.isChoiceShortcutMenu = true;
    } else {
        TheAmoebaSupportSetting.isChoiceShortcutMenu = false;
    }

    if (setting && setting.choice_performer_history) {
        TheAmoebaSupportSetting.isChoicePerformerHistory = true;
    } else {
        TheAmoebaSupportSetting.isChoicePerformerHistory = false;
    }

    if (setting && setting.choice_enter_search) {
        TheAmoebaSupportSetting.isChoiceEnterSearch = true;
    } else {
        TheAmoebaSupportSetting.isChoiceEnterSearch = false;
    }

    if (setting && setting.shortcut_menu_list) {
        TheAmoebaSupportSetting.shortcutMenuList = setting.shortcut_menu_list;
    } else {
        TheAmoebaSupportSetting.shortcutMenuList = []
    }
}

function saveSetting() {

    var data = {
        company_code: TheAmoebaSupportSetting.companyCode,
        choice_shortcut_menu: TheAmoebaSupportSetting.isChoiceShortcutMenu,
        choice_performer_history: TheAmoebaSupportSetting.isChoicePerformerHistory,
        choice_enter_search: TheAmoebaSupportSetting.isChoiceEnterSearch,
        shortcut_menu_list: TheAmoebaSupportSetting.shortcutMenuList
    };

    chrome.storage.local.set({ "the_amoeba_support_setting": data }, function () { });
}

function setPerformerList(value) {
    TheAmoebaSupportSetting.performerList = [];

    for (var i in value) {
        TheAmoebaSupportSetting.performerList.push({
            performer_id: value[i].performer_id,
            performer_name: value[i].performer_name
        });
    }
}

// 設定のホットリロード
chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (namespace == "local") {
        if (changes.the_amoeba_support_setting) {
            loadSetting(changes.the_amoeba_support_setting.newValue);
        }
    }
});

(function () {

    // 設定のロード
    chrome.storage.local.get("the_amoeba_support_setting", function (value) {
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


// ダミーボタン生成
function createDummyButton(originalButton, originalButtonSelector, dummyButtonName) {
    var posLeft = originalButton.position().left;
    posLeft += 15; // TODO: なぜか期待する position の値が取れないので、一旦無理矢理調整。

    var dummyButton = $('<input name="' + dummyButtonName + '" type="button" style="position: absolute;" >')
        .addClass(originalButton.attr('class'))
        .val(originalButton.val())
        .css('left', posLeft + "px")
        .attr("original_selector", originalButtonSelector); // もとのボタンのセレクタをもたせておく

    originalButton.after(dummyButton);
}
