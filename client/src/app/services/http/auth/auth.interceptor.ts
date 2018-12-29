import { Injectable, Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse, HttpEvent } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material';

import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import * as moment from 'moment';

import { ErrorHandlerService } from 'app/services/http/error-handler.service';
import { HttpStateService } from 'app/services/http/http-state.service';
import { Logger } from 'app/services/Logger';
import { HttpMethod } from 'app/services/http/http-method.enum';
import { UserService } from 'app/services/api';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CommonService } from 'app/shared/common.service';
import { graphqlUri } from 'app/graphql.module';


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
    private snackBar: MatSnackBar
  ) { }

  /**
   * HttpInterceptor implmentation
   */
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Check token expiration
    const user = sessionStorage.getItem('currentUser');
    if (user && this.jwt.isTokenExpired(JSON.parse(user).token)) {
      sessionStorage.removeItem('currentUser');
    }

    // Execute request
    this.state.notifySubscribers(req);
    return next.handle(req).pipe(
      map(res => res.type !== 0 ? this.validateResponse(req, <HttpResponse<any>>res) : res),
      catchError(err => this.handleError(req, err))
    );
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
    if (res.status !== 200 || (body && body.errors && body.errors.some(e => e.message.statusCode !== 200))) {
      if (res.body && res.body.errors && res.body.errors.length > 0) {
        // GraphQL Error
        const message = res.body.errors[0].message;
        throw new Error(JSON.stringify({ status: message.statusCode, statusText: message.error, error: message.message }));
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
    let error = JSON.parse(errorMessage.message);

    if (!(req.headers.has('noReport') || (req.body.extensions && req.body.extensions.noReport))) {
      if (error.status) {
        // Analyze status
        if (error.status === 401) {
          // We should be logged in, but aren't. Redirect
          this.router.navigate(['/login'], { queryParams: { u: encodeURIComponent(window.location.pathname) } });
        } else if (error.status === 403) {
          // We are in a place we aren't supposed to be. Go up a level and see if that remedies the situation.
          this.router.navigate(['../'], { relativeTo: this.route });
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
