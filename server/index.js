#!/usr/bin/env node

// Module dependencies
const express        = require('express');
const path           = require('path');
const methodOverride = require('method-override');
const http           = require('http');
const favicon        = require('serve-favicon');
const logger         = require('morgan');
const cookieParser   = require('cookie-parser');
const bodyParser     = require('body-parser');

const debug = require('debug')('gymsystems:server');

/**
 *
 */
(function() {
    const app    = express();
    const env    = process.env.NODE_ENV || 'development';

    // Get port from environment and store in Express.
    const port = normalizePort(process.env.PORT || '3000');

    /*
     * Configuration
     */
    app.set('port', port);

    // view engine setup
    //app.set('views', path.join(__dirname, 'views'));
    //app.set('view engine', 'jade');

    app.use(favicon(path.join(__dirname, '../dist', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(methodOverride());
    app.use(cookieParser());
    app.use(errorHandler);

    // Set www folder
    app.use(express.static(path.join(__dirname, '../dist')));

    // Setup routes
    let routes = require('./routes');
    app.use('/', routes.index);

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
        if (env === 'development') {
            // development error handler
            // will print stacktrace
            // catch 404 and forward to error handler
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: {}
            });
        }
        else {
            // production error handler
            // no stacktraces leaked to user
            next(err);
        }
    }
    /**
     * Normalize a port into a number, string, or false.
     */
    function normalizePort(val) {
        let port = parseInt(val, 10);

        if (isNaN(port))  return val;  // named pipe
        if (port >= 0)    return port; // port number

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
})();
