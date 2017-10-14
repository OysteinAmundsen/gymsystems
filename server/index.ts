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
  private port: number = +process.env.PORT || 3000;
  private clientPath = path.join(__dirname, './public');
  public isTest: boolean = !!process.env.PRODUCTION; // false;
  private ormConfig: ConnectionOptions;

      /**
   * Bootstrap the application.
   *
   * @returns {Promise<any>}
   * @constructor
   */
  static Initialize(args: string[]): Promise<any> {
    Log.log.debug(`
**********************
  Starting GymSystems
**********************
`);
    return new GymServer()
      .start(args)
      .then(() => Log.log.debug('** Server started...'))
      .catch((error: any) => Log.log.error((ERROR_MESSAGES[error.code]) ? ERROR_MESSAGES[error.code] : error));
  }

  /**
   * Constructor.
   */
  constructor() {
    useContainer(Container);    // setup typeorm to use typedi container
    rc.useContainer(Container); // setup routing-controllers to use typedi container.
  }

  /**
   * Server startup routine
   *
   * @returns {Promise<Server>}
   */
  async start(args: string[]): Promise<Server> {
    this.isTest = args.length > 2 && args[2] === 'test';

    // Read typeorm config and add our own Logger
    this.ormConfig = await getConnectionOptions(args.length > 2 ? args[2] : 'default');
    this.ormConfig = Object.assign(this.ormConfig, {
      name: 'default',                           // Rename configuration to 'default' as typeorm requires a default config
      logger: new OrmLog(this.ormConfig.logging) // Apply logger system to typeorm config
    });

    // Connect to database and startup Express
    Log.log.info('** Connecting to database and setting up schema');
    const connection = createConnection(this.ormConfig);

    Log.log.info('** DB connected. Creating server...');
    return this.createServer()
      .listen(this.port)  // Listen on provided port, on all network interfaces.
      .on('listening', () => this.onReady())
      .on('error', this.onServerInitError);
  }

  /**
   * Creates and configures our Express container
   *
   * @returns {Server}
   */
  public createServer(): e.Express {
    // Register services to typeDI
    Container.set(GymServer, this);

    this.app = e();
    this.app.set('trust proxy', true);  // Listen for external requests
    this.app.set('etag', false);
    this.app.disable('x-powered-by');   // Do not announce our architecture to the world!

    // Setup the following only if we are not running tests
    if (!this.isTest) {
      // Setup morgan access logger using winston
      this.app.use(morgan('combined', { stream: Log.stream }));

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
    this.app.use(bodyParser.urlencoded({ extended: false }));
    const MemoryStore = require('session-memory-store')(session);
    this.app.use(session({
        secret: 'mysecretkey',
        resave: true,
        saveUninitialized: true,
        store: new MemoryStore({expires: 60 * 60 * 12, checkperiod: 10 * 60}),
        cookie: {
          path: '/',
          httpOnly: true,
          secure: false,
          maxAge: null
        }
      }
    ));
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

    // Registerring custom services
    new SSEController();

    // Setup base route to everything else
    if (!this.isTest) {
      this.app.get('/*', (req: e.Request, res: e.Response) => {
        res.sendFile(path.resolve(this.clientPath, 'index.html'));
      });
    }
    return this.app;
  }

  /**
   * Callback on server ready!
   */
  private onReady() {
    const url = chalk.blue.underline(`http://localhost:${this.port}/`);
    Log.log.debug(`Serving on ${url}`);
  }

  /**
   * Callback on fatal error during startup of server.
   * This handles specific listen errors with friendly messages if configured. Defaults to the stack-trace.
   * @param error
   */
  private onServerInitError(error: any) {
    Log.log.error((ERROR_MESSAGES[error.code] ? ERROR_MESSAGES[error.code] : error));
  }

  private globalErrorHandler(err: any, req: Request, res: Response, next: NextFunction): any {
    if (err) { Log.log.error(err); }
    if (next) { next(); }
  }
}

(function standalone() {
  GymServer.Initialize(process.argv);
})();
