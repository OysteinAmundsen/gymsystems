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

import * as apiRoutes from './routes/api';

/**
 * The server.
 *
 * @class Server
 */
export class Server {

    public app: express.Express;

    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
     */
    public static bootstrap(app?: express.Express): Server {
        console.log('Creating Server');
        return new Server(app);
    }

    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor(app?: express.Express) {
        //create expressjs application
        this.app = app || express();

        //configure application
        this.config();
    }

    /**
     * Configure application
     *
     * @class Server
     * @method config
     * @return void
     */
    private config(): void {
        // Determine if we are in standalone mode or going through ng dev mode
        var base = (__dirname.indexOf('dist') > -1 ? '..' : '../dist');
        var clientDir = '/client';

        //configure jade
        //this.app.set('views', path.join(__dirname, 'views'));
        //this.app.set('view engine', 'jade');
        this.app.use(favicon(path.join(__dirname, base + clientDir, 'favicon.ico')));

        //mount logger
        this.app.use(logger('dev'));

        //mount json form parser
        this.app.use(bodyParser.json());

        //mount query string parser
        this.app.use(bodyParser.urlencoded({ extended: false }));

        this.app.use(methodOverride());
        this.app.use(cookieParser());

        //add static paths
        this.app.use(express.static(path.join(__dirname, base + clientDir)));

        // Load up routes
        apiRoutes.default(this.app, '/api');

        // Setup base route to everything else
        this.app.get('/*', function (req: express.Request, res: express.Response, next: express.NextFunction) {
            if (!/^\/api/.test(req.url) && !/.js.map$/.test(req.url)) {
                console.log(' ... Loading index.html: url - ' + req.url);
                res.sendFile(path.resolve(path.join(__dirname, base + clientDir), 'index.html'));
            } else {
                return next();
            };
        });
    }
}
