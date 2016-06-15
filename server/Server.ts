"use strict";

// Module dependencies
import * as path from 'path';
import * as fs from 'fs';
import * as express from 'express';
import * as favicon from 'serve-favicon';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as methodOverride from 'method-override';
//import * as logMiddleWare from 'bunyan-middleware';
import * as logMiddleWare from 'morgan';
import * as Logger from "bunyan";
import * as passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";

import {SequelizeStorageManager} from './storage/index.ts';
import * as apiRoutes from './routes/api';

/**
 * The server.
 *
 * @class Server
 */
export class Server {

    public app: express.Express;
    private storage:SequelizeStorageManager;
    private log:Logger.Logger;

    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
     */
    public static bootstrap(app?: express.Express): Server {
        return new Server(app);
    }

    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor(app?: express.Express) {
        // Create logger
        this.createLogger();

        //create expressjs application
        this.app = app || express();

        // configure application
        this.config();
    }

    /**
     *
     */
    private createLogger() {
        this.log = Logger.createLogger({
            name: 'gymsys',
            streams: [
                { level: 'trace',   stream: process.stdout },
                { level: 'info',    stream: process.stdout },
                {
                    level: 'debug',
                    type: 'rotating-file',
                    path: './log/debug.log',
                    period: '1d',   // daily rotation
                    count: 3        // keep 3 back copies}
                },
                {
                    level: 'error',
                    type: 'rotating-file',
                    path: './log/error.log',
                    period: '1d',   // daily rotation
                    count: 3        // keep 3 back copies}
                }
            ]
        });
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
        var clientPath = path.join(__dirname, base + '/client');
        var me = this;

        // Setup authentication
        passport.use(new LocalStrategy(
            function(username:string, password:string, done:any) {
                done();
            }
        ));

        me.app.set('view options', {pretty: false});
        me.app.set("etag", false);
        me.app.disable("x-powered-by");
        me.app.set('trust proxy', true);                          // Listen for external requests

        me.app.use(bodyParser.json());                            // mount json form parser
        me.app.use(bodyParser.urlencoded({ extended: false }));   // mount query string parser
        me.app.use(methodOverride());                             // Enforce HTTP verbs
        me.app.use(cookieParser());                               // populate req.cookies

        // mount logger middleware
        // me.app.use(logMiddleWare({
        //     headerName: 'X-Request-Id', propertyName: 'reqId', logName: 'req_id', obscureHeaders: [], logger: this.log
        // }));
        //var accessLogStream = fs.createWriteStream('./log/access.log', {flags: 'a'})
        me.app.use(logMiddleWare('dev'/*, {stream: accessLogStream}*/));

        // Set up storage
        me.storage = new SequelizeStorageManager({
            database: 'localhost',
            username: process.env.DB_USERNAME || 'root',
            password: process.env.DB_USERNAME || 'qwerty'
        }, me.log);
        me.storage.init();

        // Setup paths and routes
        me.app.use(express.static(clientPath));                   // Serve static paths
        me.app.use(favicon(path.join(clientPath, 'favicon.ico')));// Serve favicon

        // Load up routes
        apiRoutes.default(me.app, '/api');

        // Setup base route to everything else
        me.app.get('/*', function (req: express.Request, res: express.Response, next: express.NextFunction) {
            if (!/^\/api/.test(req.url)                             // Any route not starting with `/api`
             && !/(\.js|\.map|\.css)$/.test(req.url)) {             // nor ending in `.js` | `.map` | `.css`, will receive the index.html
                me.log.info(' ... Loading index.html: url - ' + req.url);
                res.sendFile(path.resolve(clientPath, 'index.html'));
            } else {
                return next();                                      // Procede to fetch requested resource or give 404 if non-existant
            };
        });
    }
}
