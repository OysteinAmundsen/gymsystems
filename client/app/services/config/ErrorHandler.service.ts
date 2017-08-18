import { Injectable } from '@angular/core';

/**
 * Generic error handler. Error message is displayed in app.component
 */
@Injectable()
export class ErrorHandlerService {
  private _errorTimeout;
  private _error: string;
  get error() { return this._error; }
  set error(value: string) {
    if (this._errorTimeout) { clearTimeout(this._errorTimeout); }
    if (value) {
      if (typeof value === 'string') {
        this._error = value.replace(/^"|"$/g, '');
      } else if (typeof value === 'object') {
        this._error = value['message'] ? value['message'] : value[0];
      }
      this._errorTimeout = setTimeout(() => this._error = null, 10 * 1000);
    } else {
      this._error = null;
    }
  }

  constructor() { }

}
