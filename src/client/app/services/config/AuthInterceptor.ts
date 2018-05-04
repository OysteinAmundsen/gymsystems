import { Injectable, Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpSentEvent,
  HttpHeaderResponse,
  HttpUserEvent,
  HttpProgressEvent,
  HttpResponse,
  HttpHeaders
} from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material';

import { Observable, Subject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import * as moment from 'moment';

import { ErrorHandlerService } from './ErrorHandler.service';
import { AuthStateService } from './auth-state.service';
import { Logger } from '../Logger';
import { HttpMethod } from './HttpMethod';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  // Cache TranslateService as this could not be auto injected through
  // the constructor. Cyclic dependency issue
  _translator: TranslateService;
  get translator(): TranslateService {
    return this._translator = this._translator || this.injector.get(TranslateService);
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private error: ErrorHandlerService,
    private state: AuthStateService,
    private injector: Injector,
    private snackBar: MatSnackBar
  ) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
    this.state.notifySubscribers(req);

    // Prevent Ajax Request Caching for Internet Explorer
    let headers: HttpHeaders;
    headers = req.headers.append('Cache-control', 'no-cache');
    headers = req.headers.append('Cache-control', 'no-store');
    headers = req.headers.append('Pragma', 'no-cache');
    headers = req.headers.append('Expires', '0');

    const clonedReq = req.clone({ headers: headers});
    return next.handle(clonedReq)
      .pipe(
        map(res => {
          // Successful Response;
          if (res instanceof HttpResponse) {
            const action = this.state.notifySubscribers(req, res);

            // Detect error response, but with 200 status
            if (this.isError(res)) {
              throw new Error(JSON.stringify({error: res.body}));
            }

            // Notify user of success
            const now = moment();
            const success = this.translator.instant('SUCCESS');
            if (this.shouldReport(res)) {
              if (action.method === HttpMethod.Post || action.method === HttpMethod.Put) {
                this.snackBar.open(`${this.translator.instant('Saved')} ${now.format('HH:mm:ss')}`, success, { duration: 5 * 1000, });
              } else if (action.method === HttpMethod.Delete) {
                this.snackBar.open(`${this.translator.instant('Deleted')} ${now.format('HH:mm:ss')}`, success, { duration: 5 * 1000, });
              }
            }
          } else if (res.type !== 0) {
            Logger.debug('Response is not HttpResponse', res);
          }
          return res;
        }),
        catchError(err => {
          // Something went wrong. Analyze and take action
          // Compile a human readable version of server sent error message
          let status; let header; let statusText; let message; let error = err;

          if (err.status) {
            // Analyze status
            if (err.status === 401) {
              // We should be logged in, but aren't. Redirect
              this.router.navigate(['/login'], { queryParams: { u: encodeURIComponent(window.location.pathname) } });
            } else if (err.status === 403) {
              // We are in a place we aren't supposed to be. Go up a level and see if that remedies the situation.
              this.router.navigate(['../'], { relativeTo: this.route });
            } else {
              // For everything else...
              if (err.error) {
                error = typeof err.error === 'string' ? JSON.parse(err.error) : err.error;
              }
              status = err.status;
              statusText = err.statusText;
              header = status;
            }

            message = JSON.stringify(error.message ? error.message : err.message);
          }
          if (err instanceof Error) {
            if (typeof err.message === 'string') {
              header = err.message;
              message = err.stack ? err.stack : '';
            } else {
              error = JSON.parse(err.message);
              header = error.error.code;
              message = error.error.message.replace(header, '');
            }
          }
          this.error.setError((status ? `${status} - ` : '') + (statusText ? `${statusText}:` : '') + ` ${message}`, header);


          // Notify and bubble error
          this.state.notifySubscribers(req, err);
          return throwError(this.error.error);
        })
      );
  }

  isError(res: HttpResponse<any>) {
    return res.body && (JSON.stringify(Object.keys(res.body)) === JSON.stringify(['code', 'message']));
  }

  shouldReport(res: HttpResponse<any>) {
    return !(['login', 'logout'].some(u => res.url.indexOf(u) > -1));
  }
}
