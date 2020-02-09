// ****************************************************
// ***** ホームメニュー画面、ログイン画面あたりの処理 *****
// ****************************************************

$(function() {
    $('div.Title_Form input[name="CompanyCD"]').val(TheAmoebaSupportSetting.companyCode);
})

// ホームメニュー画面でタイルの中心のアイコンだけではなく、タイル全体をクリックできるようにする。
$(document).on('click', 'td.Menu_Picture_Area.menu_cursor_sender', function() {
    var elem = $(this).find('a.Common_Menu_Class')[0];
    if(elem) {
        elem.click();
    }
});