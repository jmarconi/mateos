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


var metronome = {
    // Are we currently playing?
    isPlaying: false,
    // What note is currently last scheduled?
    current16thNote: 1,
    // tempo (in beats per minute)
    tempo: 123.0,
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


    nextNote: function () {
        console.log("next note");
        //console.log("next note " + this.current16thNote);
        // Advance current note and time by a 16th note...
        // Notice this picks up the CURRENT tempo value to calculate beat length.
        var secondsPerBeat = 60.0 / this.tempo;
        // Add beat length to last beat time
        this.nextNoteTime += 0.25 * secondsPerBeat;

        // Advance the beat number, wrap to one
        this.current16thNote++;
        if (this.current16thNote > 16) {
            this.compass++;
            if (this.compass > 4) {
                this.compass = 1;
            }
            this.current16thNote = 1;
        }
    },
    getUiStep: function (beatNumber) {
        let beat = (this.compass - 1) * 2 + Math.round(beatNumber / 8);
        console.log(beat);

        return beat;
    },
    executeKickBeat: function (Beat) {

        if ($(".ui-kick.selected[beat=" + Beat + "]").length) {
            //fire clip
            RemoteApi.create("live_set tracks 1 clip_slots 1", function (err, api) {
                api.call('fire');
            });
        } else {
            //fire empty clip
            RemoteApi.create("live_set tracks 1 clip_slots 0", function (err, api) {
                api.call('fire');
            });
        }
    },

    executeSnareBeat: function (Beat) {

        if ($(".ui-snare.selected[beat=" + Beat + "]").length) {
            //fire clip
            RemoteApi.create("live_set tracks 2 clip_slots 1", function (err, api) {
                api.call('fire');
            });
        } else {
            //fire empty clip
            RemoteApi.create("live_set tracks 2 clip_slots 0", function (err, api) {
                api.call('fire');
            });
        }
    },

    executeHiHatBeat: function (Beat) {

        if ($(".ui-hihat.selected[beat=" + Beat + "]").length) {
            //fire clip
            RemoteApi.create("live_set tracks 3 clip_slots 1", function (err, api) {
                api.call('fire');
            });
        } else {
            //fire empty clip
            RemoteApi.create("live_set tracks 3 clip_slots 0", function (err, api) {
                api.call('fire');
            });
        }
    },

    fireClips: function (beatNumber) {
        let Beat = this.getUiStep(beatNumber);
        //we check one bar ahead
        MateosUi.setTempo(Beat);
        Beat++;
        if (Beat > 8) {
            Beat = 1;
        }
        this.executeKickBeat(Beat);
        this.executeSnareBeat(Beat);
        this.executeHiHatBeat(Beat);

    },

    scheduleNote: function (beatNumber, time) {
        console.log("schedule note");
        // push the note on the queue, even if we're not playing.
        metronome.notesInQueue.push({note: beatNumber, time: time});
        //
        // if ((this.noteResolution == 1) && (beatNumber % 2))
        //     return; // we're not playing non-8th 16th notes
        // if ((this.noteResolution == 2) && (beatNumber % 4))
        //     return; // we're not playing non-quarter 8th notes
        if ((beatNumber % 8) == 0) {
            this.fireClips(beatNumber);

        }
    },

    scheduler: function () {
        // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
        console.log("scheduler");
        console.log(audioContext.currentTime);
        while (this.nextNoteTime < audioContext.currentTime + this.scheduleAheadTime) {
            // console.log("schedule note beat: " + this.current16thNote + " time: " + this.nextNoteTime);
            this.scheduleNote(this.current16thNote, this.nextNoteTime);
            this.nextNote();
        }
    },

    play: function () {
        this.isPlaying = !this.isPlaying;
        if (this.isPlaying) { // start playing
            return metronome.doPlay();
        } else {
            return metronome.doStop();
        }
    },

    doPlay: function () {
        timerWorker.postMessage("start");
        RemoteApi.create("live_set", function (err, api) {
            //api.get("current_song_time",function(val){console.log(val)} );
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
        RemoteApi.create("live_set", function (err, api) {
            api.call("stop_playing");
            api.call("stop_all_clips");
            api.set("current_song_time", 0);
        });
        MateosUi.stop();
        metronome.notesInQueue = [];
        return false;
    },
    /*
        resetCanvas: function (e) {
            // resize the canvas - but remember - this clears the canvas too.
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            //make sure we scroll to the top left.
            window.scrollTo(0, 0);
        },
    */
    draw: function () {
        var currentNote = metronome.last16thNoteDrawn;
        //var currentTime = this.audioContext.currentTime;
        while (metronome.notesInQueue.length && metronome.notesInQueue[0].time < metronome.currentTime) {
            currentNote = metronome.notesInQueue[0].note;
            metronome.notesInQueue.splice(0, 1);   // remove note from queue
        }
        // We only need to draw if the note has moved.
        if (metronome.last16thNoteDrawn != currentNote) {
            console.log("when? hwat?");
            metronome.last16thNoteDrawn = currentNote;
        }
        // set up to draw again
        requestAnimFrame(metronome.draw);
    },

    init: function () {
        MateosUi.init();

        // var container = document.createElement( 'div' );
        //
        // container.className = "container";
        // canvas = document.createElement( 'canvas' );
        // canvasContext = canvas.getContext( '2d' );
        // canvas.width = window.innerWidth;
        // canvas.height = window.innerHeight;
        // document.body.appendChild( container );
        // container.appendChild(canvas);
        // canvasContext.strokeStyle = "#ffffff";
        // canvasContext.lineWidth = 2;

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
        timerWorker.postMessage({"interval": this.lookahead});
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