// Module dependencies
import * as path from 'path';
import * as chalk from 'chalk';

import * as express from 'express';
import * as favicon from 'serve-favicon';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as methodOverride from 'method-override';

import * as logMiddleWare from 'morgan';
import * as Logger from 'bunyan';

import 'reflect-metadata';
import { createConnection, useContainer } from 'typeorm';
import { useExpressServer, createExpressServer } from 'routing-controllers';
import { Container } from 'typedi';

/**
 * The server.
 *
 * @class Server
 */
export class Server {
  public app: express.Express;
  private log: Logger.Logger = require('./logger');
  private port: number;

  /**
   * Bootstrap the application.
   *
   * @param app - An optional instance of express
   * @returns {Server} Creates and returns an instance of this server
   */
  public static bootstrap(app?: express.Express): Server {
    return new Server(app);
  }

  /**
   * Constructor.
   *
   * @param app - You can provide your own express instance here, and this class
   *              will use this instead of creating a default.
   * @param port - optional port. Default is 3000.
   */
  constructor(app?: express.Express, port?: number) {
    const env = process.env.NODE_ENV || 'development';
    const base = './';
    const clientPath = path.join(__dirname, base + '/public');
    this.port = this.normalizePort(process.env.PORT || port || '3000');

    // setup routing-controllers to use typedi container. You can use any container here
    useContainer(Container);

    // Configure database
    createConnection().then(async connection => {
      console.log(chalk.green('DB connected'));

      // Setup ExpressJS application
      const appConfig = {
        routePrefix: '/api',
        controllers: [__dirname + '/controllers/*.js']             // register controllers routes in our express app
      };
      this.app = (app ? useExpressServer(app, appConfig) : createExpressServer(appConfig));
      this.app.set('port', this.port);

      // TODO: Setup authentication

      // Configure express
      this.app.set('etag', false);
      this.app.disable('x-powered-by');
      this.app.set('trust proxy', true);                           // Listen for external requests

      // Setup middlewares
      this.app.use(bodyParser.json());                             // mount json form parser
      this.app.use(bodyParser.urlencoded({ extended: false }));    // mount query string parser
      this.app.use(methodOverride());                              // Enforce HTTP verbs
      this.app.use(cookieParser());                                // populate req.cookies
      this.app.use(logMiddleWare('dev'));                          // Setup morgan

      // Setup static resources
      this.app.use(express.static(clientPath));                    // Serve static paths
      this.app.use(favicon(path.join(clientPath, 'favicon.ico'))); // Serve favicon

      // Error handlers
      this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log('Error: ' + err);
        res.status(err.status || 500);
        res.render('error', {
          message: err.message,
          error: (env === 'development') ? err : {}
        });
        next(err);
      });

      // Setup base route to everything else
      this.app.get('/*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.sendFile(path.resolve(clientPath, 'index.html'));
      });

      this.app.listen(this.port)  // Listen on provided port, on all network interfaces.
        .on('listening', () => console.log('Serving on ' + chalk.blue.underline('http://localhost:' + this.port + '/')))
        .on('error', (error: any) => {
          if (error.syscall !== 'listen') { throw error; }

          let bind = typeof this.port === 'string' ? 'Pipe ' + this.port : 'Port ' + this.port;

          // handle specific listen errors with friendly messages
          switch (error.code) {
            case 'EACCES':
              console.error(bind + ' requires elevated privileges');
              process.exit(1);
              break;
            case 'EADDRINUSE':
              console.error(bind + ' is already in use');
              process.exit(1);
              break;
            default:
              throw error;
          }
        });

    }).catch((error: any) => {
      if (error.code === 'ECONNREFUSED') {
        console.log(`${chalk.red.bold('ERROR: Connection refused!')}

    Did you forget to start the docker container for database? 
    Before you try and run the server standalone, ${chalk.white.bold('Please run:')} 
      ${chalk.yellow('./docker-build')} 

`);
      } else {
        console.error(error);
      }
    });
  }

  /**
   * Normalize a port into a number, string, or false.
   */
  normalizePort(val: any) {
    let port = parseInt(val, 10);

    if (isNaN(port)) return val;  // named pipe
    if (port >= 0) return port; // port number

    return false;
  }
}

(function standalone() {
  console.log(`
${chalk.green     ('**********************')}
${chalk.green.bold('  Starting GymSystems')}
${chalk.green     ('**********************')}
`);
  module.exports = Server.bootstrap().app;
})();
