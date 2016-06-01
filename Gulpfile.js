// Load requirements
const gulp    = require('gulp');
const gutil   = require('gulp-util');
const plumber = require('gulp-plumber');

const _      = require('lodash');
const log    = gutil.log;
const colors = gutil.colors;

const concat      = require('gulp-concat');
const tap         = require('gulp-tap');
const browserSync = require('browser-sync');

const uglify     = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const ts         = require('gulp-typescript');
const tsify      = require('tsify');
const watchify   = require('watchify');
//const browserify = require('browserify');
const Builder    = require('systemjs-builder');

const source     = require('vinyl-source-stream');
const buffer     = require('vinyl-buffer');

const htmlmin   = require('gulp-html-minifier');
const ngHtml2Js = require('gulp-ng-html2js');
const dedent    = require('dedent');

const sass    = require('gulp-sass');
const cssnano = require('gulp-cssnano');

// Help dialog
const argv = require('yargs')
    .usage('Usage: gulp <command> [options]')
    .command('build',           'Build the entire solution out')
    .command('build.scripts',   'Build only javascripts')
    .command('build.css',       'Build only stylesheets')
    .command('build.html',      'Build only html template cache')
    .command('watch',           'Watch for changes and rebuild')
    .command('watch.scripts',   'Watch for changes in javascripts and rebuild')
    .command('watch.css',       'Watch for changes in stylesheets and rebuild')
    .command('watch.html',      'Watch for changes in html templates and rebuild')
    .alias('p', 'production')
    .describe('production', 'Builds production ready code')
    .example('gulp', 'The default is to build out everything and watch for changes')
    .help('h')
    .alias('h', 'help')
    .epilog('copyright 2016')
    .argv;

require('./tasks/gulp-typescript');
require('./tasks/gulp-templates');
require('./tasks/gulp-scss');


/************************************************
 * Render header
 ***********************************************/
log(colors.green('Building application'), _.concat(argv._, (argv.production ? ['production'] : [])));
log(colors.green('-------------------------------------'));

(function () {

    /****************************************
     * Build Javascript
     ****************************************/
    let shouldMinify      = argv.production || argv.test;
    let isWatchingScripts = false;
/*
    let bundler           = browserify({
        basedir     : '.',
        debug       : true,
        entries     : ['client/app/main.ts'],
        cache       : {},
        packageCache: {}
    }).plugin(tsify);
*/

    function bundle (done) {
        let builder = new Builder('./', './systemjs.conf.js');
        builder.bundle('client/app/main.ts', 'public/scripts/main.js', {
            normalize: true,
            minify: true,
            mangle: true,
            globalDefs: { DEBUG: false }
        }).then(function () {
            done();
        });
/*
        return bundler
            .bundle().on('error', handleErrors)
            .pipe(source('main.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(gulpif(shouldMinify, uglify()))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('public/scripts'))
            .pipe(gulpif(isWatchingScripts, browserSync.reload({stream: true})));
*/
    }

    gulp.task('build.scripts', function (done) {
        return bundle(done);
    });

    gulp.task('watch.scripts', function () {
/*
        bundler           = watchify(bundler);
        isWatchingScripts = true;
        bundler.on('update', bundle);
        bundler.on('log', log);
*/
    });


    /****************************************
     * Other tasks
     ****************************************/
    gulp.task('build',   ['build.scripts', 'build.css', 'build.html']);
    gulp.task('watch',   ['watch.scripts', 'watch.css', 'watch.html']);
    gulp.task('default', ['build', 'watch']);
})();
