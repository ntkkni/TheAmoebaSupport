// ****************************
// ***** 採算表関連 *****
// ****************************

var sAppPath = '/teams/';
var sSharePath = '/teams/amoeba/';

(function () {

	// $("body").append(
	//   $('<div id="peek_profit_window"></div>')
	// );
})();

$(document).on('DOMSubtreeModified propertychange', '#Search_Result_Table0_Amoeba_Scroll', function () {
	if ($('#Search_Result_Table0_Header_Table > tbody > tr > td > a').length > 0) {
		var r = document.cookie.split(';');
		r.forEach(function (value) {

			//cookie名と値に分ける
			var content = value.split('=');
			if (content[0].trim() == "the_amoeba_support_scrollTop") {
				$('#Search_Result_Table0_Amoeba_Scroll').scrollTop(parseInt(content[1]));
			}
		});
	}
});

// 採算表のスクロール位置を保持
$(document).on('mouseenter', '#Search_Result_Table0_Header_Table > tbody > tr > td > a', function () {
	if ($('input[name="TARGET_Y_AND_M_0"][type="text"]').length > 0) {
		var scrollTop = $('#Search_Result_Table0_Amoeba_Scroll').scrollTop();

		document.cookie = "the_amoeba_support_scrollTop=" + scrollTop + ";max-age=3600;path=/;";
	}
});
