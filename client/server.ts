// These are important and needed before anything else
import 'reflect-metadata';
import 'zone.js/dist/zone-node';

import { enableProdMode } from '@angular/core';

import * as express from 'express';
import * as proxy from 'http-proxy-middleware';
import { join } from 'path';
import * as process from 'process';
import * as fs from 'fs';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

const PORT = process.env.PORT || 4000;
let DIST_FOLDER = process.cwd();
if (fs.existsSync(join(process.cwd(), 'dist'))) {
  // We are most likelly in dev mode. The dist folder does not exist on container.
  DIST_FOLDER = join(process.cwd(), 'dist');
}

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main.js');

// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

// In production, nginx will take care of this before it hits here. This is for dev only.
// Serve api calls to backend
const api = process.env.NODE_ENV !== 'production' ? 'localhost' : 'api';
const apiProxy = proxy('/api', { target: `http://${api}:3000` });
app.use('/api', apiProxy);

// Again, in production, static files are handled by nginx before this hits.
// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser')));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render('index', { req });
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
});
