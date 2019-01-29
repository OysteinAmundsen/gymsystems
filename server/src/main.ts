// require('v8-compile-cache');
import { performance } from 'perf_hooks';

// Set current runtime (nescessary to set proper typeorm config)
process.env.RUNTIME = __filename.split('\\').pop().split('.').pop();
const env = process.env.RUNTIME;
const startTime = performance.now();

import { Log } from './api/common/util/logger/log';
const lineLength = 75;
Log.log.info(padRight(`┌`, lineLength, '─') + `┐`);
Log.log.info(padRight(`│    Starting: ${new Date().toISOString()}`, lineLength, ' ') + `│`);
Log.log.info(padRight(`│      Memory: ${readMem()}`, lineLength, ' ') + `│`);
Log.log.info(padRight(`│     Runtime: ${env}`, lineLength, ' ') + `│`);
Log.log.info(padRight(`└`, lineLength, '─') + `┘`);

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import 'reflect-metadata';
import { existsSync, mkdirSync, writeFile } from 'fs';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as morganBody from 'morgan-body';

import { Config } from './api/common/config';
import { HttpExceptionFilter } from './api/common/filters/http-exception.filter';
import { LogService } from './api/common/util/logger/log.service';

// This one takes up the most time on startup
import { AppModule } from './api/app.module';
Log.log.debug(` * ${new Date().toISOString()}: imports done in ${(performance.now() - startTime).toFixed(3)}ms`);
Log.log.debug(` * Memory: ${readMem()}`);

let bootTime;

function padRight(str, length, character) {
  while (str.length < length) {
    str += character;
  }
  return str;
}

/**
 * Prints out a human readable compillation of the current memory usage
 * of the running process.
 */
function readMem() {
  const mem = process.memoryUsage();
  const convert = { Kb: n => (n / 1024), Mb: n => convert.Kb(n) / 1024 };
  const toHuman = (n, t) => `${convert[t](n).toFixed(2)}${t}`;
  return `Used ${toHuman(mem.heapUsed, 'Mb')} of ${toHuman(mem.heapTotal, 'Mb')} - RSS: ${toHuman(mem.rss, 'Mb')}`;
}

/**
 * Bootstrap the application
 */
async function bootstrap() {
  Log.log.debug(` * ${new Date().toISOString()}: Bootstrapping application`);
  bootTime = performance.now();

  const expressInstance = express();
  // Configure Express Instance
  expressInstance.use(helmet()); //Helmet
  expressInstance.use(bodyParser.urlencoded({ extended: false }));
  expressInstance.use(bodyParser.json()); //Body Parser

  // Logging
  const logDirectory = './log';
  existsSync(logDirectory) || mkdirSync(logDirectory); // ensure log directory exists
  expressInstance.use(morgan('combined', { stream: Log.stream(logDirectory) }));
  morganBody(expressInstance); // Log every request body/response

  // Create NestJS APP
  Log.log.debug(` * ${new Date().toISOString()}: Creating NestJS app`);
  const app = await NestFactory.create(AppModule, expressInstance, { cors: true, logger: false });
  Log.log.debug(` * ${new Date().toISOString()}: Configuring NestJS app`);
  app.useLogger(app.get(LogService));

  // Global Route Prefix
  app.setGlobalPrefix(Config.GlobalRoutePrefix);

  // Do not err on fetching favicon (will only be called when surfing the api using a browser)
  // which you should not do anyway. You should use a REST explorer like i.e. Postman.
  app.use((req, res, next) => req.url === '/favicon.ico' ? res.status(204).send() : next());

  // Pipes
  app.useGlobalPipes(new ValidationPipe({ transform: true, disableErrorMessages: true }));

  // Http-Exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Interceptors

  // Swagger
  if (!Config.isProd()) {
    Log.log.debug(` * ${new Date().toISOString()}: Setting up swagger`);
    const pkg = require('../package.json');

    const swagger = await import('@nestjs/swagger');
    const options = new swagger.DocumentBuilder()
      .setBasePath(Config.GlobalRoutePrefix)
      .setTitle(pkg.name)
      .setDescription(pkg.description)
      .setVersion(pkg.version)
      .setContactEmail(pkg.author)
      .addBearerAuth(Config.JwtHeaderName, 'header', 'jwt')
      .build();
    const document = swagger.SwaggerModule.createDocument(app, options);
    swagger.SwaggerModule.setup(`/${Config.GlobalRoutePrefix}${Config.DocsRoute}`, app, document);

    // Generate .json API Documentation (easly import to Restlet Studio etc...)
    const apiDirectory = './api-docs';
    existsSync(apiDirectory) || mkdirSync(apiDirectory); // ensure api documentation directory exists
    await writeFile(`${apiDirectory}/swagger2.json`, JSON.stringify(document, null, 4), (err: NodeJS.ErrnoException) => {
      if (err) throw err;
    });
  }

  // Start listening
  await app.listen(Config.Port, Config.IP, () => {
    Log.log.info(padRight(`┌`, lineLength, '─') + `┐`);
    Log.log.info(padRight(`│       Server listening: ${Config.ApiUrl}`, lineLength, ' ') + `│`);
    if (!Config.isProd()) {
      Log.log.info(padRight(`│  Swagger Documentation: ${Config.ApiUrl}${Config.DocsRoute}`, lineLength, ' ') + `│`);
      Log.log.info(padRight(`│     GraphQL Playground: ${Config.ApiUrl}${Config.GraphRoute}`, lineLength, ' ') + `│`);
    }
    Log.log.info(padRight(`├`, lineLength, '─') + `┤`);
    Log.log.info(padRight(`│             Memory: ${readMem()}`, lineLength, ' ') + `│`);
    Log.log.info(padRight(`│             Launch: ${new Date().toISOString()}`, lineLength, ' ') + `│`);
    Log.log.info(padRight(`│      Time to start: ${(performance.now() - startTime).toFixed(3)}ms`, lineLength, ' ') + `│`);
    Log.log.info(padRight(`│     Bootstrap time: ${(performance.now() - bootTime).toFixed(3)}ms`, lineLength, ' ') + `│`);
    Log.log.info(padRight(`└`, lineLength, '─') + `┘`);
  });
}

bootstrap();
