import { Logger as WLogger } from 'winston';
import { StreamOptions } from 'morgan';
import { createLogger, transports, format } from 'winston';

export namespace Log {
  export let log: WLogger = createLogger({
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
        silent: process.env.NODE_ENV === 'test',
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
  */
  export function stream(logDirectory): StreamOptions {
    return require('rotating-file-stream')('access.log', {
      interval: '7d', // rotate weekly
      path: logDirectory
    });
  };
}
