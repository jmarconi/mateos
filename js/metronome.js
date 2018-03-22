var RemoteApi = require("live-remote-api").RemoteApi;
import {jQuery} from 'jquery';
import {MateosUi} from './MateosUi';

window.MateosUi = MateosUi;


RemoteApi.onOpen(function () {
    window.RemoteApi = RemoteApi;
    window.addEventListener("load", metronome.init);
});

var audioContext = null;

// The Web Worker used to fire timer messages
var timerWorker = null;


const sequences = {
    "percussion": {
        1: {
            "snare": "00100010",
            "hihat": "00000000"
        },
        2: {
            "snare": "01100110",
            "hihat": "00000000"
        }
    },
    "moreGroove": {
        1: {
            "snare": "00100010",
            "hihat": "01010101"
        },
        2: {
            "snare": "00100011",
            "hihat": "01011101"
        }
    },
    "shaker": {
        1: {
            "snare": "00001000",
            "hihat": "01100110"
        },
        2: {
            "snare": "00001011",
            "hihat": "11101110"
        }
    }
};


var metronome = {
    // Are we currently playing?
    isPlaying: false,
    // What note is currently last scheduled?
    current16thNote: 1,
    // tempo (in beats per minute)
    tempo: 96.0,
    // How frequently to call scheduling function  (in milliseconds)
    lookahead: 25.0,
    // How far ahead to schedule audio (sec),
    // This is calculated from lookahead, and overlaps with next interval (in case the timer is late)
    scheduleAheadTime: 0.1,
    // when the next note is due.
    nextNoteTime: 0.0,
    // 0 == 16th, 1 == 8th, 2 == quarter note
    noteResolution: 2,
    // the last "box" we drew on the screen
    last16thNoteDrawn: -1,
    // the notes that have been put into the web audio, and may or may not have played yet. {note, time}
    notesInQueue: [],
    compass: 1,
    //mrouds??
    rounds: 3,
    //initial state
    currentState: "solid",
    currentLevel: "percussion",
    currentSequence: 1,
    currentScore: {
        1: false,
        2: false,
    },

    sequences: sequences,

    nextNote: function () {
        // console.log("next note");
        //console.log("next note " + this.current16thNote);
        // Advance current note and time by a 16th note...
        // Notice this picks up the CURRENT tempo value to calculate beat length.
        var secondsPerBeat = 60.0 / this.tempo;
        // Add beat length to last beat time
        metronome.nextNoteTime += 0.25 * secondsPerBeat;

        // Advance the beat number, wrap to one
        metronome.current16thNote++;


        if (metronome.current16thNote > 16) {
            metronome.compass++;

            if (metronome.compass > metronome.rounds) {
                metronome.compass = 1;
            }
            metronome.current16thNote = 1;
        }
    },
    getUiStep: function (beatNumber) {
        let beat = Math.round(beatNumber / 2);

        return beat;
    },

    initSequence(element) {
        MateosUi.blockElement(element);
        MateosUi.showPattern(element, metronome.sequences[metronome.currentLevel][metronome.currentSequence][element]);
    },

    evaluateSequence() {
        const actualSequence = metronome.sequences[metronome.currentLevel][metronome.currentSequence]["snare"];
        const success = actualSequence == MateosUi.getElementSequence("snare");
        metronome.currentScore[metronome.currentSequence] = success;
        if (success) {
            MateosUi.updateFeedBack("Yeah!");
        } else {
            MateosUi.updateFeedBack("nope :(");
        }
        metronome.executeSequenceTransition();
        MateosUi.updateInfo();
    },

    executeSequenceTransition() {
        if (metronome.currentSequence == 1) {
            metronome.levelUp();
            console.log("level up 1");
        } else if (metronome.currentSequence == 2) {
            if (metronome.currentScore["1"] && metronome.currentScore["2"]) {
                console.log("level up 2");
                metronome.levelUp();
            } else {
                console.log("level down");
                metronome.levelDown();
            }
        }
    },

    levelUp() {
        if (metronome.currentLevel == "percussion") {
            if (metronome.currentSequence == 1) {
                metronome.currentSequence = 2;
            } else if (metronome.currentSequence == 2) {
                metronome.currentLevel = "moreGroove";
                metronome.currentSequence = 1;
            }
        } else if (metronome.currentLevel == "moreGroove") {
            if (metronome.currentSequence == 1) {
                metronome.currentSequence = 2;
            } else if (metronome.currentSequence == 2) {
                metronome.currentLevel = "shaker";
                metronome.currentSequence = 1;
            }
        } else if (metronome.currentLevel == "shaker") {
            if (metronome.currentSequence == 1) {
                metronome.currentSequence = 2;
            } else if (metronome.currentSequence == 2) {
                // metronome.currentLevel = "shaker";
                metronome.currentSequence = 1;
            }
        }

    },

    levelDown() {
        if (metronome.currentLevel == "percussion") {
            metronome.currentSequence = 1;
        } else if (metronome.currentLevel == "moreGroove") {
            metronome.currentLevel = "percussion";
            metronome.currentSequence = 1;
        } else if (metronome.currentLevel == "shaker") {
            metronome.currentLevel = "moreGroove";
            metronome.currentSequence = 1;
        }
    },

    scheduleNote: function (beatNumber, time) {
        metronome.notesInQueue.push({note: beatNumber, time: time});
        if ((beatNumber % 2) == 0) {
            var Beat = metronome.getUiStep(beatNumber);
            MateosUi.setTempo(Beat);
        }
        if (beatNumber == 1) {
            if (metronome.compass == 1) {
                metronome.executeLook();
                metronome.fireClips();
            } else if (metronome.compass == 3) {
                metronome.fireClips();
                metronome.executeValidate();
            }
        }
        else if (beatNumber == 8) {
            if (metronome.compass == 1) {
                metronome.executeRepeat();
            }
        }
        else if (beatNumber == 15) {
            if (metronome.compass == 2) {
                metronome.evaluateSequence();
            }
        }
    },

    executeLook: function () {
        MateosUi.showInstruction("Look!");
        MateosUi.updateFeedBack("");
        metronome.initSequence("snare");
        metronome.initSequence("hihat");

    },

    executeRepeat: function () {
        MateosUi.showInstruction("Repeat");
        MateosUi.hidePattern("snare");
        MateosUi.hidePattern("hihat");
        MateosUi.unblockElement("snare");
        MateosUi.unblockElement("hihat");
    },

    executeValidate: function () {

        MateosUi.blockElement("snare");
        MateosUi.blockElement("hihat");
        MateosUi.showInstruction("Validate")
    },

    scheduler: function () {
        // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
        while ((metronome.nextNoteTime) < (audioContext.currentTime + metronome.scheduleAheadTime)) {
            metronome.scheduleNote(metronome.current16thNote, metronome.nextNoteTime);
            metronome.nextNote();
        }
    },

    play: function () {
        $("#overlay").hide();
        metronome.isPlaying = !metronome.isPlaying;
        if (metronome.isPlaying) { // start playing
            return metronome.doPlay();
        } else {
            return metronome.doStop();
        }
    },

    doPlay: function () {
        timerWorker.postMessage("start");
        RemoteApi.create("live_set", function (err, api) {
            api.call("start_playing");
        });

        MateosUi.play();

        return true;
    },
    //on stop we reset tempo on client and live
    doStop: function () {
        timerWorker.postMessage("stop");
        metronome.current16thNote = 1;
        metronome.compass = 1;
        metronome.currentLevel = "percussion";
        metronome.currentSequence = 1;
        metronome.currentState = "solid";
        metronome.currentScore = {1: false, 2: false};
        RemoteApi.create("live_set", function (err, api) {
            api.call("stop_playing");
            api.call("stop_all_clips");
            api.set("current_song_time", 0);
        });
        MateosUi.stop();
        metronome.notesInQueue = [];
        metronome.executeLook();
        MateosUi.updateInfo();

        return false;
    },

    // executeKickBeat: function (Beat) {
    //     if ($(".ui-kick.selected[beat=" + Beat + "]").length) {
    //         //fire clip
    //         RemoteApi.create("live_set tracks 1 clip_slots 1", function (err, api) {
    //             api.call('fire');
    //         });
    //     } else {
    //         //fire empty clip
    //         RemoteApi.create("live_set tracks 1 clip_slots 0", function (err, api) {
    //             api.call('fire');
    //         });
    //     }
    // },

    executeSnareBeat: function () {
        $(".ui-snare").each(function () {
            let beat = parseInt($(this).attr("beat"));
            let channel = beat + 4;
            if ($(this).attr("selected")) {
                RemoteApi.create("live_set tracks " + channel + "  clip_slots 1", function (err, api) {
                    api.call('fire');
                })
            } else {
                RemoteApi.create("live_set tracks " + channel + "  clip_slots 0", function (err, api) {
                    api.call('fire');
                });
            }
        })
    },

    executeHiHatBeat: function () {
        $(".ui-hihat").each(function () {
            let beat = parseInt($(this).attr("beat"));
            let channel = beat + 13;
            if ($(this).attr("selected")) {
                RemoteApi.create("live_set tracks " + channel + "  clip_slots 1", function (err, api) {
                    api.call('fire');
                })
            } else {
                RemoteApi.create("live_set tracks " + channel + "  clip_slots 0", function (err, api) {
                    api.call('fire');
                });
            }
        });

    },

    fireClips: function () {
        // metronome.executeKickBeat(Beat);
        metronome.executeSnareBeat();
        metronome.executeHiHatBeat();

    },

    draw: function () {
        var currentNote = metronome.last16thNoteDrawn;
        //var currentTime = this.audioContext.currentTime;
        while (metronome.notesInQueue.length && metronome.notesInQueue[0].time < metronome.currentTime) {
            currentNote = metronome.notesInQueue[0].note;
            metronome.notesInQueue.splice(0, 1);   // remove note from queue
        }
        // We only need to draw if the note has moved.
        if (metronome.last16thNoteDrawn != currentNote) {
            // console.log("when? hwat?");
            metronome.last16thNoteDrawn = currentNote;
        }
        // set up to draw again
        requestAnimFrame(metronome.draw);
    },


    init: function () {
        MateosUi.init();
        // NOTE: THIS RELIES ON THE MONKEYPATCH LIBRARY BEING LOADED FROM
        // Http://cwilso.github.io/AudioContext-MonkeyPatch/AudioContextMonkeyPatch.js
        // TO WORK ON CURRENT CHROME!!  But this means our code can be properly
        // spec-compliant, and work on Chrome, Safari and Firefox.
        audioContext = new AudioContext();

        // // if we wanted to load audio files, etc., this is where we should do it.
        console.log("init");
        MateosUi.createPlayButton(metronome.play);


        // window.onorientationchange = metronome.resetCanvas;
        // window.onresize = metronome.resetCanvas;

        requestAnimFrame(metronome.draw);    // start the drawing loop.

        timerWorker = new Worker("metronomeworker.js");
        timerWorker.onmessage = function (e) {
            if (e.data == "tick") {
                metronome.scheduler();
            } else {
                console.log("message: " + e.data);
            }
        };
        timerWorker.postMessage({"interval": metronome.lookahead});
        metronome.doStop()
    }
};

// First, let's shim the requestAnimationFrame API, with a setTimeout fallback
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

window.metronome = metronome;