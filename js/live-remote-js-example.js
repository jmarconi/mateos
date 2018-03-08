"use strict"

var RemoteApi = require("live-remote-api").RemoteApi  
var params = require("live-remote-params").params  
var $ = require("jquery")  

RemoteApi.onOpen(function() {  
	// RemoteApi.create("live_set tracks 3 mixer_device panning", function(err, api) {  
		// var knob = new params.PanKnob()  
		// knob.api(api)  
		// $(document.body).append(knob.div())  
	// })

	// RemoteApi.create("live_set master_track mixer_device cue_volume", function(err, api) {  
		// var knob = new params.Knob()  
		// knob.api(api)  
		// $(document.body).append(knob.div())  
	// })  

	// RemoteApi.create("live_set master_track mixer_device crossfader", function(err, api) {  
		// var knob = new params.HSlider()  
		// knob.api(api)  
		// $(document.body).append(knob.div())  
	// })  

	RemoteApi.create("live_set master_track mixer_device volume", function(err, api) {
		var slider = new params.Slider()
		slider.api(api)
		$(document.body).append(slider.div())
	})
	RemoteApi.create("live_set tracks 1 mixer_device track_activator", function(err, api) {
		var t = new params.Toggle()
		t.api(api)
		$(document.body).append(t.div())
	})

	RemoteApi.create("live_set tracks 2 mixer_device track_activator", function(err, api) {
		var t = new params.Toggle()
		t.api(api)
		$(document.body).append(t.div())
	})

	RemoteApi.create("live_set tracks 3 mixer_device track_activator", function(err, api) {
		var t = new params.Toggle()
		t.api(api)
		$(document.body).append(t.div())
	})

	RemoteApi.create("live_set tracks 1 clip_slots 0", function(err, api) {
		// RemoteApi.call('fire');
		//  var t = new params.Toggle()
		//  t.api(api)
		//  $(document.body).append(t.div())
	})
	// Similarly, to access the fourth clip on Track 3, the path would be:

	
	
	
	// RemoteApi.create("live_set tracks 3 mixer_device volume", function(errY, apiY) {
		// RemoteApi.create("live_set tracks 3 mixer_device panning", function(err, api) {
			// var pad = new params.XYPad()
			// pad.api(api)
			// pad.apiY(apiY)
			// $(document.body).append(pad.div())
			
		// })
	// })
})