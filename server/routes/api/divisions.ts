/// <reference path="../../../typings/main.d.ts" />
/// <reference path="../../../typings/index.d.ts" />
"use strict";

import * as express from 'express';

export default function divisionController (app: express.Router, baseName:string) {
    app.get(baseName + '/divisions', function (req: express.Request, res: express.Response) {
        console.log('Call to ' + baseName);
        res.send(baseName + ' called successfully...');
    });
}