'use strict';

import * as express from 'express';

export default function teamsController(router: express.Router, baseName: string) {
  router.get(baseName + '/teams', function (req: express.Request, res: express.Response) {
    console.log('Call to ' + baseName);
    res.send(baseName + ' called successfully...');
  });
}
