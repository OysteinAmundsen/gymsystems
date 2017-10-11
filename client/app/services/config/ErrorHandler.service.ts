import { Injectable, Injector } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ErrorDialogComponent } from 'app/shared/components/error-dialog/error-dialog.component';

/**
 * Generic error handler. Error message is displayed in app.component
 */
@Injectable()
export class ErrorHandlerService {
  private dialogRef: MatDialogRef<ErrorDialogComponent>;

  private _errorTimeout;
  private _error: string;
  get error() { return this._error; }

  constructor(private dialog: MatDialog) {  }

  setError(value: string, header?: string) {
    this.clearError();
    if (value) {
      if (typeof value === 'string') {
        this._error = value.replace(/^"|"$/g, '');
      } else if (typeof value === 'object') {
        this._error = value['message'] ? value['message'] : value[0];
      }
      const opts = {
        message: this._error,
        header: header,
        autocloseAfter: 10 * 1000
      };
      this.dialogRef = this.dialog.open(ErrorDialogComponent, { data: opts });
      this._errorTimeout = setTimeout(() => this.clearError(), opts.autocloseAfter);
    }
  }

  clearError() {
    if (this._errorTimeout) {clearTimeout(this._errorTimeout); }
    if (this.dialogRef) { this.dialogRef.close(); }
    this._error = null;
  }
}
