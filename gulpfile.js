"use strict"

var gulp = require('gulp');
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var buffer = require("vinyl-buffer")
var glob = require("glob")


gulp.task("default", function() {
	gulp.watch("js/**/*.js", ["browserify"])
	gulp.start("browserify")
	return copyCss()
})

function copyCss() {
	return gulp.src("node_modules/live-remote-params/target/css/params.css")
	.pipe(gulp.dest("target"))
}

gulp.task("browserify", function() {
	return browserify()
	.add(glob.sync("./js/**/*.js"))
	.bundle()
	.on("error", function(e) {
		console.log("Error in browserify: " + e.message)
	})
	// .pipe(source("live-remote-js-example.js","metronome.js"))
	.pipe(source("live-remote-js-example.js"))
	.pipe(gulp.dest("target"))
})
