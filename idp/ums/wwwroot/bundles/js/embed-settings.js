var getLinkInputObj="",getLinkCopyLinkobj="",isChrome=-1!=navigator.userAgent.indexOf("Chrome");function getEmbedSecret(){$("#get-embed-code").html().trim()==window.TM.App.LocalizationContent.ResetHeader?($(".message-content").addClass("messagebox-align"),isChrome||$(".message-content").css("vertical-align","initial"),messageBox("su su-embed",window.TM.App.LocalizationContent.ResetHeader,window.TM.App.LocalizationContent.ResetConfirmationMessage,"error",resetEmbedSecret)):$.ajax({type:"POST",url:isResetEmbedSecretUrl,success:function(e){e.status&&(secretCodeChange(e),$("#get-embed-code").html(window.TM.App.LocalizationContent.ResetHeader))}})}function resetEmbedSecret(){onCloseMessageBox(),showWaitingPopup("body"),$.ajax({type:"POST",url:isResetEmbedSecretUrl,success:function(e){e.status?(secretCodeChange(e),SuccessAlert(window.TM.App.LocalizationContent.EmbedSettings,window.TM.App.LocalizationContent.ResetSecretSuccessAlert,7e3)):WarningAlert(window.TM.App.LocalizationContent.EmbedSettings,window.TM.App.LocalizationContent.ResetSecretfailureAlert,e.Message,7e3),hideWaitingPopup("body")}})}function secretCodeChange(e){$("#secret-code-copy").tooltip("hide").attr("data-original-title",window.TM.App.LocalizationContent.LinkCopy$).tooltip("fixTitle"),$("#secret-code").removeAttr("disabled"),$("#secret-code-copy").removeAttr("disabled"),$("#secret-code").val(e.resetEmbedSecret),$(".secret-code-notification").show()}$(function(){var t=$("#secret-code"),i=$("#secret-code-copy");$("#restrict-embed-enabled").is(":checked")||$("#import-validation-msg").html(""),embedEnabled||($("#trigger-file").attr("disabled","disabled"),$("#filename").attr("disabled","disabled")),$(document).on("click","#restrict-embed-enabled",function(){var e;$("#restrict-embed-enabled").is(":checked")?($("#get-embed-code").removeAttr("disabled"),""!=t.val()&&(t.removeAttr("disabled"),i.removeAttr("disabled"),i.css("cursor","pointer"),i.tooltip("enable").attr("data-original-title",window.TM.App.LocalizationContent.LinkCopy$).tooltip("fixTitle").tooltip("enable")),e="true",$(".download-template").show(),$("#trigger-file").removeAttr("disabled"),$("#filename").removeAttr("disabled")):($("#get-embed-code").attr("disabled","disabled"),t.attr("disabled","disabled"),i.attr("disabled","disabled"),i.tooltip("disable").attr("data-original-title",window.TM.App.LocalizationContent.LinkCopy$).tooltip("fixTitle").tooltip("disable"),i.css("cursor","default"),$(".download-template").hide(),$("#trigger-file").attr("disabled","disabled"),$("#filename").attr("disabled","disabled"),$("#import-validation-msg").html(""),e="false"),$("#restrict-embed-enabled").attr("disabled","disabled"),$(".embed-loader").addClass("embed-loading"),$.ajax({type:"POST",url:updateSystemSettingsValueUrl,data:{systemSettingValue:e,key:"IsEmbedEnabled"},success:function(e){e.status?$("#restrict-embed-enabled").removeAttr("disabled"):($("#restrict-embed-enabled").removeAttr("disabled"),$("#restrict-embed-enabled").is(":checked")?$("#restrict-embed-enabled").attr("checked",!1):$("#restrict-embed-enabled").attr("checked",!0)),$(".embed-loader").removeClass("embed-loading")}})}),i.on("click",function(e){t.is(":disabled")||(i.tooltip("hide").attr("data-original-title",window.TM.App.LocalizationContent.LinkCopy$).tooltip("fixTitle").tooltip("show"),t.select(),/Safari/.test(navigator.userAgent)&&/Apple Computer/.test(navigator.vendor)?(i.removeClass("su su-copy"),i.attr("data-original-title","")):(document.execCommand("copy"),i.attr("data-original-title",window.TM.App.LocalizationContent.Copied),i.tooltip("hide").attr("data-original-title",window.TM.App.LocalizationContent.Copied).tooltip("fixTitle").tooltip("show"),setTimeout(function(){i.attr("data-original-title",window.TM.App.LocalizationContent.LinkCopy),i.tooltip()},3e3)))}),i.removeClass("focusdiv"),t.on("focusin",function(){i.addClass("focusdiv")}),t.on("focusout",function(){i.removeClass("focusdiv")})}),$(document).on("click","#trigger-file,#filename",function(){$("#restrict-embed-enabled").is(":checked")&&($("#csfile").trigger("click"),$("#csfile").focus())}),$(document).on("change","#csfile",function(e){var t=$(this).val();"json"!=$(this).val().substring($(this).val().lastIndexOf(".")+1)?($("#cs-upload").attr("disabled",!0),$("#filename").val("Please upload a valid cs file.").css("color","#c94442"),$("#filename,#trigger-file").addClass("error-file-upload")):($("#cs-upload").attr("disabled",!1),$("#filename,#trigger-file").removeClass("error-file-upload"),$("#filename").val(t).css("color","#333"),$("#csfile").attr("title",t))});