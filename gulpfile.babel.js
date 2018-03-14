"use strict"

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var buffer = require("vinyl-buffer")
var glob = require("glob")


gulp.task("default", function () {
    gulp.watch("js/**/*.js", ["browserify"])
    gulp.watch("scss/**/*.scss", ["compilescss"])
    gulp.start("browserify")
    gulp.start("compilescss")
});

gulp.task("compilescss", function () {
    return gulp.src("scss/**/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("target"))
});

gulp.task("browserify", function () {
    return browserify({ transform: ['babelify'] })
        .add(glob.sync("./js/**/*.js"))
        .bundle()
        .on("error", function (e) {
            console.log("Error in browserify: " + e.message)
        })
        .pipe(source("live-remote-js-example.js"))
        .pipe(gulp.dest("target"))
});
