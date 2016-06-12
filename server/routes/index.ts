"use strict";

import * as express from 'express';
import * as path from 'path';

export default function mainController (app: express.Router, baseName:string) {
    /* GET home page. */
    app.get('/', function (req, res, next) {
        res.sendFile(path.resolve(path.join(__dirname, '../dist'), 'index.html'));
    });
}
