require('v8-compile-cache');
import { performance } from 'perf_hooks';

// Set current runtime (nescessary to set proper typeorm config)
process.env.RUNTIME = __filename.split('\\').pop().split('.').pop();
const env = process.env.RUNTIME;
const startTime = performance.now();
console.log(`┌────────────────────────────────────────────────────────────┐`);
console.log(`│    Starting: ${new Date()} │`);
console.log(`│     Runtime: ${env}                                            │`);
console.log('└────────────────────────────────────────────────────────────┘');

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder, SwaggerDocument } from '@nestjs/swagger';
import 'reflect-metadata';
import * as express from 'express';
import * as helmet from 'helmet';
import * as morganBody from 'morgan-body';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as fs from 'fs';
import rfs from 'rotating-file-stream';

const pkg = require('../package.json');

import { AppModule } from './api/app.module';
import { Config } from './api/common/config';
import { HttpExceptionFilter } from './api/common/filters/http-exception.filter';

async function bootstrap() {
  const expressInstance = express();
  // Configure Express Instance
  expressInstance.use(helmet()); //Helmet
  expressInstance.use(bodyParser.urlencoded({ extended: false }));
  expressInstance.use(bodyParser.json()); //Body Parser

  // Logs
  const logDirectory = './log';
  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory); // ensure log directory exists
  const accessLogStream = rfs('access.log', { interval: '7d', path: logDirectory }); // rotate weekly
  expressInstance.use(morgan('combined', { stream: accessLogStream }));
  morganBody(expressInstance); // Log every request body/response

  // Create NestJS APP
  const app = await NestFactory.create(AppModule, expressInstance, { cors: true });

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
    const options = new DocumentBuilder()
      .setBasePath(Config.GlobalRoutePrefix)
      .setTitle(pkg.name)
      .setDescription(pkg.description)
      .setVersion(pkg.version)
      .setContactEmail(pkg.author)
      .addBearerAuth(Config.JwtHeaderName, 'header', 'jwt')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(`/${Config.GlobalRoutePrefix}${Config.DocsRoute}`, app, document);
    generateSwaggerJSONFile(document); // Generate .json API Documentation (easly import to Restlet Studio etc...)
  }

  // Start listening
  await app.listen(Config.Port, Config.IP, () => {
    console.log(`┌────────────────────────────────────────────────────────────┐`);
    console.log(`│       Server listening: ${Config.ApiUrl}          │`);
    if (!Config.isProd()) {
      console.log(`│  Swagger Documentation: ${Config.ApiUrl}${Config.DocsRoute}     │`);
      console.log(`│     GraphQL Playground: ${Config.ApiUrl}${Config.GraphRoute}    │`);
    }
    console.log('├────────────────────────────────────────────────────────────┤');
    console.log(`│     Launch: ${new Date()}  │`);
    console.log(`│         Time to start: ${performance.now() - startTime}                   │`);
    console.log('└────────────────────────────────────────────────────────────┘');
  });
}

bootstrap();

async function generateSwaggerJSONFile(swaggerDocument: SwaggerDocument): Promise<void> {
  const apiDirectory = './api-docs';
  fs.existsSync(apiDirectory) || fs.mkdirSync(apiDirectory); // ensure api documentation directory exists
  await fs.writeFile(`${apiDirectory}/swagger2.json`, JSON.stringify(swaggerDocument, null, 4), (err: NodeJS.ErrnoException) => {
    if (err) throw err;
  });
}
