"use strict";

import * as express from 'express';

export default function tournamentController (app: express.Router, baseName:string) {
    app.get(baseName + '/tournaments', function (req: express.Request, res: express.Response) {
        console.log('Call to ' + baseName);
        res.send(baseName + ' called successfully...');
    });
}
