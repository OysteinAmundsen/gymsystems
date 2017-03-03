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
import { SSEService } from './services/SSEService';
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
      .catch((error: any) => Logger.log.error((ERROR_MESSAGES[error.code]) ? ERROR_MESSAGES[error.code] : error));
  }

  /**
   * Constructor.
   */
  constructor() {
    // Setup dependency injection container
    useContainer(Container);    // setup typeorm to use typedi container
    rc.useContainer(Container); // setup routing-controllers to use typedi container.
  }

  start(): Promise<Express.Express> {
    // Read typeorm config
    const config: any = JSON.parse(fs.readFileSync(path.join('.', 'ormconfig.json'), 'utf8'));
    config[0].logging.logger = this.log;
    return createConnection(config[0])
      .then(async connection => {
        Logger.log.info(chalk.green('DB connected'));
        return this.createServer();
      });
  }

  /**
   * This method let you configure the middleware required by your application to works.
   *
   * @returns {Server}
   */
  public createServer(): Express.Express {
    const app = createExpressServer({
      routePrefix: '/api',
      controllers: [__dirname + '/controllers/*.js'],
      middlewares: [__dirname + '/middlewares/*.js'],
      interceptors: [__dirname + '/interceptors/*.js']
    });

    // Registerring custom services
    new SSEService(app);

    app.set('trust proxy', true);  // Listen for external requests
    app.set('etag', false);        // TODO: Support etag
    app.disable('x-powered-by');   // Do not announce our architecture to the world!

    // Setup static resources
    app.use(Express.static(this.clientPath));    // Serve static paths

    const faviconPath = path.join(this.clientPath, 'favicon.ico');
    if (fs.existsSync(path.resolve(faviconPath))) {
      app.use(favicon(faviconPath));             // Serve favicon
    }

    // Setup base route to everything else
    app.get('/*', (req: Express.Request, res: Express.Response) => {
      res.sendFile(path.resolve(this.clientPath, 'index.html'));
    });

    app.listen(this.port)  // Listen on provided port, on all network interfaces.
      .on('listening', () => this.$onReady())
      .on('error', this.$onServerInitError);

    // Setup global middlewares
    return app
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
    Logger.log.debug(`Serving on ${url}`);
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

  log(level: string, message: string) {
    Logger.log.info(`${level} - ${message}`);
  }
}

(function standalone() {
  Server.Initialize();
})();
