'use strict';

import * as express from 'express';
let hal = require('hal');

export default function divisionController(router: express.Router, baseName: string) {
  router.get(baseName + '/divisions', function (req: express.Request, res: express.Response) {
    let resource = new hal.Resource({ name: "divisions" }, '/api/divisions');
    resource.link('tournaments', '/api/tournaments');
    resource.link('divisions', '/api/divisions');
    resource.link('teams', '/api/teams');
    res.send(resource.toJSON());

    console.log('Call to ' + baseName);
    res.send(baseName + ' called successfully...');
  });
}
