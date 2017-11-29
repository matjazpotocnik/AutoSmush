/*jslint this:true*/
/*jslint browser:true*/
/*global
    $, window
*/
$(document).ready(function () {
    "use strict";

    var pwasBtn = "#optimize_all";
    var pwcancelBtn = "#cancel_all";
    var moduleForm = "#ModuleEditForm #Inputfield_bulkoptimize_fieldset input";
    var dataUrl = $(pwasBtn).data("url");
    var optimizeUrl = $(pwasBtn).data("optimizeurl");
    var resultElement = $("#result");
    var percentElement = $("#percent");
    var progressBar = $("#progressbar");
    var progressBar1 = $("#progressbar1");
    var pwasMsg = {
        start: $(pwasBtn).data("startMsg"),
        complete: $(pwasBtn).data("completeMsg"),
        error: $(pwasBtn).data("errorMsg"),
        confirm: $(pwasBtn).data("confirmMsg"),
        saveFirst: $(pwasBtn).data("saveFirstMsg"),
        filelist: $(pwasBtn).data("filelistMsg"),
        filelistnum: $(pwasBtn).data("filelistnumMsg"),
        canceled: $(pwcancelBtn).data("canceledMsg"),
        canceling: $(pwcancelBtn).data("cancelingMsg")
    };
    var canceled = false;
    var error = false;
    var batch = 0; // current batch number
    var numBatches = 0; // total number of batches
    var images; // array of images in current batch
    var index; // index of current image processed
    var numImages = 0; // total number of processed images
    var numFailedImages = 0; //total number of failed images
    var tmp;

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

    function showReport() {
        var info = "<hr>";
        info += "<div class='info'>Pages with image fields: " + numBatches + "</div>";
        info += "<div class='info'>Number of images: " + numImages + "</div>";
        info += "<div class='info'>Number of failed images: " + numFailedImages + "</div>";
        resultElement.append(info)
            .scrollTop(resultElement[0].scrollHeight - resultElement.height());
    }

    function finished() {
        percentElement.html(pwasMsg.complete);
        //progressBar.attr("value", 100);
        progressBar.val(100);
        //progressBar1.attr("value", 100);
        progressBar1.val(100);
        progressBar.addClass("done");
        if (!canceled) {
            $(pwcancelBtn).remove();
        } else {
            $(pwcancelBtn).button({label: pwasMsg.canceled});
        }
    }

    $(pwcancelBtn).on("click", function (e) {
        e.preventDefault();
        canceled = true;
        $(pwcancelBtn).button({label: pwasMsg.canceling});
        $(pwcancelBtn).button("option", "disabled", true);
    });

    var processFiles = function (index) {

        // display current file
        tmp = images[index].split(",");
        resultElement.append("<div><span class='faded'>" + tmp[0] + "</span><span class='file'>" + tmp[1] + "</span></div>")
            .scrollTop(resultElement[0].scrollHeight - resultElement.height()); // scroll to bottom;

        $.ajax({
            url: optimizeUrl + "&id=" + tmp[0] + "&file=" + images[index],
            dataType: "json",
            success: function (data) {
                var status = "";
                error = true;
                numImages += 1;
                var c = "pwas-error";

                if (data !== Object(data)) {
                    resultElement.children().last()
                        .replaceWith("<div class='pwas-error'><span class='faded'>" + tmp[0] + "</span><span class='file'>" + tmp[1] + "</span><span class='status error'>" + "invalid JSON response: " + data + "<span></div>");
                    numFailedImages += 1;
                } else {
                    if (data.error_api !== null) {
                        status = "<span class='status error api'>" + data.error_api + "</span>";
                        numFailedImages += 1;
                    } else if (data.error !== null) {
                        status = "<span class='status error'>" + data.error + "</span>";
                        numFailedImages += 1;
                    } else if (data.percentNew !== null) {
                        status = "<span class='status percent'>" + data.percentNew + "</span>"; //reduction percentage
                        error = false;
                        c = "";
                    }
                    resultElement.children().last()
                        .replaceWith("<a class='" + c + "' href='" + data.url + "' target='_blank'><span class='faded'>" + data.basedir + "</span><span class='file'>" + data.file + "</span>" + status + "</a>");
                }

                index += 1; // next item in images
                var p1 = index / images.length * 100;
                //progressBar1.attr("value", Math.round(p1));
                progressBar1.val(Math.round(p1));
                //var p = (batch / numBatches * 100) + (index * 100 / numBatches / index.length);
                var p = Math.round((batch / numBatches * 100) + (p1 / numBatches));
                //progressBar.attr("value", p);
                progressBar.val(p);
                percentElement.find("span").html(p);

                if (images[index] != undefined && !canceled) {
                    processFiles(index);
                } else {
                    // processing of files finished, start with next batch
                    //progressBar1.attr("value", 100);
                    progressBar1.val(100);
                    batch += 1;
                    if (batch < numBatches && !canceled) {
                        processBatch(batch);
                    } else {
                        finished();
                        showReport();
                    }
                }
            },
            fail: function (jqXHR, textStatus, errorThrown) {
                // optimization failed, timeout or some error on PW server? move to the next file anyway
                error = true;
                resultElement.children().last().remove()
                    .append("<div class='pwas-error'><span class='faded'>" + tmp[0] + "</span><span class='file'>" + tmp[1] + "</span><span class='status error'>" + pwasMsg.error + " " + jqXHR.status + " (" + errorThrown + ")</span></div>");
                //progressBar1.attr("value", Math.round(index / images.length * 100));
                progressBar1.val(Math.round(index / images.length * 100));

                numImages += 1;
                numFailedImages += 1;
                index += 1;

                if (images[index] != undefined && !canceled) {
                    processFiles(index);
                } else {
                    // processing of files finished, start with next batch
                    batch += 1;
                    if (batch < numBatches && !canceled) { //batc+1 < numBatches?
                        processBatch(batch);
                    } else {
                        finished();
                        showReport();
                    }
                }
            }
        });
    };

    var processBatch = function (batch) {
        //progressBar1.attr("value", 0);
        progressBar1.val(0);
        
        resultElement.append("<div><span class='faded'>" + pwasMsg.filelist + "</span></div>")
            .scrollTop(resultElement[0].scrollHeight - resultElement.height()); // scroll to bottom;

        $.ajax({
            url: dataUrl + "&start=" + batch, //edit?name=AutoSmush?&mode=bulk&start=0
            cache: false,
            dataType: "json",
            success: function (data) { // done
                // {"counter:"Processing batch 1 out of 5 - 20% complete","numBatches":xx,"numImages":xx,"images":["url1","url2",...]}
                // {"error":"xxx","numImages":0}
                resultElement.children().last().replaceWith("<div class='info'><span class='faded'>" + pwasMsg.filelistnum + data.numImages + "</span></div>")
                    .scrollTop(resultElement[0].scrollHeight - resultElement.height());

                // if optimize engine is not selected, just in case someone is fooling arrond
                if (data && data.error != undefined) {
                    resultElement.append("<div class='pwas-error'><span class='status error'>" + pwasMsg.error + " " + data.error + "</span></div>")
                        .scrollTop(resultElement[0].scrollHeight - resultElement.height()); // scroll to bottom;
                    error = true;
                }

                if (data && data.counter) {
                    var c = data.counter.replace("{", "<span>").replace("}", "</span>");
                    percentElement.html(c);
                }

                if (data && data.numImages !== 0 && canceled === false) {
                    numBatches = data.numBatches;
                    images = data.images;
                    index = 0;
                    processFiles(index);
                } else {
                    finished();
                    showReport();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) { // fail
                error = true;
                resultElement.children().last().replaceWith("<div class='pwas-error'><span class='status error'>" + pwasMsg.error + " " + jqXHR.status + " (" + errorThrown + ")</span></div>")
                    .scrollTop(resultElement[0].scrollHeight - resultElement.height());
                batch += 1;
                if (batch < numBatches) {
                    processBatch(batch);
                } else {
                    finished();
                    showReport();
                }
            }
        });
    };

    $(pwasBtn).on("click", function (e) {

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
        progressBar1.fadeIn();

        batch = 0;
        processBatch(batch);
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
