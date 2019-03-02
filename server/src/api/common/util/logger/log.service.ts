import { Injectable, LoggerService } from '@nestjs/common';
import { Log } from './log';

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
@Injectable()
export class LogService implements LoggerService {

  log(message: any, context?: string) {
    Log.log.info(message);
  }

  error(message: any, trace?: string, context?: string) {
    Log.log.error(message);
  }
  warn(message: any, context?: string) {
    Log.log.warn(message);
  }
}
