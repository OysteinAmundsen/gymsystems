'use strict';

import * as express from 'express';
import * as tournaments from './tournaments';
import * as divisions from './divisions';
import * as teams from './teams';
let hal = require('hal');

export default function apiController(router: express.Router, baseName: string) {
  // Load up subroutes
  tournaments.default(router, baseName);
  divisions.default(router, baseName);
  teams.default(router, baseName);

  router.get(baseName, function (req: express.Request, res: express.Response) {
    let resource = new hal.Resource({ name: "api" }, '/api');
    resource.link('tournaments', '/api/tournaments');
    resource.link('divisions', '/api/divisions');
    resource.link('teams', '/api/teams');
    res.send(resource.toJSON());
  });
}
