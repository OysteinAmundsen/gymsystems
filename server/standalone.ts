// Module dependencies
import * as http from 'http';
import * as express from 'express';
import { Server } from './Server';

let debug = require('debug')('gymsystems:server');
let chalk = require('chalk');

/**
 * This file is used when you start up the server yourself.
 */
console.log(`
${chalk.green('********************')}
${chalk.green.bold('  Starting server')}
${chalk.green('********************')}

You are starting this server in standalone mode.
Livereload will not be available. If you want to develop on this application,
we suggest you run this as:

    ${chalk.yellow.bold('ng serve')}
`);

(function standalone() {
  const env = process.env.NODE_ENV || 'development';
  const app = Server.bootstrap().app;
  let server: http.Server;

  // Get port from environment and store in Express.
  let port = normalizePort(process.env.PORT || '3000');

  // view engine setup
  app.use(errorHandler);

  /* Configuration */
  app.set('port', port);

  // Create HTTP server.
  server = http.createServer(app);

  // Listen on provided port, on all network interfaces.
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);

  console.log('Serving on ' + chalk.blue.underline('http://localhost:' + port + '/'));
  module.exports = app;

  /**
   * error handlers
   */
  function errorHandler(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    // development error handler
    // will print stacktrace
    // catch 404 and forward to error handler
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: (env === 'development') ? err : {}
    });
    next(err);
  }

  /**
   * Normalize a port into a number, string, or false.
   */
  function normalizePort(val: any) {
    let port = parseInt(val, 10);

    if (isNaN(port)) return val;  // named pipe
    if (port >= 0) return port; // port number

    return false;
  }

  /**
   * Event listener for HTTP server "error" event.
   */
  function onError(error: any) {
    if (error.syscall !== 'listen') throw error;

    let bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

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
  }

  /**
   * Event listener for HTTP server "listening" event.
   */
  function onListening() {
    let addr = server.address();
    let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }
})();
