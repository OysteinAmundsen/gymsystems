// Angular-CLI build configuration
// This file lists all the node_modules files that will be used in a build
// Also see https://github.com/angular/angular-cli/wiki/3rd-party-libs

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

    var imagesTree = pickFiles('./client/images', {
        srcDir: '/',
        files: ['*'],
        destDir: '/images'
    });

    var buildConfig = require('./angular-cli.json');
    var app = new Angular2App(defaults, {
        vendorNpmFiles: buildConfig.vendorNpmFiles
    });

    return mergeTrees([app, fontTree]);
};
