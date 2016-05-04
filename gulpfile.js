'use strict';

var gulp = require('gulp');  // Base gulp package
var babelify = require('babelify'); // Used to convert ES6 & JSX to ES5
var browserify = require('browserify'); // Providers "require" support, CommonJS
var rename = require('gulp-rename'); // Rename sources
var source = require('vinyl-source-stream'); // Vinyl stream support
var buffer = require('vinyl-buffer'); // Vinyl stream support
var watchify = require('watchify'); // Watchify for source changes
var merge = require('utils-merge'); // Object merge tool

// Completes the final file outputs
function bundle(bundler) {
    console.log('rebundling');
    bundler
        .bundle()
        .on('error', function(err){ console.error(err); }) // Map error reporting
        .pipe(source('index.js')) // Set source name
        .pipe(buffer()) // Convert to gulp pipeline
        .pipe(rename('walkthrough.min.js')) // Rename the output file
        .pipe(gulp.dest('dist/')) // Set the output folder
}
function bundleCreator(bundler) {
    console.log('rebundling creator');
    bundler
        .bundle()
        .on('error', function(err){ console.error(err); }) // Map error reporting
        .pipe(source('creator.js')) // Set source name
        .pipe(buffer()) // Convert to gulp pipeline
        .pipe(rename('walkthrough-creator.min.js')) // Rename the output file
        .pipe(gulp.dest('dist/')) // Set the output folder
}

// Gulp task for build
gulp.task('scripts', function() {
    var args = merge(watchify.args, { debug: false }); // Merge in default watchify args with browserify arguments

    // Main
    var bundler = browserify('./src/index.js', args) // Browserify
        .plugin(watchify) //, { ignoreWatch: [] }) // Watchify to watch source file changes
        .transform(babelify, {
            presets: ['es2015', 'stage-0'],
            plugins: ['babel-root-import']
        });
    bundle(bundler); // Run the bundle the first time (required for Watchify to kick in)
    bundler.on('update', function() {
        bundle(bundler); // Re-run bundle on source updates
    });

    // Creator
    var bundlerCreator = browserify('./src/creator.js', args)
        .plugin(watchify)
        .transform(babelify, {
            presets: ['es2015', 'react'],
            plugins: ['babel-root-import']
        });
    bundleCreator(bundlerCreator);
    bundlerCreator.on('update', function() {
        bundleCreator(bundlerCreator);
    });
});

gulp.task('watch', ['scripts'], function(){});

gulp.task('default', ['watch']);