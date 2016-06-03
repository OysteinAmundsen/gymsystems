/// <reference path="../typings/main.d.ts" />
/// <reference path="../typings/index.d.ts" />

// Module dependencies
import * as http from 'http';
import debug = require('debug')('gymsystems:server');

/**
 *
 */
console.log(`
********************
  Starting server 
********************`);

const app = require('./app');
const env = process.env.NODE_ENV || 'development';

// Get port from environment and store in Express.
const port = normalizePort(process.env.PORT || '3000');

/*
 * Configuration
 */
console.log('Configuring server on ' + port);
app.set('port', port);

// view engine setup
app.use(errorHandler);

// Create HTTP server.
const server = http.createServer(app);

// Listen on provided port, on all network interfaces.
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * error handlers
 */
function errorHandler(err, req, res, next) {
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
function normalizePort(val) {
    let port = parseInt(val, 10);

    if (isNaN(port)) return val;  // named pipe
    if (port >= 0) return port; // port number

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
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

module.exports = app;
