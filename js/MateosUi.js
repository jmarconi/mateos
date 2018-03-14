"use strict"
// import {jQuery} from 'jquery';
const jQuery = require("jquery");

class MateosUi {
    static mapa() {
       console.log("mapa");
    }
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
    }
}

export {MateosUi};

