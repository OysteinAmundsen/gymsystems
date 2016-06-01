/* global require, module */

var pickFiles = require('broccoli-static-compiler');
var mergeTrees = require('broccoli-merge-trees');
var Angular2App = require('angular-cli/lib/broccoli/angular2-app');

module.exports = function(defaults) {
  var fontTree = pickFiles('./bower_components/font-awesome/fonts', {
    srcDir: '/',
    files: ['*'],
    destDir: '/fonts'
  });

  var imagesTree = pickFiles('./src/images', {
    srcDir: '/',
    files: ['*'],
    destDir: '/images'
  });

  var app = new Angular2App(defaults, {
    vendorNpmFiles: [
      'systemjs/dist/system-polyfills.js',
      'systemjs/dist/system.src.js',
      'zone.js/dist/*.js',
      'es6-shim/es6-shim.js',
      'reflect-metadata/*.js',
      'rxjs/**/*.js',
      '@angular/**/*.js' 

      // Third party libs
    ]
  });

  return mergeTrees([app.toTree(), fontTree]);
};
