// Module dependencies
import * as http from 'http';
import * as express from 'express';
import { Server } from './Server';

var debug = require('debug')('gymsystems:server');

/**
 *
 */

console.log(`
    ********************
    Starting server
    ********************`);
const env = process.env.NODE_ENV || 'development';
const app = Server.bootstrap().app;
var server: http.Server;

// Get port from environment and store in Express.
var port = normalizePort(process.env.PORT || '4200');

// view engine setup
app.use(errorHandler);

/* Configuration */
console.log('Configuring server on ' + port);
app.set('port', port);

// Create HTTP server.
server = http.createServer(app);

// Listen on provided port, on all network interfaces.
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

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
function normalizePort(val:any) {
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
