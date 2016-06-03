/// <reference path="../typings/main.d.ts" />
/// <reference path="../typings/index.d.ts" />
"use strict";

// Module dependencies
import favicon = require('serve-favicon');
import cookieParser = require('cookie-parser');
import methodOverride = require('method-override');
import logger = require('morgan');

import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs';

/**
 * The server.
 *
 * @class Server
 */
class Server {

    public app: express.Application;
    //private router: express.Router = express.Router();

    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
     */
    public static bootstrap(): Server {
        console.log('Creating Server');
        return new Server();
    }

    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {
        //create expressjs application
        this.app = express();

        //configure application
        this.config();

        //configure routes
        this.routes();
    }

    /**
     * Configure application
     *
     * @class Server
     * @method config
     * @return void
     */
    private config(): void {
        //configure jade
        //this.app.set('views', path.join(__dirname, 'views'));
        //this.app.set('view engine', 'jade');

        this.app.use(favicon(path.join(__dirname, '../dist', 'favicon.ico')));

        //mount logger
        this.app.use(logger('dev'));

        //mount json form parser
        this.app.use(bodyParser.json());

        //mount query string parser
        this.app.use(bodyParser.urlencoded({ extended: false }));

        this.app.use(methodOverride());
        this.app.use(cookieParser());

        //add static paths
        this.app.use(express.static(path.join(__dirname, '../dist')));

        // catch 404 and forward to error handler
        this.app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
            var error = new Error('Not Found');
            err.status = 404;
            next(err);
        });
    }

    /**
     * Configure routes
     *
     * @class Server
     * @method routes
     * @return void
     */
    private routes() {
        // Load up routes
        require('./routes/api/index').default(this.app, '/api');
    }
}

var server = Server.bootstrap();
export = server.app;
