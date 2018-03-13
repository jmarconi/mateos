var RemoteApi = require("live-remote-api").RemoteApi;


RemoteApi.onOpen(function () {
    window.addEventListener("load", metronome.init);
})

var audioContext = null;
// the canvas element
var canvas;
// canvasContext is the canvas' context 2D
var canvasContext;
// The Web Worker used to fire timer messages
var timerWorker = null;


var metronome = {
    // Are we currently playing?
    isPlaying: false,
    // What note is currently last scheduled?
    current16thNote: null,
    // tempo (in beats per minute)
    tempo: 120.0,
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
        //console.log("next note " + this.current16thNote);
        // Advance current note and time by a 16th note...
        // Notice this picks up the CURRENT tempo value to calculate beat length.
        var secondsPerBeat = 60.0 / this.tempo;
        // Add beat length to last beat time
        this.nextNoteTime += 0.25 * secondsPerBeat;

        this.current16thNote++;    // Advance the beat number, wrap to zero
        if (this.current16thNote > 16) {

            this.compass++;
            if (this.compass > 4) {
                this.compass = 1;
            }

            this.current16thNote = 1;

        }
    },

    scheduleNote: function (beatNumber, time) {
        // push the note on the queue, even if we're not playing.
        this.notesInQueue.push({note: beatNumber, time: time});
        //
        // if ((this.noteResolution == 1) && (beatNumber % 2))
        //     return; // we're not playing non-8th 16th notes
        // if ((this.noteResolution == 2) && (beatNumber % 4))
        //     return; // we're not playing non-quarter 8th notes


        //$("#beat-counter").text("beat number: " + beatNumber);


        if ((beatNumber % 8) == 0) {
            $(".ui-tempo").removeClass("active");

            const uiStep = (this.compass - 1) * 2 + Math.round(beatNumber / 8);

            console.log(uiStep);

            $('.ui-tempo[beat=' + uiStep + ']').addClass("active");

            if($( ".ui-kick.selected[beat=" + uiStep + "]" ).length){
                RemoteApi.create("live_set tracks 1 clip_slots 0", function (err, api) {
                   api.call('fire');
                });
            }else{
                RemoteApi.create("live_set tracks 1 clip_slots 0", function (err, api) {
                    api.call('stop');
                });
            }

            if($( ".ui-snare.selected[beat=" + uiStep + "]" ).length){
                RemoteApi.create("live_set tracks 2 clip_slots 0", function (err, api) {
                    api.call('fire');
                });
            }else{
                RemoteApi.create("live_set tracks 2 clip_slots 0", function (err, api) {
                    api.call('stop');
                });
            }

            if($( ".ui-hihat.selected[beat=" + uiStep + "]" ).length){
                RemoteApi.create("live_set tracks 3 clip_slots 0", function (err, api) {
                    api.call('fire');
                });
            }else{
                RemoteApi.create("live_set tracks 3 clip_slots 0", function (err, api) {
                    api.call('stop');
                });
            }
        }


        //  RemoteApi.create("live_set tracks 1 clip_slots 0", function (err, api) {
        //      api.call('stop');
        //  });


    },

    scheduler: function () {
        // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
        while (this.nextNoteTime < audioContext.currentTime + this.scheduleAheadTime) {
            // console.log("schedule note beat: " + this.current16thNote + " time: " + this.nextNoteTime);
            this.scheduleNote(this.current16thNote, this.nextNoteTime);
            this.nextNote();
        }
    },

    play: function () {
        this.isPlaying = !this.isPlaying;
        if (this.isPlaying) { // start playing
            this.current16thNote = 0;
            timerWorker.postMessage("start");

            return "stop";
        } else {
            timerWorker.postMessage("stop");

            return "play";
        }
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
        var currentNote = this.last16thNoteDrawn;
        //var currentTime = this.audioContext.currentTime;

        while (metronome.notesInQueue.length && metronome.notesInQueue[0].time < this.currentTime) {
            currentNote = this.notesInQueue[0].note;
            this.notesInQueue.splice(0, 1);   // remove note from queue
        }

        // We only need to draw if the note has moved.
        if (this.last16thNoteDrawn != currentNote) {


            // var x = Math.floor( canvas.width / 18 );
            // canvasContext.clearRect(0,0,canvas.width, canvas.height);
            // for (var i=0; i<16; i++) {
            // canvasContext.fillStyle = ( currentNote == i ) ?
            // ((currentNote%4 === 0)?"red":"blue") : "black";
            // canvasContext.fillRect( x * (i+1), x, x/2, x/2 );
            // }
            this.last16thNoteDrawn = currentNote;
        }

        // set up to draw again
        requestAnimFrame(metronome.draw);
    },

    init: function () {
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
        var playButton = document.createElement('div');
        $(playButton).addClass('play').click(metronome.play).text("play").appendTo($("body"));


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


