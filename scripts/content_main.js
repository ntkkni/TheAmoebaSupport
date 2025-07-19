// ****************************************************
// ホームメニュー画面、ログイン画面、ショートカットメニューの処理
// ****************************************************

function alreadyAddedShortcutMenuItem(programId) {
    const f = TheAmoebaSupportSetting.shortcutMenuList.find(elem => {
        return elem.programId == programId;
    })

    return f;
}

function appendShortcutMenuItem(shortcutMenuBar, programId, displayName) {
    const shortcutMenuItem = $('<div class="theamoebasupport-shortcut-menu-item">');
    shortcutMenuItem.append($('<a onclick="sendMenuList(this);">').attr('id', programId).text(displayName));
    shortcutMenuItem.append($('<input type="hidden">').attr('name', 'program-id').val(programId));
    shortcutMenuItem.append($('<input type="hidden">').attr('name', 'display-name').val(displayName));
    shortcutMenuBar.append(shortcutMenuItem)
}

function renderShortcutMenu(refresh) {
    if (window.self !== window.top) return; // iframe 内の場合

    if (TheAmoebaSupportSetting.isChoiceShortcutMenu) {

        const header = $('#Header_Page');
        const shortcutBar = $('#TheAmoebaSupport_ShortcutBar');

        // ショートカットメニューが表示されていない場合は表示
        if (header.length > 0 && header.children().length > 0 && shortcutBar.length == 0) {
            const shortcutMenuBar = $('<div id="TheAmoebaSupport_ShortcutBar">')
            $('#Header_Page').after(shortcutMenuBar);
            $('#Amoeba_Page').css('margin-top', '20px');

            TheAmoebaSupportSetting.shortcutMenuList.forEach(function (sm) {
                appendShortcutMenuItem(shortcutMenuBar, sm.programId, sm.displayName);
            });
        }

        // ショートカットメニューをドラッグアンドドロップで並べ替え可能にする
        shortcutBar.sortable({ axis: 'x' });
        shortcutBar.bind("sortstop", function () {
            // 並べ替えられたら動的に設定を更新
            const shortcut_menu_list = [];

            $(this).find('div.theamoebasupport-shortcut-menu-item').each(function (idx, elem) {
                const programId = $(elem).find('input[type="hidden"][name="program-id"]').val();
                const displayName = $(elem).find('input[type="hidden"][name="display-name"]').val();
                shortcut_menu_list.push({
                    programId: programId,
                    displayName: displayName
                });
            });

            TheAmoebaSupportSetting.shortcutMenuList = shortcut_menu_list;
            saveSetting();
        });
    }
}

$(function () {
    $('div.Title_Form input[name="CompanyCD"]').val(TheAmoebaSupportSetting.companyCode);
    renderShortcutMenu(false);

    // ヘッダーのメニューにショートカット追加ボタンを表示する (renderShortcutMenu でやると MutationObserver の関係で無限ループに陥るので注意)
    if (TheAmoebaSupportSetting.isChoiceShortcutMenu) {
        const programMenuHeader = $('#Progmram_Menu_Header');
        if (programMenuHeader.length > 0) {
            const addBtn = programMenuHeader.closest('.Menu_area').find('span.theamoebasupport-add-shortcut-btn');
            if (addBtn.length == 0) {
                const menuText = programMenuHeader.text();
                const match = menuText.match(/\[([^\]]+)\](.+)/);
                if (match.length > 2) {
                    const programId = match[1];
                    const displayName = match[2].replace('-' + programId + '-', '').trim();
                    const addBtn = $('<span class="theamoebasupport-add-shortcut-btn">');
                    const addBtnLbl = $('<span class="theamoebasupport-add-shortcut-btn-lbl">');
                    if (alreadyAddedShortcutMenuItem(programId)) {
                        addBtnLbl.addClass('shortcut-exists');
                    }
                    addBtn.append(addBtnLbl);
                    addBtn.append($('<input type="hidden">').attr('name', 'program-id').val(programId));
                    addBtn.append($('<input type="hidden">').attr('name', 'display-name').val(displayName));
                    programMenuHeader.after(addBtn);
                }
            }
        }
    }
})

// ページによって描画タイミングが異なるため、MutationObserver も入れておく。
const observer = new MutationObserver(() => {
    renderShortcutMenu(false);
});

observer.observe(document.body, { childList: true, subtree: true });

// ホームメニュー画面でタイルの中心のアイコンだけではなく、タイル全体をクリックできるようにする。
$(document).on('click', 'td.Menu_Picture_Area.menu_cursor_sender', function () {
    var elem = $(this).find('a.Common_Menu_Class')[0];
    if (elem) {
        elem.click();
    }
});

$(document).on('click', '.theamoebasupport-add-shortcut-btn', function () {

    const programId = $(this).find('input[type="hidden"][name="program-id"]').val();
    const displayName = $(this).find('input[type="hidden"][name="display-name"]').val();

    if (alreadyAddedShortcutMenuItem(programId)) return;

    TheAmoebaSupportSetting.shortcutMenuList.push({
        programId: programId,
        displayName: displayName
    });
    saveSetting();

    const shortcutBar = $('#TheAmoebaSupport_ShortcutBar');
    appendShortcutMenuItem(shortcutBar, programId, displayName);

    $(this).find('.theamoebasupport-add-shortcut-btn-lbl').addClass('shortcut-exists');
});