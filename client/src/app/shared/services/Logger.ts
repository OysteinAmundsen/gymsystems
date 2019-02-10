import { environment } from '../../../environments/environment';

export class Logger {
  static debug(...args) {
    if (!environment.production) {
      this.log(...args);
    }
  }

  static log(...args) {
    this._log('log', ...args);
  }
  static error(...args) {
    this._log('error', ...args);
  }

  private static _log(type: string, ...args) {
    if (typeof window !== 'undefined' && window.console) {
      console[type](...args);
    }
  }
}
