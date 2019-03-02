import { Injectable, Injector } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ErrorDialogComponent } from 'app/shared/components/error-dialog/error-dialog.component';

/**
 * Generic error handler. Error message is displayed in app.component
 */
@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  private dialogRef: MatDialogRef<ErrorDialogComponent>;

  private _error: string;
  get error() { return this._error; }

  constructor(private dialog: MatDialog) { }

  setError(value: string, header?: string, stack?: string) {
    this.clearError();
    if (value) {
      if (typeof value === 'string') {
        this._error = value.replace(/^"|"$/g, '');
      } else if (typeof value === 'object') {
        this._error = value['message'] ? value['message'] : value[0];
      }
      const opts = {
        header: header,
        message: this._error,
        stack: stack,
        autocloseAfter: 10 * 1000
      };
      this.dialogRef = this.dialog.open(ErrorDialogComponent, { data: opts });
    }
  }

  clearError() {
    if (this.dialogRef) { this.dialogRef.close(); }
    this._error = null;
  }
}
