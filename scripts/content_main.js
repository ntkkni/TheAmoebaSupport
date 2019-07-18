
// ダミーボタン生成
function createDummyButton(originalButton, originalButtonSelector, dummyButtonName) {
    var dummyButton = $('<input name="' + dummyButtonName +'" type="button" style="position: absolute;" >')
        .addClass(originalButton.attr('class'))
        .val(originalButton.val())
        .css('left', originalButton.position().left + "px")
        .attr("original_selector", originalButtonSelector); // もとのボタンのセレクタをもたせておく
        
    originalButton.after(dummyButton);
}

$(function() {
    $('div.Title_Form input[name="CompanyCD"]').val("15");
})

$(document).on('click', 'td.Menu_Picture_Area.menu_cursor_sender', function() {
    var elem = $(this).find('a.Common_Menu_Class')[0];
    if(elem) {
        elem.click();
    }
});