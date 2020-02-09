// ****************************
// ***** 採算表関連 *****
// ****************************

var sAppPath='/teams/';
var sSharePath='/teams/amoeba/';

(function(){

    // $("body").append(
    //   $('<div id="peek_profit_window"></div>')
    // );
})();

$(document).on('DOMSubtreeModified propertychange', '#Search_Result_Table0_Amoeba_Scroll', function() {
	if($('#Search_Result_Table0_Header_Table > tbody > tr > td > a').length > 0){
		var r = document.cookie.split(';');
		r.forEach(function(value) {
 
			//cookie名と値に分ける
			var content = value.split('=');
			if(content[0].trim() == "the_amoeba_support_scrollTop") {
				$('#Search_Result_Table0_Amoeba_Scroll').scrollTop(parseInt(content[1]));
			}
		});
	}
});

// 採算表のスクロール位置を保持
$(document).on('mouseenter', '#Search_Result_Table0_Header_Table > tbody > tr > td > a', function() {
	if($('input[name="TARGET_Y_AND_M_0"][type="text"]').length > 0) {
		var scrollTop = $('#Search_Result_Table0_Amoeba_Scroll').scrollTop();

		document.cookie = "the_amoeba_support_scrollTop=" + scrollTop + ";max-age=3600;path=/;";
	}
});

// $(document).on('mouseleave', '#Search_Result_Table0_Header_Table > tbody > tr > td > a', function() {
//     $("#peek_profit_window").hide();
// });


// function doLinkAction_peek(psService, psActionBean, psForward, psMode, psColumnNames, psColumnValues, psTarget, psMainFormName) {
//     var reColumnNames = new Array('TARGET_Y_AND_M','ORGANIZATION_CD','Efficiency_Account_CD','Efficiency_Account_NA','Service','Path','Data_CL','Efficiency_CL','Open_CL','ExportMode','DetailSumAmount','listsize');
//     var list = 15;
//     if(psColumnValues[7] == 99 || psColumnValues[7] == 51) {
//         list = 30;
//     }
//     var reColumnValues = new Array(psColumnValues[0], psColumnValues[1], psColumnValues[2], psColumnValues[3],psColumnValues[4],psColumnValues[5],psColumnValues[6],psColumnValues[7],psColumnValues[8],psColumnValues[9],psColumnValues[10],list);
//     showSelectItem_peek(psService, psActionBean, psForward, psMode, reColumnNames, reColumnValues, psTarget, psMainFormName);
// }

// function showSelectItem_peek(psService, psActionBean, psForward, psMode, psColumnNames, parrData, psTarget, psMainFormName)
// {
// 	var sColumnNames = String(psColumnNames).split(",");
// 	var target = "";
	
// 	for(i=0;i<sColumnNames.length;i++) {
// 		if(sColumnNames[i] == "target_div") {
// 			target = parrData[i];
// 		}
// 	}
	
// 	if(target == "") {
// 		target = "Main_Page";
// 	}
	
// 	var sMainFormName = 'formMain';
// 	if(psMainFormName && psMainFormName != "")
// 		sMainFormName = psMainFormName;
// 	var oMainForm = document.getElementsByName(sMainFormName).item(0);

// 	var oBody = $("#" + target).get(0);
// 	var oForm = document.formGetData;
// 	//if(oForm) oBody.removeChild(oForm);
//     oForm = amoebaCreateForm();
//     oForm.id="formGetData";
//     oForm.action=sAppPath + "Main";
//     oForm.method="post";
//     oBody.appendChild(oForm);
// 	if(psTarget != null && psTarget != "")
// 		oForm.target=psTarget;

// 	var oInput;
// 	//service
// 	if(psService == null || psService == "")
// 		if(oForm.service)
// 			psService = oForm.service.value;
// 	oInput = createInput("hidden","service",psService);
// 	oForm.appendChild(oInput);
// 	//actionbean
// 	if(psActionBean == null || psActionBean == "")
// 		if(oForm.actionbean)
// 			psActionBean = oForm.actionbean.value;
// 	oInput = createInput("hidden","actionbean",psActionBean);
// 	oForm.appendChild(oInput);
// 	//forward
// 	if(psForward == null || psForward == "")
// 		if(oForm.forward)
// 			psForward = oForm.forward.value;
// 	oInput = createInput("hidden","forward",psForward);
// 	oForm.appendChild(oInput);
// 	//mode
// 	if(psMode == null || psMode == "")
// 		if(oForm.mode)
// 			psMode = "edit";
// 	oInput = createInput("hidden","mode", psMode);
// 	oForm.appendChild(oInput);
// 	//parameter(Column Name + Data)
// 	for(i=0;i<sColumnNames.length;i++)
// 	{
// 		oInput = createInput("hidden",sColumnNames[i],parrData[i]);
// 		oForm.appendChild(oInput);
// 	}

// 	//referer
// 	if(oMainForm && oMainForm.referer)
// 	oInput = createInput("hidden","referer",oMainForm.referer.value);oForm.appendChild(oInput);

// 	//menuID
// 	if(oMainForm && oMainForm.menuID)
// 	oInput = createInput("hidden","menuID",oMainForm.menuID.value);oForm.appendChild(oInput);

// 	amoebaAjaxAction_peek($(oForm).attr('id') , target);
// }

// function amoebaAjaxAction_peek( main_form, target_div, to_target_div, button_id, from_menu_flag, option, addition_div ) {

// 	try {
		
// 		var defs = {
// 			no_focus: false, 
// 			amoeba_button_index : undefined,
// 			isWorkFlow : false
// 	    };
	    
// 	    var config = $.extend({}, defs, option);
	    
// 		var focuselementID = null;
		
// 		if(document.activeElement) {
// 			focuselementID = document.activeElement.id;
// 		}
	
// 		$form = getAmoebaForm(main_form);
		
// 		var $target = getAmoebaTargetDiv(target_div);
// 		var targetID = $target.attr('id');
		
// 		var $toTarget = null;
		
// 		if(to_target_div == undefined) {
// 			$toTarget = getAmoebaTargetDiv(target_div);
// 		} else {
// 			$toTarget = getAmoebaTargetDiv(to_target_div);
// 		}
		
// 		if(main_form != undefined && isString(main_form) && main_form != 'formMain') {
			
// 			var formaction = $form.attr("action");
// 			var index = formaction.indexOf('javascript');
// 			if (index != -1) {
// 				//amoebaClosiong($target);
// 				//amoebaClosiong($toTarget);
// 				$target = null;
// 				$toTarget = null;
				
// 				var formVal = $form.get(0);
// 				$form.get(0).submit();
				
// 				return false;
// 			}
// 		}
		
// 		var formData = $form.get(0);
		
// 		if (!formData.Pager_Flag) {
// 			formData.appendChild(createInput("hidden","Pager_Flag","1"));
// 		}
		
// 		if (!formData.Button_ID) {
// 			formData.appendChild(createInput("hidden","Button_ID",button_id));
// 		}
		
// 		if (formData.Next_Previous_Flag) {
// 			formData.mode.value = 'next';
// 		}
		
// 		//amoebaClosiong($toTarget);
		
// 		//$form.get(0).submit();
// 		//return;
		
// 		if($(from_menu_flag).get(0)) {
// 			//amoebaClosiong($toTarget);
// 			//amoebaClosiong($target);
// 			var formVal = $form.get(0);
// 			$form = null;
// 			//$target.html("");
// 			//$toTarget.html("");
// 			//amoebaClosiong();
// 			$target = null;
// 			$toTarget = null;
// 			formVal.submit();
// 			return false;
// 		}
		
// 		var noSetAmoebaMenuID = $form.find("[name='noSetAmoebaMenuID']").val();
// 		if(noSetAmoebaMenuID == 'true') {
// 			;
// 		} else {
// 			amoebaSetMenuIDForm($form);
// 		}
		
// 		var $tokenID = $form.find("[name='amoebaTokenID']");
		
// 		if(!$tokenID.length) {
// 			$form.append('<input type="hidden" id="amoebaTokenID" name="amoebaTokenID" value="'+amoebaTokenID+'" />');
// 		}
		
// 	} finally {
// 	}
	
// 	$.when(
// 	     $.ajax({
// 	            url: $form.attr('action'),
// 	            type: $form.attr('method'),
// 	            data: $form.serialize()
// 	                + '&delay=1', 
// 	            timeout: 120000, 
// 	            async: true,
// 	            dataType:'html'
// 	        })
// 	    .done(function(data) {
	    	
// //	    	if($toTarget.length) {
// //	    		$toTarget.css("visibility" , "hidden");
// //	    	}

//     		//$.fn.lastProcess = function() {};

// 		if("redirectForm" != main_form) {
// 			//amoebaClosiong($("#" + targetID));
// 		}
	    	
// 	    	var fromFlag = $(from_menu_flag).get(0);
// 	    	var nextData = $("#" + targetID, data);
	    	
// 	    	if(fromFlag && !nextData.length) {
// 	    		// $form.get(0).submit();
// 	    		// $form = null;
// 	    		return false;
// 			} else {
// 				var replaceData = $("#" + targetID, data);
				
// 				if(replaceData.length) {
//                     var resultPage = replaceData.find('#result_page');
                    
//                     $('#peek_profit_window').empty();
//                     $('#peek_profit_window').append(resultPage);

// 					// $.fn.getAmoebaTargetDiv(target_div).html("");
// 					// $.fn.getAmoebaTargetDiv(to_target_div).html("");
// 					// amoebaCollectGarbage();
// 					// $.fn.getAmoebaTargetDiv(to_target_div).html(replaceData.html());
					
// 					// if(addition_div != undefined) {
						
// 					// 	for( var addition_i = 0; addition_i < addition_div.length; addition_i++) {
// 					// 		$.fn.getAmoebaTargetDiv(addition_div[addition_i]).html($("#" + addition_div[addition_i], data).html());
// 					// 	}
//                     // }
// 				} else {
// 					//$("html").html(data);
// 					return false;
// 				}
				
// 			}
			
// 			// try {
// 			// 	amoebaInitializeScript(config.no_focus, config.isWorkFlow, targetID);
// 			// 	$.fn.lastProcess();
// 			// }catch(e){
// 			// 	printStackTrace(e);
// 			// }
		
// //			$toTarget.css("visibility" , "visible");
			
// 			// if(!config.no_focus) {
// 			// 	// initFocus();
// 			// } else {
// 			// 	initFocus(false);
				
// 			// 	if(sErrorHTML == '') {
// 			// 		var amoeba_button_index = config.amoeba_button_index;
					
// 			// 		if(amoeba_button_index != undefined) {
// 			// 			$focusEleval = $("input[amoeba_button_index="+ amoeba_button_index +"]");
// 			// 	        setTimeout(function (){
// 			// 	            $focusEleval.focus();
// 			// 	    	    $focusEleval = null;
// 			// 	        }, 0);
// 			// 		} else {
// 			// 			if(focuselementID != undefined) {
// 			// 				$focusEleval = $("#" + focuselementID);
// 			// 		        setTimeout(function (){
// 			// 		            $focusEleval.focus();
// 			// 		            $focusEleval = null;
// 			// 		        }, 0);
// 			// 	        }
// 			//         }
// 		    //     }
// 			// }
// 			// // ErrWindowを開かないまま
// 			// var openErrFlg = $("#NoOpenErr");
// 			// if(openErrFlg.length) {
// 			// 	;
// 			// } else {
// 			// openErrorWindow();
// 			// }
// 	    })
// 	    .fail(function(data, textStatus, errorThrown) {
// 			//$("html").html(data.responseText);
// 		}).always(function(data, textStatus, returnedObject) {
// 			//setWaitFlag( false );
// 		})
//     )
//     .done(function() {
// 	});
	
// 	// $form = null;
// 	// $target = null;
// }

// function isString(obj) {
// 	return typeof (obj) == "string" || obj instanceof String;
// };

// function createInput(psType,psName,psValue)
// {
// 	var oI;
// 	oI = document.createElement("INPUT");
// 	oI.type=psType;
// 	oI.name=psName;
// 	oI.value=psValue;
// 	return oI;
// }

// function amoebaCreateForm() {
// 	var form = document.createElement("FORM");
// 	amoebaSetMenuIDForm(form);
// 	return form;
// }

// function getAmoebaForm(main_form) {
	
// 	var $form = $(main_form);
	
// 	if($form.length == 0) {
// 		$form = $("#" + main_form);
// 	}
	
// 	if($form.length == 0) {
// 		$form = $("form[name='" + main_form + "']");
// 	}
	
// 	if($form.length == 0) {
// 		$form = $("#formMain");
// 	}
	
// 	if($form.length == 0) {
// 		$form = $("form[name='formMain']");
// 	}
	
// 	return $form;
// }

// function getAmoebaTargetDiv(target_div) {
	
// 	var $target = $(target_div);
	
// 	if($target.length == 0) {
// 		$target = $("#" + target_div);
// 	}
	
// 	if($target.length == 0) {
// 		$target = $("#Main_Page");
// 	}
	
// 	if($target == 0) {
// 		alert("please set target div.");
// 	}
	
// 	return $target;
// }

// function amoebaSetMenuIDForm(form) {

// 	var $amoebaForm = $(form);
	
// 	var $no_change_menuid = $amoebaForm.find("[name='no_change_menuid']").val();
// 	var $MenuIDData = $("#MenuIDData");
// 	var $menuID = $amoebaForm.find("[name='menuID']");
	
// 	if($MenuIDData.length) {	
// 		$amoebaForm.append('<input type="hidden" id="Origin_MenuID" name="Origin_MenuID" value="'+$MenuIDData.val()+'" />');
// 		if("1" == $no_change_menuid) {
// 			amoebaMenuID = $menuID.val();
// 		} else {
// 			if($menuID.length) {
// 				$menuID.val($MenuIDData.val());
// 			} else {
// 				$amoebaForm.append('<input type="hidden" id="menuID" name="menuID" value="'+$MenuIDData.val()+'" />');
// 			}
// 		}
// 	} else {
// 			if($menuID.length) {
// 				;
// 			} else {
// 				$amoebaForm.append('<input type="hidden" id="menuID" name="menuID" value="'+amoebaMenuID+'" />');
// 			}
// 	}
	
// 	var $tokenID = $amoebaForm.find("[name='amoebaTokenID']");
	
// 	if(!$tokenID.length) {
// 		$amoebaForm.append('<input type="hidden" id="amoebaTokenID" name="amoebaTokenID" value="'+amoebaTokenID+'" />');
// 	}
	
// 	$MenuIDData = null;
// 	$menuID = null;
// 	$amoebaForm = null;
// }