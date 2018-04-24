var RemoteApi = require("live-remote-api").RemoteApi;
import {jQuery} from 'jquery';
import {MateosUi} from './MateosUi';

window.MateosUi = MateosUi;
// window.jQuery = jQuery;
RemoteApi.onOpen(function () {
    window.RemoteApi = RemoteApi;
    window.addEventListener("load", game.init);
});

var states = {
    'solid': {
        color: 'yellow'
    },
    'liquid': {
        color: 'blue'
    },
    'melting': {
        color: 'orange'
    },
    'freezing': {
        color: 'purple'
    },
    'vaporization': {
        color: 'orange'
    },
    'gas': {
        color: 'gray'
    },
    'sublimation': {
        color: 'orange'
    },
    'condensation': {
        color: 'purple'
    },
    'deposition': {
        color: 'purple'
    },
    'deionization': {
        color: 'purple'
    },
    'ionization': {
        color: 'orange'
    },
    'plasma': {
        color: 'black'
    },
};

window.states = states;

var points = {
    1: {
        'row': 4,
        'column': 4,
        'next': [2],
        'state': 'solid',
        'transition': false,
        'clips': [
            {
                'track': 1,
                'scenes': [1]
            },
            {
                'track': 40,
                'scenes': [1]
            }
        ],
    },
    2: {
        'row': 3,
        'column': 5,
        'next': [3],
        'state': 'solid',
        'transition': false,
        'clips': [
            {
                'track': 4,
                'scenes': [1]
            },

        ],
    },
    3: {
        'row': 5,
        'column': 5,
        'next': [4, 13],
        'state': 'solid',
        'transition': false,
        'clips': [
            {
                'track': 9,
                'scenes': [1]
            },

        ],
    },
    4: {
        'row': 5,
        'column': 3,
        'next': [5],
        'state': 'solid',
        'transition': false,
        'clips': [
            {
                'track': 8,
                'scenes': [1]
            },
        ],
    },
    5: {
        'row': 3,
        'column': 3,
        'next': [6],
        'state': 'solid',
        'transition': false,
        'clips': [
            {
                'track': 7,
                'scenes': [1]
            },
        ],
    },
    6: {
        'row': 2,
        'column': 2,
        'next': [7],
        'state': 'melting',
        'transition': true,
        'clips': [
            {
                'track': 13,
                'scenes': [5]
            },
        ],
    },
    7: {
        'row': 1,
        'column': 3,
        'next': [8],
        'state': 'liquid',
        'transition': false,
        'clips': [
            {
                'track': 39,
                'scenes': [6]
            },
        ],
    },
    8: {
        'row': 1,
        'column': 5,
        'next': [9],
        'state': 'liquid',
        'transition': false,
        'clips': [
            {
                'track': 16,
                'scenes': [6]
            },
        ],
    },
    9: {
        'row': 1,
        'column': 7,
        'next': [10, 11],
        'state': 'liquid',
        'transition': false,
        'clips': [
            {
                'track': 17,
                'scenes': [6, 7, 8, 9]
            },
            {
                'track': 18,
                'scenes': [6, 7, 8, 9]
            },
            {
                'track': 19,
                'scenes': [6, 7, 8, 9]
            },
            {
                'track': 20,
                'scenes': [6, 7, 8, 9]
            },
        ],
    },
    10: {
        'row': 2,
        'column': 6,
        'next': [2],
        'state': 'freezing',
        'transition': true,
        'clips': [
            {
                'track': 14,
                'scenes': [6]
            },
        ],
    },
    11: {
        'row': 3,
        'column': 7,
        'next': [12],
        'state': 'vaporization',
        'transition': true,
        'clips': [
            {
                'track': 11,
                'scenes': [10]
            },
        ],
    },
    12: {
        'row': 5,
        'column': 7,
        'next': [14],
        'state': 'gas',
        'transition': false,
        'clips': [
            {
                'track': 40,
                'scenes': [11]
            },
        ],
    },
    13: {
        'row': 6,
        'column': 6,
        'next': [12],
        'state': 'sublimation',
        'transition': true,
        'clips': [
            {
                'track': 11,
                'scenes': [5]
            },
        ],
    },
    14: {
        'row': 7,
        'column': 7,
        'next': [15, 20],
        'state': 'gas',
        'transition': false,
        'clips': [
            {
                'track': 34,
                'scenes': [11, 12, 13, 14, 15]
            },
            {
                'track': 35,
                'scenes': [11, 12, 13, 14, 15]
            },
            {
                'track': 36,
                'scenes': [11, 12, 13, 14, 15]
            },
            {
                'track': 37,
                'scenes': [11, 12, 13, 14, 15]
            },
        ],
    },
    15: {
        'row': 7,
        'column': 5,
        'next': [16],
        'state': 'gas',
        'transition': false,
        'clips': [
            {
                'track': 23,
                'scenes': [11, 12, 13]
            },
            {
                'track': 24,
                'scenes': [11, 12, 13]
            },
            {
                'track': 25,
                'scenes': [11, 12, 13]
            },
            {
                'track': 26,
                'scenes': [11, 12, 13]
            },
            {
                'track': 27,
                'scenes': [11, 12, 13]
            },
            {
                'track': 28,
                'scenes': [11, 12, 13]
            },
            {
                'track': 29,
                'scenes': [11, 12, 13]
            },
            {
                'track': 30,
                'scenes': [11, 12, 13]
            },
        ],
    },
    16: {
        'row': 7,
        'column': 3,
        'next': [17, 18],
        'state': 'gas',
        'transition': false,
        'clips': [
            {
                'track': 31,
                'scenes': [11]
            },
        ],
    },
    17: {
        'row': 7,
        'column': 1,
        'next': [20],
        'state': 'condensation',
        'transition': true,
        'clips': [
            {
                'track': 12,
                'scenes': [10]
            },
        ],
    },
    18: {
        'row': 6,
        'column': 2,
        'next': [4],
        'state': 'deposition',
        'transition': true,
        'clips': [
            {
                'track': 12,
                'scenes': [5]
            },
        ],
    },
    19: {
        'row': 5,
        'column': 1,
        'next': [],
        'state': 'deionization',
        'transition': true,
        'clips': [
            {
                'track': 31,
                'scenes': [14, 15]
            },
        ],
    },
    20: {
        'row': 1,
        'column': 1,
        'next': [21],
        'state': 'ionization',
        'transition': true,
        'clips': [
            {
                'track': 13,
                'scenes': [15]
            },
        ],
    },
    21: {
        'row': 3,
        'column': 1,
        'next': [19],
        'state': 'plasma',
        'transition': true,
        'clips': [
            {
                'track': 1,
                'scenes': [1]
            },
            {
                'track': 4,
                'scenes': [1]
            },
            {
                'track': 7,
                'scenes': [16]
            },
            {
                'track': 8,
                'scenes': [1]
            },
            {
                'track': 9,
                'scenes': [1]
            },
            {
                'track': 16,
                'scenes': [6]
            },
            {
                'track': 23,
                'scenes': [11]
            },
            {
                'track': 24,
                'scenes': [11, 12, 13]
            },
            {
                'track': 25,
                'scenes': [11]
            },
            {
                'track': 26,
                'scenes': [11]
            },
            {
                'track': 27,
                'scenes': [11, 12, 13]
            },
            {
                'track': 28,
                'scenes': [11, 12, 13]
            },
            {
                'track': 29,
                'scenes': [11]
            },
            {
                'track': 30,
                'scenes': [11, 12, 13]
            },
            {
                'track': 31,
                'scenes': [16]
            },
            {
                'track': 34,
                'scenes': [11, 12, 13]
            },
            {
                'track': 35,
                'scenes': [11, 12, 13]
            },
            {
                'track': 36,
                'scenes': [11, 12, 13]
            },
            {
                'track': 37,
                'scenes': [11, 12, 13]
            },
            {
                'track': 41,
                'scenes': [16]
            },

        ],
    },
};

window.points = points;


var game = {
    executeTransition: function(next, number)
    {
        game.stopClips();
        let seconds = 20;
        MateosUi.blockElement(seconds);
        setTimeout(function(){
            MateosUi.hidePoints();
            MateosUi.showPoint(next);
            game.playPoint(next);
        },1000 * seconds);
    },

    playPoint: function (number) {
        let point = window.points[number];
        if(point.transition){
            MateosUi.hidePoints();
            MateosUi.showPoint(number);
            game.executeTransition(point.next[0],number);
        }else{
            MateosUi.hidePoints();
            $.each(point.next, function (i, number) {
                MateosUi.showPoint(number);
            });
        }
        $.each(point.clips, function (i, clip) {
            let scene = clip.scenes[Math.floor(Math.random() * clip.scenes.length)];
            game.fireClip(clip.track,scene);
        });
    },


    play: function () {
        game.reset();
    },

    doPlay: function () {
        RemoteApi.create("live_set", function (err, api) {
            api.call("start_playing");
        });

        MateosUi.play();

        return true;
    },


    //on stop we reset tempo on client and live
    stopClips: function () {
        RemoteApi.create("live_set", function (err, api) {
            //api.call("stop_playing");
            api.call("stop_all_clips");
            //api.set("current_song_time", 0);
        });

        return false;
    },


    fireClip: function (channel, scene) {
        scene = scene - 1;
        RemoteApi.create("live_set tracks " + channel + "  clip_slots " + scene, function (err, api) {
            api.call('fire');
        })

    },

    draw: function () {

    },


    init: function () {
        MateosUi.init(points, states);

        // // if we wanted to load audio files, etc., this is where we should do it.
        console.log("init");


    }
};


window.game = game;
