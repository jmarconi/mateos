// "use strict";
//
// var RemoteApi = require("live-remote-api").RemoteApi;
// var params = require("live-remote-params").params ;
// var $ = require("jquery");
//
// RemoteApi.onOpen(function() {
// 	RemoteApi.create("live_set master_track mixer_device volume", function(err, api) {
// 		var slider = new params.Slider()
// 		slider.api(api)
// 		$(document.body).append(slider.div())
// 	})
// 	RemoteApi.create("live_set tracks 1 mixer_device track_activator", function(err, api) {
// 		var t = new params.Toggle()
// 		t.api(api)
// 		$(document.body).append(t.div())
// 	})
//
// 	RemoteApi.create("live_set tracks 2 mixer_device track_activator", function(err, api) {
// 		var t = new params.Toggle()
// 		t.api(api)
// 		$(document.body).append(t.div())
// 	})
//
// 	RemoteApi.create("live_set tracks 3 mixer_device track_activator", function(err, api) {
// 		var t = new params.Toggle()
// 		t.api(api)
// 		$(document.body).append(t.div())
// 	})
//
//
// })