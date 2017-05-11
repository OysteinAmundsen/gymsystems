import { LoggerInstance } from 'winston';
import * as winston from 'winston';
import * as morgan from 'morgan';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';

if (!fs.existsSync('./log')) {
  mkdirp('./log', (err, made) => {
    if (err) { throw new Error(err); }
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
export namespace Logger {
  function formatter(logEntry: any) {
    // Remove ansi coloring from log entries
    const regexp = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
    return JSON.stringify({
      level: logEntry.level,
      timestamp: new Date().toISOString(),
      message: logEntry.message.replace(regexp, ''),
    });
  }
  export let log: LoggerInstance = new winston.Logger({
    transports: [
      new winston.transports.File({
        name: 'errorLog',
        level: 'error',
        filename: './log/errors.log',
        handleExceptions: true,
        json: false,
        maxsize: (1 * 1024 * 1024), // 1MB
        maxFiles: 5,
        colorize: false,
        formatter: formatter
      }),
      new winston.transports.File({
        name: 'info',
        level: 'info',
        filename: './log/all-logs.log',
        handleExceptions: false,
        json: false,
        maxsize: (1 * 1024 * 1024), // 1MB
        maxFiles: 5,
        colorize: false,
        formatter: formatter
      }),
      new winston.transports.Console({
        name: 'all',
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true
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
      Logger.log.info(message);
    }
  };
}
