import { Injectable } from '@angular/core';
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

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';

import { ErrorHandlerService } from './ErrorHandler.service';
import { AuthStateService } from './auth-state.service';
import { Logger } from '../Logger';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private error: ErrorHandlerService,
    private state: AuthStateService) { }

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
          this.state.notifySubscribers(req, res);
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
        this.error.error = `${err.status} - ${err.statusText}: ${JSON.stringify(message)}`;

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

}
