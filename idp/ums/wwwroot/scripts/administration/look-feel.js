const additionalSpecialChar = /^[a-zA-Z_0-9`~!\$\^()=\-\.\{\} ]+$/;

$(document).ready(function () {
    addPlacehoder("#font-upload-dialog");
    var fontUploadDialog = new ejs.popups.Dialog({
        header: window.TM.App.LocalizationContent.UploadFont,
        showCloseIcon: true,
        width: '472px',
        close: onUploadFontDialogClose,
        isModal: true,
        visible: false,
        animationSettings: { effect: 'Zoom' }
    });
    fontUploadDialog.appendTo("#font-upload-dialog");

    fontDropDownListInitialization('#fontfamily', window.TM.App.LocalizationContent.LookAndFeel, true);
    document.getElementById("fontfamily").ej2_instances[0].value = selectedFontValue;
    document.getElementById("fontfamily").ej2_instances[0].text = selectedFontText;
    applicationThemeDropDownListInitialization('#applicationTheme', window.TM.App.LocalizationContent.ApplicationTheme, true);
    dashboardThemeDropDownListInitialization('#dashboardTheme', window.TM.App.LocalizationContent.DashboardTheme, true);
    document.getElementById("applicationTheme").ej2_instances[0].value = selectedApplicationThemeValue;
    document.getElementById("applicationTheme").ej2_instances[0].text = selectedApplicationThemeText;
    document.getElementById("dashboardTheme").ej2_instances[0].value = selectedDashboardThemeValue;
    document.getElementById("dashboardTheme").ej2_instances[0].text = selectedDashboardThemeText;

    var applicationThemeUploadDialog = new ejs.popups.Dialog({
        header: window.TM.App.LocalizationContent.ApplicationTheme,
        showCloseIcon: true,
        width: '472px',
        close: onUploadApplicationThemeDialogClose,
        isModal: true,
        visible: false,
        animationSettings: { effect: 'Zoom' }
    });
    applicationThemeUploadDialog.appendTo("#application-theme-upload-dialog");

    var dashboardThemeUploadDialog = new ejs.popups.Dialog({
        header: window.TM.App.LocalizationContent.DashboardTheme,
        showCloseIcon: true,
        width: '472px',
        close: onUploadDashboardThemeDialogClose,
        isModal: true,
        visible: false,
        animationSettings: { effect: 'Zoom' }
    });
    dashboardThemeUploadDialog.appendTo("#dashboard-theme-upload-dialog");

    $.validator.addMethod("additionalSpecialCharValidation", function (value) {
        if (additionalSpecialChar.test(value) || value === "") {
            return true;
        }
    }, window.TM.App.LocalizationContent.AvoidSpecailCharacters);

    $.validator.addMethod("isRequired", function (value) {
        return !isEmptyOrWhitespace(value);
    }, window.TM.App.LocalizationContent.EnterName);

    $("#upload-font-form").validate({
        errorElement: 'span',
        onkeyup: function (element, event) {
            if (event.keyCode != 9) {
                isKeyUp = true;
                $(element).valid();
                isKeyUp = false;
            }
            else
                true;
        },
        onfocusout: function (element) { $(element).valid(); },
        rules: {
            "fontname": {
                isRequired: true,
                additionalSpecialCharValidation: true
            },
        },
        highlight: function (element) {
            $(element).closest('div').addClass("has-error");
        },
        unhighlight: function (element) {
            $(element).closest('div').removeClass('has-error');
            if (!$(element).closest('div').hasClass('upload-box')) {
                $(element).closest('div').find("span").html("");
            }
        },
        errorPlacement: function (error, element) {
            $(element).closest('div').find("span").html(error.html()).css("display", "block");
        },
        messages: {
            "fontname": {
                isRequired: window.TM.App.LocalizationContent.UserNameValidator
            }
        }
    });

    $(document).on("click", "#trigger-file, #font-file-name", function () {
        $('input[type="file"]').val(null);
        $("#font-file").trigger("click");
    });

    $(document).on("click", "#update-lookandfeel-settings", function () {
        var theme = {
            Appearance: $("input:radio[name=theme-required]:checked").val(),
            ApplicationTheme: document.getElementById("applicationTheme").ej2_instances[0].value,
            DashbaordTheme: document.getElementById("dashboardTheme").ej2_instances[0].value
        };
        var lookAndFeelSettings = {
            FontFamily: document.getElementById("fontfamily").ej2_instances[0].value,
            Theme: theme
        };
        showWaitingPopup('body');
        $.ajax({
            type: "POST",
            url: updateFontThemeSettingsUrl,
            data: { updateSettings: lookAndFeelSettings },
            success: function (result) {
                if (result.status) {
                    SuccessAlert(window.TM.App.LocalizationContent.LookAndFeelSettings, window.TM.App.LocalizationContent.LookAndFeelSettingsSuccess, 7000);
                    window.location.href = window.location.href;
                } else {
                    WarningAlert(window.TM.App.LocalizationContent.LookAndFeelSettings, window.TM.App.LocalizationContent.LookAndFeelSettingsFailur, result.Message, 7000);
                }
                hideWaitingPopup('body');
            }
        });
    });

    $(document).on("click", "#upload-font", function () {
        showWaitingPopup('body');     
    });

    $(document).on("click", "#trigger-application-file, #application-theme-file-name", function () {
        $('input[type="file"]').val(null);
        $("#applicationtheme-file").trigger("click");
    });

    $(document).on("click", "#trigger-dashboard-file, #dashboard-theme-file-name", function () {
        $('input[type="file"]').val(null);
        $("#dashboardtheme-file").trigger("click");
    });
});

function onFontChange() {
    var selectedFontFamily = document.getElementById("fontfamily").ej2_instances[0].value;
    var fontElements = document.getElementsByClassName("font-ref");
    fontElements[0].href = fontReferenceUrl + "?family=" + selectedFontFamily;
}

function onApplicationThemeChange() {
    var applicationTheme = document.getElementById("applicationTheme").ej2_instances[0].value;
    var applicationElements = document.getElementsByClassName("application-theme-ref");
    applicationElements[0].href = applicationThemeReferenceUrl + "?theme=" + applicationTheme;
}

$(document).on("change", "#font-file", function (e) {
    var fileName = e.target.files[0].name;
    var fontName = fileName.substring(0, fileName.indexOf('.'));
    $("#font-file-name").val(fileName);
    $("#font-name").val(fontName);
    $(".validation").closest("div").removeClass("has-error");
    $(".fontupload-validation-messages").css("display", "none");
    $("#upload-font").attr("disabled", false);

});

function onChangeTheme(id, classname) {
    var oldthemeElements = document.getElementsByClassName(classname);
    if (oldthemeElements.length == 0) {
        oldthemeElements = document.getElementsByClassName(id === "#dark-theme-required" ? "dark-theme-ref" : "light-theme-ref");
    }
    var newthemeElements = oldthemeElements[0].href.split(id === "#dark-theme-required" ? "light" : "dark");
    var theme = (id === "#dark-theme-required" ? "darktheme.css" : "lighttheme.css");
    oldthemeElements[0].href = newthemeElements[0] + theme;
}

$(document).on("change", "#dark-theme-required", function (e) {
    onChangeTheme("#dark-theme-required", "light-theme-ref");
});

$(document).on("change", "#light-theme-required", function (e) {
    onChangeTheme("#light-theme-required", "dark-theme-ref");
});


function uplodformValidation() {
    return $("#upload-font-form").valid();
}



function onUploadFontDialogClose() {
    $("#upload-font").attr("disabled", true);
    $("#font-name").val('');
    $('input[type="file"]').val(null);
    $("#font-file-name").val(window.TM.App.LocalizationContent.BrowseFont);
    $(".validation").closest("div").removeClass("has-error");
    $(".fontupload-validation-messages").css("display", "none");
    document.getElementById("font-upload-dialog").ej2_instances[0].hide();
}

function onUploadFontDialogOpen() {
    document.getElementById("font-upload-dialog").ej2_instances[0].show();
}

function onUploadApplicationThemeDialogOpen() {
    document.getElementById("application-theme-upload-dialog").ej2_instances[0].show();
}

function onUploadDashboardThemeDialogOpen() {
    document.getElementById("dashboard-theme-upload-dialog").ej2_instances[0].show();
}

function onUploadApplicationThemeDialogClose() {
    $("#upload-applicationtheme").attr("disabled", true);
    $("#applicationtheme-name").val('');
    $('input[type="file"]').val(null);
    $("#application-theme-file-name").val('');
    $('#applicationtheme-file').closest('div').removeClass("has-error");
    $(".validation").closest("div").removeClass("has-error");
    $(".applicationthemefileupload-validation-messages").css("display", "none");
    $(".applicationthemeupload-validation-messages").css("display", "none");
    document.getElementById("application-theme-upload-dialog").ej2_instances[0].hide();
}

function onUploadDashboardThemeDialogClose() {
    $("#upload-dashboardtheme").attr("disabled", true);
    $("#dashboardtheme-name").val('');
    $('input[type="file"]').val(null);
    $("#dashboard-theme-file-name").val('');
    $('#dashboardtheme-file').closest('div').removeClass("has-error");
    $(".validation").closest("div").removeClass("has-error");
    $(".applicationthemefileupload-validation-messages").css("display", "none");
    $(".applicationthemeupload-validation-messages").css("display", "none");
    document.getElementById("dashboard-theme-upload-dialog").ej2_instances[0].hide();
}

$(document).on("change", "#applicationtheme-file", function (e) {
    var fileName = e.target.files[0].name;
    var fontName = fileName.substring(0, fileName.indexOf('.'));
    var name = $("#applicationtheme-name").val();
    $("#application-theme-file-name").val(fileName);
    $('#upload-applicationtheme').attr("disabled", "disabled");

    var fileInput = document.getElementById('applicationtheme-file');
    var filePath = fileInput.value;
    var allowedExtensions = /(\.css)$/i;
    if (!allowedExtensions.exec(filePath)) {
        $('#applicationtheme-file').closest('div').addClass("has-error");
        $("#invalid-applicationthemefile-name").html(window.TM.App.LocalizationContent.CssFile).css("display", "block");
        $('#upload-applicationtheme,#applicationtheme-name').attr("disabled", "disabled");
        $(".applicationthemefileupload-validation-messages").css("display", "block");
    }
    else {
        var applicationTheme = document.getElementById("applicationTheme").ej2_instances[0];
        var applicationThemeList = applicationTheme.getItems();
        $('#applicationtheme-file').closest('div').removeClass("has-error");
        $(".applicationthemefileupload-validation-messages").css("display", "none");
        $('#upload-applicationtheme,#applicationtheme-name').removeAttr("disabled");
        $('#applicationtheme-name').closest('div').removeClass("has-error");
        $(".applicationthemeupload-validation-messages").css("display", "none");
        $("#applicationtheme-name").val(fontName);
        for (var item = 0; item < applicationThemeList.length; item++) {
            if (fontName === applicationThemeList[item].dataset.value) {
                $('#applicationtheme-name').closest('div').addClass("has-error");
                $("#invalid-applicationtheme-name").html(window.TM.App.LocalizationContent.CssFileExist).css("display", "block");
                $('#upload-applicationtheme,#applicationtheme-name').attr("disabled", "disabled");
                $(".applicationthemeupload-validation-messages").css("display", "block");
            }
        }
    }
});

$(document).on("change", "#dashboardtheme-file", function (e) {
    var fileName = e.target.files[0].name;
    var fontName = fileName.substring(0, fileName.indexOf('.'));
    var name = $("#dashboardtheme-name").val();
    $("#dashboard-theme-file-name").val(fileName);
    $('#upload-dashboardtheme').attr("disabled", "disabled");

    var fileInput = document.getElementById('dashboardtheme-file');
    var filePath = fileInput.value;
    var allowedExtensions = /(\.css)$/i;
    if (!allowedExtensions.exec(filePath)) {
        $('#applicationtheme-name').closest('div').addClass("has-error");
        $("#invalid-applicationtheme-name").html(window.TM.App.LocalizationContent.AvoidSpecailCharacters).css("display", "block");
        $('.upload-applicationtheme').attr("disabled", "disabled");
        $(".applicationthemeupload-validation-messages").css("display", "block");
    }
    else {
        var dashboardTheme = document.getElementById("dashboardTheme").ej2_instances[0];
        var dashboardThemeList = dashboardTheme.getItems();
        $('#dashboardtheme-file').closest('div').removeClass("has-error");
        $(".applicationthemefileupload-validation-messages").css("display", "none");
        $('#upload-dashboardtheme').removeAttr("disabled");
        $('#dashboardtheme-name').removeAttr("disabled");
        $('#dashboardtheme-name').closest('div').removeClass("has-error");
        $(".applicationthemeupload-validation-messages").css("display", "none");
        $("#dashboardtheme-name").val(fontName);
        for (var item = 0; item < dashboardThemeList.length; item++) {
            if (fontName === dashboardThemeList[item].dataset.value) {
                $('#dashboardtheme-name').closest('div').addClass("has-error");
                $("#invalid-dashboardtheme-name").html(window.TM.App.LocalizationContent.CssFileExist).css("display", "block");
                $('#upload-dashboardtheme,#dashboardtheme-name').attr("disabled", "disabled");
                $(".applicationthemeupload-validation-messages").css("display", "block");
            }
        }
    }
});

function keyvalidation(id) {
    var name = $(id).val();
    var invalid = id === "#applicationtheme-name" ? "#invalid-applicationtheme-name" : "#invalid-dashboardtheme-name";
    var themename = id === "#applicationtheme-name" ? "applicationTheme" : "dashboardTheme";
    var theme = document.getElementById(themename).ej2_instances[0];
    var themeList = theme.getItems();

    if ($.trim(name) == "") {
        $(id).closest('div').addClass("has-error");
        $(invalid).html(window.TM.App.LocalizationContent.EnterName).css("display", "block");
        $('.upload-applicationtheme').attr("disabled", "disabled");
        $(".applicationthemeupload-validation-messages").css("display", "block");
    }
    else if (!additionalSpecialChar.test(name) || name === "") {
        $(id).closest('div').addClass("has-error");
        $(invalid).html(window.TM.App.LocalizationContent.AvoidSpecailCharacters).css("display", "block");
        $('.upload-applicationtheme').attr("disabled", "disabled");
        $(".applicationthemeupload-validation-messages").css("display", "block");
    }
    else {
        for (var item = 0; item < themeList.length; item++) {
            if (name === themeList[item].dataset.value) {
                $(id).closest('div').addClass("has-error");
                $(invalid).html(window.TM.App.LocalizationContent.CssFileExist).css("display", "block");
                $('.upload-applicationtheme').attr("disabled", "disabled");
                $(".applicationthemeupload-validation-messages").css("display", "block");
                break;
            }
            else {
                $(id).closest('div').removeClass("has-error");
                $(".applicationthemeupload-validation-messages").css("display", "none");
                $('.upload-applicationtheme').removeAttr("disabled");
            }
        }
    }
}

$(document).on("keyup", "#applicationtheme-name", function () {
    keyvalidation("#applicationtheme-name");
});

$(document).on("keyup", "#dashboardtheme-name", function () {
    var name = $("#dashboardtheme-name").val();
    keyvalidation("#dashboardtheme-name");
});



function uploadapplicationValidation() {
    return $("#upload-application-theme-form").valid();
}

function uploaddashboardValidation() {
    return $("#upload-dashboard-theme-form").valid();
}
