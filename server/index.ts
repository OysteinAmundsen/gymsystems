// Module dependencies
import * as path from 'path';
import * as chalk from 'chalk';
import * as fs from 'fs';

// Express
import * as Express from 'express';

// Express middlewares
import * as favicon from 'serve-favicon';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as methodOverride from 'method-override';
import * as session from 'express-session';

// Authentication
import * as Passport from 'passport';
const LocalStrategy = require('passport-local').Strategy;

// Persistance
import 'reflect-metadata';
import { createConnection, useContainer } from 'typeorm';
import { createExpressServer } from 'routing-controllers';
import { Container } from 'typedi';
const rc = require('routing-controllers');

// Other
import { Logger } from './utils/Logger';
import { ERROR_MESSAGES } from './messages';

/**
 * The server.
 *
 * @class Server
 */
export class Server {
  public app: Express.Express;
  private port: number = 3000;
  private clientPath = path.join(__dirname, './public');

  /**
   * Bootstrap the application.
   *
   * @returns {Promise<any>}
   * @constructor
   */
  static Initialize(): Promise<any> {
    Logger.log.debug(`
${chalk.green('**********************')}
${chalk.green.bold('  Starting GymSystems')}
${chalk.green('**********************')}
`);

    return new Server()
      .start()
      .then(() => Logger.log.debug('Server started...'))
      .catch((error: any) => {
        Logger.log.error((ERROR_MESSAGES[error.code]) ? ERROR_MESSAGES[error.code] : error);
      });
  }

  /**
   * Constructor.
   */
  constructor() {
    // Setup dependency injection container
    useContainer(Container);    // setup typeorm to use typedi container
    rc.useContainer(Container); // setup routing-controllers to use typedi container.
  }

  start(): Promise<any> {
    // Configure database
    return createConnection().then(async connection => this.setup());
  }

  /**
   * Setup expressJS
   */
  setup() {
    Logger.log.info(chalk.green('DB connected'));

    const appPath = path.resolve(__dirname);

    // Setup ExpressJS application
    this.app = createExpressServer({
      routePrefix: '/api',
      controllers: [__dirname + '/controllers/*.js'],
      middlewares: [__dirname + '/middlewares/*.js'],
      interceptors: [__dirname + '/interceptors/*.js']
    });

    // Configure express
    this.useGlobalMiddlewares()
      .set('trust proxy', true)   // Listen for external requests
      .set('etag', false)         // TODO: Support etag
      .disable('x-powered-by');   // Do not announce our architecture to the world!

    // Setup static resources
    this.app.use(Express.static(this.clientPath));    // Serve static paths
    const faviconPath = path.join(this.clientPath, 'favicon.ico');
    if (fs.existsSync(path.resolve(faviconPath))) {
      this.app.use(favicon(faviconPath));             // Serve favicon
    }

    // Setup base route to everything else
    this.app.get('/*', (req: Express.Request, res: Express.Response) => {
      res.sendFile(path.resolve(this.clientPath, 'index.html'));
    });

    this.app.listen(this.port)  // Listen on provided port, on all network interfaces.
      .on('listening', () => this.$onReady())
      .on('error', this.$onServerInitError);
  }

  /**
   * This method let you configure the middleware required by your application to works.
   *
   * @returns {Server}
   */
  public useGlobalMiddlewares(): Express.Express {
    // Setup global middlewares
    return this.app
      .use(morgan('combined', { stream: Logger.stream })) // Setup morgan access logger using winston
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({ extended: true }))
      .use(cookieParser())
      .use(methodOverride())

      // Configure session used by Passport
      .use(session({
        secret: 'mysecretkey',
        resave: true,
        saveUninitialized: true,
        cookie: {
          path: '/',
          httpOnly: true,
          secure: false,
          maxAge: null
        }
      }))

      // Configure passport JS
      .use(Passport.initialize())
      .use(Passport.session());
  }

  /**
   * Server ready!
   */
  public $onReady() {
    const url = chalk.blue.underline(`http://localhost:${this.port}/`);
    Logger.log.info(`Serving on ${url}`);
  }

  /**
   *
   * @param request
   * @param response
   * @param next
   * @param authorization
   */
  public $onAuth(request: Express.Request, response: Express.Response, next: Express.NextFunction, authorization?: any): void {
    next(request.isAuthenticated());
  }

  /**
   * Fatal error occurred during startup of server
   * @param error
   */
  public $onServerInitError(error: any) {
    // handle specific listen errors with friendly messages if configured. Default to the stack-trace.
    Logger.log.error((ERROR_MESSAGES[error.code] ? ERROR_MESSAGES[error.code] : error));
  }
}

(function standalone() {
  Server.Initialize();
})();
