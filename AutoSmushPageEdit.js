/*jslint this:true */
/*jslint browser:true */
/*global
    $, parent
*/
$(document).ready(function () {
    "use strict";

    // for PW before 3.0.17
    $(document).on("click", "a.InputfieldImageOptimize", function (e) {
        e.preventDefault();
        var currentItem = $(this);
        var optUrl = currentItem.attr("href");
        //currentItem.html("Optimizing <i class='fa fa-spin fa-spinner fa-fw'></i>");
        currentItem.html($(this).attr("data-optimizing") + " <i class='fa fa-spin fa-spinner fa-fw'></i>");

        $.ajax({
            url: optUrl,
            cache: false,
            success: function (data) {
                currentItem.text(data);
                return false;
            },
            error: function (xhr, textStatus) {
                currentItem.text(textStatus);
                return false;
            }
        });
    });

    $(document).on("click", "button.InputfieldImageOptimize1", function () {
        var currentItem = $(this);
        var optUrl = currentItem.attr("data-href");
        var optText = currentItem.find("span:eq(2)"); //third span
        optText.html(" " + $(this).attr("data-optimizing") + " <i class='fa fa-spin fa-spinner fa-fw'></i>");

        $.ajax({
            url: optUrl,
            cache: false,
            success: function (data) {
                optText.text(" " + data);
                return false;
            },
            error: function (xhr, textStatus) {
                optText.text(" " + textStatus);
                return false;
            }
        });
    });

    // finds all selected variations and optimize them in ajax calls
    $(document).on("click", "button.InputfieldOptimizeVariants", function () {
        var currentItem = parent.$("div.ui-dialog-buttonset").find("button:eq(0)"); //first button
        var optUrl = $(this).attr("data-href"); //button data-href
        var id = $("form#ImageVariations").attr("action").split("&")[0].replace("./?", "").replace("id=", ""); //id of edited page
        var optText = currentItem.find("span:eq(1)"); //second span
        var optTextHtml = optText.html(); //html inside button

        var inp = $("input[name='delete[]']:checked"); //array of checked inputfields
        window.numvariants = inp.length;
        if (inp.length === 0) {
            return window.alert($(this).attr("data-check"));
        }
        optText.html($(this).attr("data-optimizing") + " <i class='fa fa-spin fa-spinner fa-fw'></i>");
        //currentItem.attr("disabled", "true").addClass("ui-state-disabled");
        currentItem.addClass("ui-state-disabled");
        inp.each(function () {
            var currentCheckbox = $(this);
            var optUrlAjax = optUrl + "&id=" + id + "&file=" + id + "," + $(this).val();
            var t = currentCheckbox.parent().parent().parent().find("td:eq(3)");
            if ($("#AdminDataTable1").hasClass("AdminDataTableMobile")) {
                t = currentCheckbox.parent().parent().parent().parent().find("td:eq(3)").find(".td");
            }
            var th = t.html();
            t.html("<i class='fa fa-spin fa-spinner fa-fw'></i>&nbsp;" + th);

            $.ajax({
                url: optUrlAjax,
                cache: false,
                success: function (data) {
                    t.html(th + " <i class='fa fa-angle-double-right'></i> " + data);
                    window.numvariants = window.numvariants - 1;
                    if (window.numvariants === 0) {
                        //currentItem.attr("disabled", "false").removeClass("ui-state-disabled");
                        currentItem.removeClass("ui-state-disabled");
                        optText.html(optTextHtml); //return previous content
                    }
                    return false;
                },
                error: function (xhr, textStatus) {
                    t.html(" " + textStatus);
                    window.numvariants = window.numvariants - 1;
                    return false;
                }
            });
        });
    });

    // adds Optimizing text to the spinner
    if(config.AutoSmush) {
        $(document).on("change", '.InputfieldImage' ,function () {
            var spinner = $(this).find(".gridImage__resize");
            //console.log(spinner.html());
            spinner.html("<i class='fa fa-spinner fa-spin fa-2x fa-fw'></i><span style='font-size:14px'> " + config.AutoSmush + "</span>");
        });
    }

});
