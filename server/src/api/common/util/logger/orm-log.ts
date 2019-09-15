import * as chalk from 'chalk';
import { LoggerOptions } from 'typeorm/logger/LoggerOptions';
import { Logger, QueryRunner } from 'typeorm';
import { PlatformTools } from 'typeorm/platform/PlatformTools';
import { Log } from './log';

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
    Log.log.log(level, message, queryRunner);
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
