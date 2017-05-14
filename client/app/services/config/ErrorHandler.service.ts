import { Injectable } from '@angular/core';

/**
 * Generic error handler. Error message is displayed in app.component
 */
@Injectable()
export class ErrorHandlerService {
  private _errorTimeout;
  private _error: string;
  get error() { return this._error; }
  set error(value) {
    this._error = value;
    if (this._errorTimeout) { clearTimeout(this._errorTimeout); }
    if (value) {
      this._errorTimeout = setTimeout(() => this._error = null, 10 * 1000);
    }
  }

  constructor() { }

}
