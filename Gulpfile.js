// Load requirements
const gulp = require('gulp');
const gutil = require('gulp-util');

const _ = require('lodash');
const log = gutil.log;
const colors = gutil.colors;

const plumber = require('gulp-plumber');
const del = require('del');
const path = require('path');

// Help dialog
const argv = require('yargs')
    .usage('Usage: gulp <command> [options]')
    .command('build', 'Build the entire solution out')
    .command('build.scripts', 'Build only javascripts')
    .command('build.css', 'Build only stylesheets')
    .command('build.html', 'Build only html template cache')
    .command('watch', 'Watch for changes and rebuild')
    .command('watch.scripts', 'Watch for changes in javascripts and rebuild')
    .command('watch.css', 'Watch for changes in stylesheets and rebuild')
    .command('watch.html', 'Watch for changes in html templates and rebuild')
    .alias('p', 'production')
    .describe('production', 'Builds production ready code')
    .example('gulp', 'The default is to build out everything and watch for changes')
    .help('h')
    .alias('h', 'help')
    .epilog('copyright 2016')
    .argv;

const buildTypescript = require('./tasks/gulp-typescript');
//require('./tasks/gulp-templates');
//require('./tasks/gulp-scss');


/************************************************
 * Render header
 ***********************************************/
log(colors.green('Building application'), _.concat(argv._, (argv.production ? ['production'] : [])));
log(colors.green('-------------------------------------'));

(function() {

    gulp.task('clean', function() {
        return del('dist/**/*');
    });

    /****************************************
     * Build Javascript
     ****************************************/
    let shouldMinify = argv.production || argv.test;
    let isWatchingScripts = false;

    gulp.task('build.scripts', ['clean'], function(done) {
        var path = require('path');
        var cliBuildFile = 'angular-cli-build.js';
        var cliBuildFilePath = path.join(process.cwd(), cliBuildFile);
        console.log('Loading buildfile: ' + cliBuildFilePath);

        require('typescript-require')();

        process.env.CLI_ROOT = path.join(path.dirname(require.resolve('angular-cli')), '../..');

        var tree = require(cliBuildFilePath);
        return tree(require('./angular-cli.json')).build()
            .then(function(output) {
                console.log('Done!');
                //mkdirp.sync(path.join(dest, '..'));
                copyDereferenceSync(output.directory, './dist');
                done();
                return output;
            });
    });

    gulp.task('watch.scripts', function() {
        isWatchingScripts = true;
    });


    /****************************************
     * Other tasks
     ****************************************/
    gulp.task('build', ['build.scripts', 'build.css', 'build.html']);
    gulp.task('watch', ['watch.scripts', 'watch.css', 'watch.html']);
    gulp.task('default', ['build', 'watch']);
})();