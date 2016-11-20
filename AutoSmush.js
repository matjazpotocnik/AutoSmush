/*jslint this:true */
/*jslint browser:true */
/*global
    $, window
*/
$(document).ready(function () {
    "use strict";

    var pwasBtn = "#optimize_all";
    var pwcancelBtn = "#cancel_all";
    var moduleForm = "#ModuleEditForm #Inputfield_bulkoptimize_fieldset input";
    // if using localtools, 100-150 ms is a good number for pollTime, so there is little chance to miss a file
    // could it be set up higher, like 1000, if you are using online tools like resmush.it
    var pollTime = 100;
    var dataUrl = $(pwasBtn).data("url");
    var progressUrl = $(pwasBtn).data("progressUrl");
    var cancelUrl = $(pwcancelBtn).data("url");
    var resultElement = $("#result");
    var percentElement = $("#percent");
    var progressBar = $("#progressbar");
    var pwasMsg = {
        start: $(pwasBtn).data("startMsg"),
        complete: $(pwasBtn).data("completeMsg"),
        error: $(pwasBtn).data("errorMsg"),
        confirm: $(pwasBtn).data("confirmMsg"),
        saveFirst: $(pwasBtn).data("saveFirstMsg"),
        canceled: $(pwcancelBtn).data("canceledMsg")
    };
    var previousFile;
    var canceled = false;

    $(pwasBtn + " span").removeClass();
    $(pwasBtn).button();

    // backup checkbox is active only if optimize originals is checked
    var chkboxOptOrig = $("#Inputfield_optAutoAction_optimize_originals");
    var chkboxOptBackup = $("#Inputfield_optAutoAction_backup");
    var chkboxOptBackuplabel = $(".Inputfield_optAutoAction label:eq(2)");

    if (!chkboxOptOrig.is(":checked")) {
        chkboxOptBackuplabel.addClass("optDisabled");
    }

    chkboxOptOrig.on("click", function () {
        var checked = $(this).is(":checked");
        if (checked) {
            chkboxOptBackuplabel.removeClass("optDisabled");
        } else {
            chkboxOptBackuplabel.addClass("optDisabled");
        }
    });

    chkboxOptBackup.on("click", function (e) {
        if (!chkboxOptOrig.is(":checked")) {
            e.preventDefault();
        }
    });

    // disable bulk optimize button if module settings were changed
    $(moduleForm).on("change input", function () {
        if (!$(pwasBtn).length) {
            return false;
        }

        var wrapper = progressBar.parents(".InputfieldContent");
        wrapper.fadeOut(100, function () {
            $(pwasBtn).text(pwasMsg.saveFirst);
            $(pwasBtn).button("disable");
            $(moduleForm).off("change input");
        });
        wrapper.fadeIn(100);
    });

    $(pwcancelBtn).on("click", function (e) {

        e.preventDefault();

        $.ajax({
            url: cancelUrl,
            cache: false,
            success: function () {
                $(pwcancelBtn).button({label: pwasMsg.canceled});
                $(pwcancelBtn).button("option", "disabled", true);
                canceled = true;
                clearInterval(window.progressInterval);
                return false;
            },
            error: function () {
                clearInterval(window.progressInterval);
                percentElement.html(percentElement.html() + " " + pwasMsg.error);
                return false;
            }
        });
    });

    $(pwasBtn).on("click", function (e) {

        function checkProgress() {
            $.ajax({
                url: progressUrl,
                cache: false,
                success: function (data) {
                    var status = "";
                    // if optimize engine is not selected
                    if (data && data.error !== "" && data.file === "ERROR") {
                        resultElement.html("<span class='status error'>" + data.error + "</span>");
                        return false;
                    }
                    if (data && data.file && previousFile !== data.file) {

                        if (data.error_api) {
                            status = "<span class='status error api'>" + data.error_api + "</span>";
                        } else if (data.error) {
                            status = "<span class='status error'>" + data.error + "</span>";
                        } else if (data.percentComplete) {
                            status = "<span class='status percent'>" + data.percentNew + "</span>";
                            if (data.percentComplete !== "100") {
                                percentElement.html(data.counter);
                            }
                            progressBar.attr("value", data.percentComplete);
                        }

                        resultElement.html(
                            resultElement.html() + "<a href='" + data.url + "' target='_blank'><span class='faded'>" + data.basedir + "</span><span class='file'>" + data.file + "</span>" + status + "</a>"
                        );
                        resultElement.scrollTop(resultElement[0].scrollHeight - resultElement.height()); // scroll to bottom

                        previousFile = data.file;
                    }

                    return false;
                },
                fail: function () {
                    clearInterval(window.progressInterval);
                    return false;
                }
            });
        }

        e.preventDefault();

        var bulkEngine = $("#wrap_optBulkEngine");
        if (bulkEngine.find("input:checked").length === 0) {
            bulkEngine.addClass("inputError");
            setTimeout(function () {
                bulkEngine.removeClass("inputError");
            }, 2000);
            return false;
        }

        var bulkAction = $("#wrap_optBulkAction");
        if (bulkAction.find("input:checked").length === 0) {
            bulkAction.addClass("inputError");
            setTimeout(function () {
                bulkAction.removeClass("inputError");
            }, 2000);
            return false;
        }

        if (window.confirm(pwasMsg.confirm) === false) {
            return false;
        }

        $(pwasBtn).button("option", "disabled", true);
        $(pwasBtn).remove();

        $(pwcancelBtn).addClass("cancel_all_unhide");
        $(pwcancelBtn).button();

        percentElement.html("<span class='start'>" + pwasMsg.start + "</span>");

        progressBar.fadeIn();

        $.ajax({
            url: dataUrl,
            cache: false,
            success: function (/*data*/) { // done
                clearInterval(window.progressInterval);
                checkProgress(); // to display last result
                if (canceled) {
                    progressBar.addClass("canceled");
                } else {
                    percentElement.html(pwasMsg.complete);
                    progressBar.attr("value", 100);
                    progressBar.addClass("done");
                    $(pwcancelBtn).remove();
                }
                return false;
            },
            error: function () { // fail
                clearInterval(window.progressInterval);
                checkProgress(); // to display last result
                percentElement.html(percentElement.html() + " " + pwasMsg.error);
                return false;
            }
        });

        window.progressInterval = setInterval(checkProgress, pollTime);

        return false;
    });

    resultElement.on("click", "a", function (e) {
        e.preventDefault();

        var currentItem = $(this);

        $.magnificPopup.open({
            type: "image",
            closeOnContentClick: true,
            items: {
                src: currentItem.attr("href")
            },
            callbacks: {
                open: function () {
                    var imgCaption = currentItem.find(".file").text();
                    this.content.find(".mfp-title").html(imgCaption);
                }
            }
        });
    });

});
