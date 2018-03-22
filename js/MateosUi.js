"use strict"
const jQuery = require("jquery");

// const MateosBGCanvas = require("./MateosBGCanvas.js");

class MateosUi {

    static doBinds() {
        this.doUnBinds();
        jQuery("#kick-container .ui-kick, #snare-container .ui-snare, #hihat-container .ui-hihat").bind("click", function () {
            jQuery(this).toggleClass("selected");
            if (jQuery(this).attr("selected") == 'selected') {
                jQuery(this).attr("selected", null)
            } else {
                jQuery(this).attr("selected", "selected")
            }
        });
    }

    static doUnBinds() {
        jQuery("#kick-container .ui-kick, #snare-container .ui-snare, #snare-container .ui-hihat").unbind("click");
    }


    static init() {
        this.setTempo("1");
        this.doBinds();
        this.updateInfo();
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
        pattern = pattern.split("");
        $(".ui-" + element).each(function () {
            let beat = parseInt($(this).attr("beat"));

            if (pattern[beat-1] == 1) {
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

    static blockElement(element) {
        jQuery("#" + element + "-container .ui-" + element).unbind("click");
    }

    static unblockElement(element) {
        jQuery("#" + element + "-container .ui-" + element).bind("click", function () {
            jQuery(this).toggleClass("selected");
            if (jQuery(this).attr("selected") == 'selected') {
                jQuery(this).attr("selected", null)
            } else {
                jQuery(this).attr("selected", "selected")
            }
        });
    }


    static getElementSequence(element) {
        let sequence = "";
        let elements = jQuery("#" + element + "-container .ui-" + element);
        elements.sort(function(a,b) {
            a = $(a);
            b = $(b);
            if (a.attr("beat") >  b.attr("beat")) return 1;
            else if (a.attr("beat") < b.attr("beat")) return -1;
            else return 0
        });
        elements.each(function () {
            if($(this).attr("selected") == "selected"){
                sequence += "1";
            }else{
                sequence += "0";
            }

        });

        return sequence;
    }

    static updateInfo()
    {
        jQuery("#info #current-state .place-holder").html(metronome.currentState);
        jQuery("#info #current-level .place-holder").html(metronome.currentLevel);
        jQuery("#info #current-sequence .place-holder").html(metronome.currentSequence);
    }

    static updateFeedBack(message)
    {
        jQuery("#feedback").html(message);
    }
}


export {MateosUi};

