var RemoteApi = require("live-remote-api").RemoteApi;

$("#kick-container .ui-kick").click(function (event) {
    $(this).toggleClass("selected");
    if ($(this).attr("selected") == 'selected') {
        $(this).attr("selected",null)
    } else {
        $(this).attr("selected","selected")
    }
});

$("#snare-container .ui-snare").click(function (event) {
    $(this).toggleClass("selected");
    if ($(this).attr("selected") == 'selected') {
        $(this).attr("selected",null)
    } else {
        $(this).attr("selected","selected")
    }
});

$("#hihat-container .ui-hihat").click(function (event) {
    $(this).toggleClass("selected");
    if ($(this).attr("selected") == 'selected') {
        $(this).attr("selected",null)
    } else {
        $(this).attr("selected","selected")
    }
});
