import { Injectable, Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestMethod } from '@angular/http';
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

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';

import * as moment from 'moment';

import { ErrorHandlerService } from './ErrorHandler.service';
import { AuthStateService } from './auth-state.service';
import { Logger } from '../Logger';


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
      .do(res => {
        // Successful Response;
        if (res instanceof HttpResponse) {
          const action = this.state.notifySubscribers(req, res);
          // Notify user of success
          const now = moment();
          const success = this.translator.instant('SUCCESS');
          if (this.shouldReport(res)) {
            if (action.method === RequestMethod.Post || action.method === RequestMethod.Put) {
              this.snackBar.open(`${this.translator.instant('Saved')} ${now.format('HH:mm:ss')}`, success, { duration: 5 * 1000, });
            } else if (action.method === RequestMethod.Delete) {
              this.snackBar.open(`${this.translator.instant('Deleted')} ${now.format('HH:mm:ss')}`, success, { duration: 5 * 1000, });
            }
          }
        } else if (res.type !== 0) {
          Logger.debug('Response is not HttpResponse', res);
        }
        return res;
      })
      .catch(err => {
        // Something went wrong. Analyze and take action
        // Compile a human readable version of server sent error message
        let message; let error = err;
        if (err.status !== 404) {
          error = typeof err.error === 'string' ? JSON.parse(err.error) : err.error;
        }
        if (error.message) { message = error.message; }
        else { message = err.message; }
        this.error.setError(`${err.status} - ${err.statusText}: ${JSON.stringify(message)}`, err.status);

        // Analyze status
        if (err.status === 401) {
          // We should be logged in, but aren't. Redirect
          this.router.navigate(['/login'], { queryParams: { u: encodeURIComponent(window.location.pathname) } });
        } else if (err.status === 403) {
          // We are in a place we aren't supposed to be. Go up a level and see if that remedies the situation.
          this.router.navigate(['../'], { relativeTo: this.route })
        }

        // Notify and bubble error
        this.state.notifySubscribers(req, err);
        return Observable.throw(this.error.error);
      });
  }

  shouldReport(res: HttpResponse<any>) {
    return !(['login', 'logout'].some(u => res.url.indexOf(u) > -1));
  }
}
