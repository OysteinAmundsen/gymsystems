'use strict';

// Load requirements
const gulp        = require('gulp');
const htmlmin     = require('gulp-html-minifier');
const ngHtml2Js   = require('gulp-ng-html2js');
const dedent      = require('dedent');
const concat      = require('gulp-concat');
const tap         = require('gulp-tap');
const browserSync = require('browser-sync');

/****************************************
 * Build template cache
 ****************************************/
gulp.task('build.html', function () {
    let minify  = htmlmin({                         // Minify HTML, stripping away everything not code
        removeComments            : true,
        removeCommentsFromCDATA   : true,
        collapseWhitespace        : true,
        preserveLineBreaks        : false,
        removeScriptTypeAttributes: true,
        minifyJS                  : true,
        minifyCSS                 : true
    });
    let fileTap = tap(function (file) {             // Insert file header, contents and footer
        file.contents = new Buffer(_.template(
            dedent(`/* global angular */
                    (function () {
                        'use strict';

                        angular.module('<%=moduleName %>', [])
                            .run(['$templateCache', function ($templateCache) {
                    <%=contents %>
                            }]);
                    })();`))({moduleName: moduleName, contents: file.contents}));
    });
    return gulp.src('./client/app/**/*.html')
        .pipe(minify)
        .pipe(ngHtml2Js({                           // Puts each file in a $templateCache key/value store
            template: `$templateCache.put('<%= template.url %>', '<%=(template.escapedContent).replace(/  /g, '') %>');`,
            prefix  : 'views'
        }))
        .pipe(concat('main.tpls.js'))               // Concatenate them into one single file
        .pipe(fileTap)
        .pipe(gulp.dest('public/scripts'));         // Output
});

gulp.task('watch.html', function () {
    gulp.watch('./client/app/*.html', ['html'])
        .on('change', browserSync.reload);          // Watch html files
});
