import { Injectable, Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse, HttpEvent } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material';

import { throwError, of, Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import * as moment from 'moment';

import { ErrorHandlerService } from 'app/shared/interceptors/error-handler.service';
import { HttpStateService } from 'app/shared/interceptors/http-state.service';
import { UserService } from 'app/shared/services/api';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BrowserService } from '../browser.service';
import { Logger } from '../services/Logger';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  // Cache TranslateService as this could not be auto injected through
  // the constructor. Cyclic dependency issue
  _translator: TranslateService;
  get translator(): TranslateService {
    return (this._translator =
      this._translator || this.injector.get(TranslateService));
  }

  _userService: UserService;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private jwt: JwtHelperService,
    private error: ErrorHandlerService,
    private state: HttpStateService,
    private injector: Injector,
    private snackBar: MatSnackBar,
    private browser: BrowserService
  ) { }

  /**
   * HttpInterceptor implmentation
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Check token expiration
    const user = this.browser.sessionStorage().getItem('currentUser');
    if (user && this.jwt.isTokenExpired(JSON.parse(user).token)) {
      this.browser.sessionStorage().removeItem('currentUser');
    }

    req = this.stripTypeNames(req);

    // Execute request
    this.state.notifySubscribers(req);
    return next.handle(req).pipe(
      tap(res => res.type !== 0 ? this.validateResponse(req, <HttpResponse<any>>res) : res),
      catchError(err => this.handleError(req, err))
    );
  }

  stripTypeNames(req: HttpRequest<any>): HttpRequest<any> {
    if (req.body && req.body.query) {
      // https://github.com/apollographql/react-apollo/issues/741
      req.body.query = req.body.query.replace(/,.?__typename:.?"[a-zA-Z]+"/gm, '');
    }
    return req;
  }

  /**
   * Intercept response and check for errors.
   *
   * If status of request is !== 200, the handler will throw and this method will not be executed.
   * But graphql queries will allways return 200 status in the response and rather hide the REAL status
   * inside an errors array in the body.
   */
  validateResponse(req: HttpRequest<any>, res: HttpResponse<any>) {
    // Successful Response;
    // Detect error response, but with 200 status
    this.checkError(req, res);

    // Notify user of operation success if needed
    this.analyzeAndReport(req, res);
    return res;
  }

  /**
   * Analyse response and notify user if nescessary.
   *
   * If this is either a data persistance request or a data removal request, the user should be notified.
   * But detecting which type can be tricky when we're dealing with graphql requests because graphql
   * only operates under the HTTP GET or POST verbs, nothing more. Identifying the type of query requires
   * us to keep a naming convention on our graph api.
   *
   * If the request body contains a `mutation`, it is either a save or a delete request. If it in addition
   * also contains `{save` or `{delete`, we have enough to identify it.
   *
   * For REST requests, this identification is conciderably easier. We relly on POST/PUT requests for data
   * persistance, and DELETE requests for identification.
   */
  analyzeAndReport(req: HttpRequest<any>, res: HttpResponse<any>) {
    const action = this.state.notifySubscribers(req, res);
    const isSave = action.operation === 'save';
    const isDelete = action.operation === 'delete';

    if ((isSave || isDelete) && !['login', 'logout'].some(u => res.url.indexOf(u) > -1)) {
      const now = moment();
      const success = this.translator.instant('SUCCESS');
      this.snackBar.open(`${this.translator.instant(isSave ? 'Saved' : 'Deleted')} ${now.format('HH:mm:ss')}`, success, { duration: 5 * 1000 });
    }
  }

  /**
   * Detect if the response is really an error and therefore subject of the error handler or not.
   *
   * REST requests will give a status !== 200 if they're in error, which will default throw in the handler.
   * But GraphQL requests will always return a status of 200 in the main response body, and hide it's real status
   * inside a `errors` array.
   */
  checkError(req: HttpRequest<any>, res: HttpResponse<any>) {
    const body = res.body;
    if (req.headers.has('noReport') || (req.body && req.body.extensions && req.body.extensions.noReport)) { return; }
    if (res.status >= 400 || (body && body.errors && body.errors.some(e => e.message.statusCode !== 200))) {
      if (res.body && res.body.errors && res.body.errors.length > 0) {
        // GraphQL Error
        const message = res.body.errors[0].message;
        if (typeof message === 'string') {
          // Just a warning, not an actual error.
          Logger.debug(message);
          return;
        } else {
          // Error ... for real!
          let url = req.url;
          const m = req.body.query.match(/([\w\d]+\([\w\s:\d]+\))/); // match gql query
          if (m) {
            url += '{' + m.reduce((prev, curr) => (prev.indexOf(curr) < 0 ? prev += curr : prev), '') + '}';
          }
          throw new Error(JSON.stringify({ status: message.statusCode, statusText: message.error, error: message.message || url }));
        }
      }

      // Something else has gone wrong (should really never happen).
      throw new Error(JSON.stringify({ error: res.body }));
    }
  }

  /**
   * Our default error handler. This will take any information attached to an
   * exception, and compile a human readable message to our user.
   */
  handleError(req: HttpRequest<any>, errorMessage: any) {
    // Something went wrong. Analyze and take action
    // Compile a human readable version of server sent error message
    let error = errorMessage.message.indexOf('{') > -1 ? JSON.parse(errorMessage.message) : errorMessage;

    if (!(req.headers.has('noReport') || (req.body && req.body.extensions && req.body.extensions.noReport))) {
      if (error.status) {
        // Analyze status
        if (error.status === 401) {
          // We should be logged in, but aren't. Redirect
          this.router.navigate(['/login'], { queryParams: { u: encodeURIComponent(this.browser.window().location.pathname) } });
        } else if (error.status === 403) {
          // We are in a place we aren't supposed to be. Go up a level and see if that remedies the situation.
          this.router.navigate(['/' + this.router.url.split('/').slice(1, -1).join('/')]);
        } else {
          // For everything else...
          if (error.error) {
            error = typeof error.error === 'string' ? JSON.parse(error.error) : errorMessage.error;
          }
        }
      }
      const header = `${error.status ? error.status + ' - ' : ''} ${error.statusText ? error.statusText + ':' : ''}`;
      const message = `${error.error}`;
      this.error.setError(message, header, errorMessage.stack ? errorMessage.stack.replace(errorMessage.message, '') : undefined);

      // Notify and bubble error
      this.state.notifySubscribers(req, errorMessage);
    }
    return throwError(this.error.error);
  }
}
