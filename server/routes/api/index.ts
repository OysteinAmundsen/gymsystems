/// <reference path="../../../typings/main.d.ts" />
/// <reference path="../../../typings/index.d.ts" />
"use strict";

import * as express from 'express';

export default function apiController (app: express.Router, baseName:string) {
    // Load up subroutes
    require('./tournaments').default(app, baseName);
    require('./divisions').default(app, baseName);
    require('./teams').default(app, baseName);
    
    app.get(baseName, function (req: express.Request, res: express.Response) {
        res.send({
            baseUrl: baseName,
            urls: [
                '/tournaments',
                '/divisions',
                '/teams',
            ]
        });
    });
}