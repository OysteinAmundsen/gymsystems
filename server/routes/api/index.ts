"use strict";

import * as express from 'express';
import * as tournaments from './tournaments';
import * as divisions from './divisions';
import * as teams from './teams';

export default function apiController (app: express.Router, baseName:string) {
    // Load up subroutes
    tournaments.default(app, baseName);
    divisions.default(app, baseName);
    teams.default(app, baseName);

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
