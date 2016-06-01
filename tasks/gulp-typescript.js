'use strict';

const gulp              = require('gulp');
const gulpIf            = require('gulp-if');
const path              = require('path');
const tslint            = require('gulp-tslint');
const preprocess        = require('gulp-preprocess');
const inlineNg2Template = require('gulp-inlineNg2Template');
const sourcemaps        = require('gulp-sourcemaps');
const uglify            = require('gulp-uglify');
const size              = require('gulp-size');
const watchify          = require('watchify');
const typescript        = require('typescript');

const env = require('./../gulpfile.env');

const project = typescript.createProject('tsconfig.json', {
    typescript,
    outFile: env.isProd ? 'main.js' : undefined
});

module.export = function typescript () {
    let root = 'client/app';
    let glob = root + '/**/!(*.spec).ts';
    let dest = 'public/scripts';

    return gulp.src(glob, {since: gulp.lastRun('typescript')})
        .pipe(tslint())
        .pipe(tslint.report('verbose'))
        .pipe(preprocess({context: env}))
        .pipe(inlineNg2Template({useRelativePaths: true}))
        .pipe(gulp.src(env.typings, {passthrough: true}))
        .pipe(gulpIf(env.isDev, sourcemaps.init()))
        .pipe(typescript(project)).js
        .pipe(gulpIf(env.isProd, uglify({mangle: false})))
        .pipe(gulpIf(env.isDev, sourcemaps.write({
            sourceRoot: path.join(process.cwd(), root)
        })))
        .pipe(size({title: 'typescript'}))
        .pipe(gulp.dest(dest))
        .pipe(connect.reload());
}
