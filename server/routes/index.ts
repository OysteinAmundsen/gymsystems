'use strict';

import * as express from 'express';
import * as path from 'path';

export default function mainController(router: express.Router, baseName: string) {
  /* GET home page. */
  router.get('/', function (req, res, next) {
    res.sendFile(path.resolve(path.join(__dirname, './public'), 'index.html'));
  });
}
