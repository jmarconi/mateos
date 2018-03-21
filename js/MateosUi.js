"use strict"
const jQuery = require("jquery");

// const MateosBGCanvas = require("./MateosBGCanvas.js");

class MateosUi {
    static init() {
        jQuery("#kick-container .ui-kick").click(function (event) {
            jQuery(this).toggleClass("selected");
            if (jQuery(this).attr("selected") == 'selected') {
                jQuery(this).attr("selected", null)
            } else {
                jQuery(this).attr("selected", "selected")
            }
        });

        jQuery("#snare-container .ui-snare").click(function (event) {
            jQuery(this).toggleClass("selected");
            if (jQuery(this).attr("selected") == 'selected') {
                jQuery(this).attr("selected", null)
            } else {
                jQuery(this).attr("selected", "selected")
            }
        });

        jQuery("#hihat-container .ui-hihat").click(function (event) {
            jQuery(this).toggleClass("selected");
            if (jQuery(this).attr("selected") == 'selected') {
                jQuery(this).attr("selected", null)
            } else {
                jQuery(this).attr("selected", "selected")
            }
        });
        this.setTempo("1");
        // window.MateosBgCanvas.execute();
    }

    static createPlayButton(play) {
        const playButton = document.createElement('div');
        jQuery(playButton)
            .addClass('play-button')
            .click(play).text("play")
            .appendTo($("#overlay .message, body"));
    }

    static play() {
        jQuery(".play-button").text("stop");
    }

    static stop() {
        jQuery(".play-button").text("play");
        this.setTempo("1");
    }

    static setTempo(beat) {
        console.log("set temp " + beat)
        $(".ui-tempo").removeClass("active");
        $('.ui-tempo[beat=' + beat + ']').addClass("active");
    }

    static setBeatNumber(beatNumber) {
        jQuery(".beat-counter").html(beatNumber);
    }

    static showPattern(element, pattern) {
        pattern = {
            1: false,
            2: false,
            3: true,
            4: false,
            5: false,
            6: false,
            7: true,
            8: false,
        };
        $(".ui-" + element).each(function () {
            let beat = parseInt($(this).attr("beat"));

            if (pattern[beat]) {
                $(this).attr("selected", "selected").addClass("selected");
            } else {
                $(this).attr("selected", null).removeClass("selected");
            }
        })
    }

    static hidePattern(element) {
        $(".ui-" + element).attr("selected", null).removeClass("selected");
    }

    static showInstruction(text) {
        $("#instructions").html(text);
    }
}


export {MateosUi};

