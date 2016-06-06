// Module dependencies
import * as express from 'express';
import { Server } from './Server';

/**
 * This file is used by angular-cli when you
 *  ```
 *  ng serve
 *  ```
 *
 * For a full backend server, please see
 *  ```
 *  npm start
 *  ```
 */
module.exports = function (app?:express.Express) {
    Server.bootstrap(app);
    return app;
}
