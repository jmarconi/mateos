"use strict"
const jQuery = require("jquery");

class MateosUi {

    static doBinds() {
        this.doUnBinds();
        jQuery(".point").bind("click", function () {
            game.playPoint(jQuery(this).attr("number"));
            // jQuery(this).toggleClass("selected");
            // if (jQuery(this).attr("selected") == 'selected') {
            //     jQuery(this).attr("selected", null)
            // } else {
            //     jQuery(this).attr("selected", "selected")
            // }
        });
    }

    static doUnBinds() {
        jQuery(".point").unbind("click");
    }

    static drawGrid(rows, columns) {
        console.log("draw grid");
        let i;
        let h;

        for (i = 1; i <= rows; i++) {
            let row = "<div class='row' id='row" + i + "'></div>";
            jQuery("#grid-container").append(row);
            for (h = 1; h <= columns; h++) {
                let cell = "<div class='column' id='cell" + i + "-" + h + "' row='" + i + "' column='" + h + "'></div>";
                jQuery("#row" + i).append(cell);
            }
        }

    }



    static hidePoints(){
        jQuery(".point").hide();
    }

    static showPoint(number){
        jQuery(".point[number=" + number + "]").show();
    }

    static drawPoints(points, states) {
        jQuery.each(points, function (i, point) {
            let id = point.row + "-" + point.column;
            let pointDom = "<div number='" + i + "' class='point' id='' style='background-color: " + states[point.state].color + "'>Point " + i + "</div>";
            $("#cell" + id).append(pointDom);
        });
    }

    static init(points, states) {
        // this.updateInfo();
        this.drawGrid(7, 7);
        this.drawPoints(points, states);
        this.doBinds();
        this.hidePoints();
        this.showPoint(1);
    }

    static createPlayButton(play) {
        // const playButton = document.createElement('div');
        // jQuery(playButton)
        //     .addClass('play-button')
        //     .click(play).text("play")
        //     .appendTo($("#overlay .message, body"));
    }


    static showInstruction(text) {
        $("#instructions").html(text);
    }

    static blockElement(seconds) {
        this.doUnBinds();
        setTimeout(function(){
            MateosUi.doBinds();
        },1000 * seconds);
    }

    static unblockElement(element) {
        // jQuery("#" + element + "-container .ui-" + element).bind("click", function () {
        //     jQuery(this).toggleClass("selected");
        //     if (jQuery(this).attr("selected") == 'selected') {
        //         jQuery(this).attr("selected", null)
        //     } else {
        //         jQuery(this).attr("selected", "selected")
        //     }
        // });
    }


    static updateInfo() {
        // jQuery("#info #current-state .place-holder").html(metronome.currentState);
        // jQuery("#info #current-level .place-holder").html(metronome.currentLevel);
        // jQuery("#info #current-sequence .place-holder").html(metronome.currentSequence);
        // jQuery("#info #current-beat .place-holder").html(metronome.currentBeat);
    }

    static updateFeedBack(message) {
        // jQuery("#feedback").html(message);
    }
}


export {MateosUi};

