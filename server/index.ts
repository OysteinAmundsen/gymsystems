// Module dependencies
import * as path from 'path';
import * as chalk from 'chalk';
import * as fs from 'fs';

// Express
import { Server } from 'http';
import * as e from 'express';
import Request = e.Request;
import Response = e.Response;

import * as serveStatic from 'serve-static';
import * as favicon from 'serve-favicon';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';

// Authentication
import * as auth from 'passport';

// Persistance
import 'reflect-metadata';
import { createConnection, useContainer, ConnectionOptions, getConnectionOptions } from 'typeorm';
import { useExpressServer } from 'routing-controllers';
import { Container } from 'typedi';
const rc = require('routing-controllers');

// Other
import { setupAuthentication } from './config/AuthenticationConfig';
import { SSEController } from './services/SSEController';
import { Log, OrmLog } from './utils/Logger';
import { ERROR_MESSAGES } from './messages';
import { NextFunction, ErrorRequestHandler } from 'express-serve-static-core';

/**
 * Our application starts here.
 *
 * @class Server
 */
export class GymServer {
  public app: e.Express;
  private port: number   = +process.env.PORT || 3000;
  public isTest: boolean = !!process.env.PRODUCTION; // false;
  private clientPath     = path.join(__dirname, './public');
  private configName: string;
  private ormConfig: ConnectionOptions;

  /**
   * Bootstrap the application.
   *
   * @param args
   */
  constructor(args: string[]) {
    this.isTest     = args.length > 2 && args[2] === 'test';
    this.configName = (args.length > 2) ? args[2] : 'default';

    useContainer(Container);    // setup typeorm to use typedi container
    rc.useContainer(Container); // setup routing-controllers to use typedi container.

    // Register this service to typeDI
    Container.set(GymServer, this);
  }

  /**
   * Server startup routine
   *
   * @returns {Promise<Server>}
   */
  async start(): Promise<Server> {
    // Read typeorm config and add our own Log
    this.ormConfig = await getConnectionOptions(this.configName);
    this.ormConfig = Object.assign(this.ormConfig, {
      name: 'default',                        // Rename configuration to 'default' as typeorm requires a default config
      logger: new OrmLog(this.ormConfig.logging) // Apply Log system to typeorm config
    });

    // Connect to database and startup Express
    Log.log.info('** Connecting to database and setting up schema');
    const connection = await createConnection(this.ormConfig);
    Log.log.info('** DB connected!');

    // Create Express server
    return this.createServer()
      .listen(this.port)  // Listen on provided port, on all network interfaces.
      .on('listening', () => {
        const url = chalk.blue.underline(`http://localhost:${this.port}/`);
        Log.log.debug(`Serving on ${url}`);
      })
      .on('error', (error: any) => Log.log.error((ERROR_MESSAGES[error.code] ? ERROR_MESSAGES[error.code] : error)));
  }

  /**
   * Creates and configures our Express container
   *
   * @returns {Express}
   */
  private createServer(): e.Express {
    this.app = e();

    Log.log.info('** Configuring server');
    this.app.set('trust proxy', true);  // Listen for external requests
    this.app.set('etag', false);
    this.app.disable('x-powered-by');   // Do not announce our architecture to the world!


    // Setup the following only if we are not running tests
    if (!this.isTest) {
      // Setup morgan access Log using winston
      this.app.use(morgan('combined', { stream: Log.stream }))
      // Setup static resources
      this.app.use(serveStatic(this.clientPath));

      // Favicon service
      const faviconPath = path.join(this.clientPath, 'favicon.ico');
      if (fs.existsSync(path.resolve(faviconPath))) {
        this.app.use(favicon(faviconPath));
      }
    }

    // Configure authentication services
    Log.log.info('** Setting up authentication services');
    this.app.use(cookieParser());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    const MemoryStore = require('session-memory-store')(session);
    const expiryInSeconds = 60 * 60 * 24; // Expires in 24 hours
    this.app.use(session({
      secret: 'mysecretkey',
      resave: true,
      saveUninitialized: true,
      store: new MemoryStore({
        expires: expiryInSeconds,
        checkperiod: 10 * 60}
      ),
      cookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: expiryInSeconds * 1000
      }
    }));
    const passport = setupAuthentication(this.app);

    // Setup routing-controllers
    Log.log.info('** Setting up REST endpoints');
    useExpressServer(this.app, {
      cors: true,
      routePrefix: '/api',
      controllers: [__dirname + '/controllers/*.js'],
      middlewares: [__dirname + '/middlewares/*.js'],
      interceptors: [__dirname + '/interceptors/*.js']
    });

    this.app.use(this.globalErrorHandler);

    // Registerring custom SSE controller
    // (because Server Sent Events does not play nicely with routing-controllers)
    const sse = new SSEController();
    // this.app.use('/api/event', sse.connect);

    // Setup base route to everything else
    if (!this.isTest) {
      this.app.get('/*', (req: e.Request, res: e.Response) => {
        res.sendFile(path.resolve(this.clientPath, 'index.html'));
      });
    }
    return this.app;
  }

  private globalErrorHandler(err: any, req: Request, res: Response, next: NextFunction): any {
    if (err) { Log.log.error(err); }
    if (next) { next(); }
  }
}

/**
 * Bootstrap the application.
 */
(function standalone() {
  Log.log.debug(`
**********************
  Starting GymSystems
**********************
`);
  return new GymServer(process.argv)
    .start()
    .then(() => Log.log.debug('** Server started...'))
    .catch((error: any) => Log.log.error((ERROR_MESSAGES[error.code]) ? ERROR_MESSAGES[error.code] : error));
})();
