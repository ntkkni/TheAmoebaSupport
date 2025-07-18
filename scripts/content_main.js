// ****************************************************
// ホームメニュー画面、ログイン画面、全画面共通の処理
// ****************************************************

function renderShortcutMenu() {
    if (TheAmoebaSupportSetting.isChoiceShortcutMenu) {
        const header = $('#Header_Page');
        const shortcutBar = $('#TheAmoebaSupport_ShortcutBar');

        if (header.length > 0 && shortcutBar.length == 0) {
            const shortcutMenuBar = $('<div id="TheAmoebaSupport_ShortcutBar">')
            $('#Header_Page').after(shortcutMenuBar);
            $('#Amoeba_Page').css('margin-top', '20px');

            TheAmoebaSupportSetting.shortcutMenuList.forEach(function (sm) {
                const shortcutMenuItem = $('<div class="theamoebasupport-shortcut-menu-item">');
                // menutype="3"
                shortcutMenuItem.append($('<a onclick="sendMenuList(this);">').attr('id', sm.programId).text(sm.displayName));
                shortcutMenuBar.append(shortcutMenuItem);
            });
        }
    }
}

$(function () {
    $('div.Title_Form input[name="CompanyCD"]').val(TheAmoebaSupportSetting.companyCode);
    renderShortcutMenu();
})

// ページによって描画タイミングが異なるため、MutationObserver も入れておく。
const observer = new MutationObserver(() => {
    renderShortcutMenu();
});

observer.observe(document.body, { childList: true, subtree: true });

// ホームメニュー画面でタイルの中心のアイコンだけではなく、タイル全体をクリックできるようにする。
$(document).on('click', 'td.Menu_Picture_Area.menu_cursor_sender', function () {
    var elem = $(this).find('a.Common_Menu_Class')[0];
    if (elem) {
        elem.click();
    }
});