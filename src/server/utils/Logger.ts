import * as winston from 'winston';
import * as morgan from 'morgan';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as chalk from 'chalk';
import { LoggerOptions } from 'typeorm/logger/LoggerOptions';
import { Logger, QueryRunner } from 'typeorm';
import { PlatformTools } from 'typeorm/platform/PlatformTools';
import { createLogger, transports, format } from 'winston';

if (!fs.existsSync('./log')) {
  mkdirp('./log', (err, made) => {
    if (err) { throw new Error(JSON.stringify(err)); }
    console.log('Created log dir!');
  });
}

/**
 * A custom logger factory which combines the `morgan` express logger middleware
 * with the more customizable, and more importantly, callable `winston` logger.
 *
 * This means that in addition to logging every api request/response by default,
 * we can also log custom stuff using:
 * ```
 * Logger.log.debug('This is a log entry');
 * ```
 */
export namespace Log {
  export let log: winston.Logger = createLogger({
    transports: [
      new transports.File({
        level: 'error',
        filename: './log/errors.log',
        handleExceptions: true,
        maxsize: (1 * 1024 * 1024), // 1MB
        maxFiles: 5,
        format: format.combine(
          format.splat(),
          format.timestamp(),
          format.json()
        )
      }),
      new transports.File({
        level: 'info',
        filename: './log/all-logs.log',
        handleExceptions: false,
        maxsize: (1 * 1024 * 1024), // 1MB
        maxFiles: 5,
        format: format.combine(
          format.splat(),
          format.timestamp(),
          format.json()
        )
      }),
      new transports.Console({
        level: 'debug',
        handleExceptions: true,
        format: format.combine(
          format.colorize(),
          format.simple()
        )
      })
    ],
    exitOnError: false
  });

   /**
   * This is the options object we relay to `morgan`
   *
   * @type {{write: ((message:string)=>any)}}
   */
  export let stream: morgan.StreamOptions = {
    write: function (message: string) {
      Log.log.info(message);
    }
  };
}

/**
 * This is the relay class we send to TypeORM.
 */
export class OrmLog implements Logger {
  constructor(private options?: LoggerOptions) { }

  /**
   * Logs query and parameters used in it.
   */
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    if (this.options === 'all' || this.options === true || (this.options instanceof Array && this.options.indexOf('query') !== -1)) {
      const sql = query + (parameters && parameters.length ? ' -- PARAMETERS: ' + this.stringifyParams(parameters) : '');
      Log.log.verbose(chalk.default.gray.underline('executing query: ') + PlatformTools.highlightSql(sql));
    }
  }

  /**
   * Logs query that is failed.
   */
  logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    if (this.options === 'all' || this.options === true || (this.options instanceof Array && this.options.indexOf('error') !== -1)) {
      const sql = query + (parameters && parameters.length ? ' -- PARAMETERS: ' + this.stringifyParams(parameters) : '');
      Log.log.error(chalk.default.underline.red(`query failed: `) + PlatformTools.highlightSql(sql));
      Log.log.error(chalk.default.underline.red(`error: `) + error);
    }
  }

  /**
   * Logs query that is slow.
   */
  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    const sql = query + (parameters && parameters.length ? ' -- PARAMETERS: ' + this.stringifyParams(parameters) : '');
    Log.log.warn(chalk.default.underline.yellow(`query is slow: `) + PlatformTools.highlightSql(sql));
    Log.log.warn(chalk.default.underline.yellow(`execution time: `) + time);
  }

  /**
   * Logs events from the schema build process.
   */
  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    if (this.options === 'all' || (this.options instanceof Array && this.options.indexOf('schema') !== -1)) {
      Log.log.debug(chalk.default.underline(message));
    }
  }

  /**
   * Logs events from the migration run process.
   */
  logMigration(message: string, queryRunner?: QueryRunner) {
    Log.log.debug(chalk.default.underline(message));
  }

  /**
   * Perform logging using given logger, or by default to the console.
   * Log has its own level and message.
   */
  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    throw new Error('Method not implemented.');
  }

  /**
   * Converts parameters to a string.
   * Sometimes parameters can have circular objects and therefor we are handle this case too.
   */
  protected stringifyParams(parameters: any[]) {
    try {
      return JSON.stringify(parameters);

    } catch (error) { // most probably circular objects in parameters
      return parameters;
    }
  }
}
