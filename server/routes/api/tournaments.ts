'use strict';

import * as express from 'express';
let fs = require('fs');
let hal = require('hal');

export default function tournamentController(router: express.Router, baseName: string) {
  let tournaments = JSON.parse(fs.readFileSync('./server/routes/api/mock/tournaments.json', 'utf8'));

  router.get(baseName + '/tournaments', function (req: express.Request, res: express.Response) {
    let resource = new hal.Resource({ name: "tournaments", data: tournaments }, '/api/tournaments');
    res.send(resource.toJSON());
  });
}
