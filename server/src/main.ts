require('v8-compile-cache');
import { performance } from 'perf_hooks';
import { Log } from 'api/common/util/logger/log';

// Set current runtime (nescessary to set proper typeorm config)
process.env.RUNTIME = __filename.split('\\').pop().split('.').pop();
const env = process.env.RUNTIME;
const startTime = performance.now();

Log.log.info(`┌────────────────────────────────────────────────────────────┐`);
Log.log.info(`│    Starting: ${new Date().toUTCString()}                 │`);
Log.log.info(`│     Runtime: ${env}                                            │`);
Log.log.info(`└────────────────────────────────────────────────────────────┘`);

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import 'reflect-metadata';
import { existsSync, mkdirSync, writeFile } from 'fs';

import { AppModule } from './api/app.module';
import { Config } from './api/common/config';
import { HttpExceptionFilter } from './api/common/filters/http-exception.filter';
import { LogService } from 'api/common/util/logger/log.service';

async function bootstrap() {
  const expressInstance = require('express')();
  // Configure Express Instance
  expressInstance.use(require('helmet')()); //Helmet
  const bodyParser = await import('body-parser');
  expressInstance.use(bodyParser.urlencoded({ extended: false }));
  expressInstance.use(bodyParser.json()); //Body Parser

  // Logging
  const logDirectory = './log';
  existsSync(logDirectory) || mkdirSync(logDirectory); // ensure log directory exists
  expressInstance.use(require('morgan')('combined', { stream: Log.stream(logDirectory) }));
  require('morgan-body')(expressInstance); // Log every request body/response

  // Create NestJS APP
  const app = await NestFactory.create(AppModule, expressInstance, { cors: true, logger: false });
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
    Log.log.info(`┌────────────────────────────────────────────────────────────┐`);
    Log.log.info(`│       Server listening: ${Config.ApiUrl}          │`);
    if (!Config.isProd()) {
      Log.log.info(`│  Swagger Documentation: ${Config.ApiUrl}${Config.DocsRoute}     │`);
      Log.log.info(`│     GraphQL Playground: ${Config.ApiUrl}${Config.GraphRoute}    │`);
    }
    Log.log.info('├────────────────────────────────────────────────────────────┤');
    Log.log.info(`│     Launch: ${new Date().toUTCString()}                  │`);
    Log.log.info(`│         Time to start: ${(performance.now() - startTime).toFixed(3)}ms                         │`);
    Log.log.info('└────────────────────────────────────────────────────────────┘');
  });
}

bootstrap();
