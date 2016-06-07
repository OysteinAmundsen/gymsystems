'use strict';

const gulp        = require('gulp');
const gulpIf      = require('gulp-if');
const path        = require('path');
const sassLint    = require('gulp-sass-lint');
const sass        = require('gulp-sass');
const sourcemaps  = require('gulp-sourcemaps');
const size        = require('gulp-size');
const browserSync = require('browser-sync');
const cssnano     = require('gulp-cssnano');

const env = require('./../gulpfile.env');

let isWatchingStyles = false;

/****************************************
 * Build stylesheets
 ****************************************/
gulp.task('build.css', function () {
    return gulp.src('./client/**/*.scss')
        .pipe(sassLint({config: '.sass-lint.yml'}))
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
        .pipe(gulpIf(env.isDev, sourcemaps.init()))
        .pipe(sass().on('error', require('./errorHandler')))
        .pipe(gulpIf(!env.isDev, cssnano()))
        .pipe(gulpIf(env.isDev, sourcemaps.write()))
        .pipe(size({title: 'sass'}))
        .pipe(gulp.dest('public/stylesheets'))
        .pipe(gulpIf(isWatchingStyles, browserSync.stream()));
});

gulp.task('watch.css', function () {
    isWatchingStyles = true;
    gulp.watch('./client/**/*.scss', ['build.css']);// Watch .scss files
});
