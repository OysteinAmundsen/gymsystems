import { Injectable } from '@angular/core';
import { Http, Request, Response, RequestOptionsArgs, RequestOptions, XHRBackend, RequestMethod } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

import { ErrorHandlerService } from 'app/services/config/ErrorHandler.service';
import { Subject } from 'rxjs/Subject';

export interface HttpAction {
  url: string;
  method: RequestMethod;
  isComplete?: boolean;
  failed?: boolean;
  values?: any
}

@Injectable()
export class HttpInterceptor extends Http {
  public httpAction: Subject<HttpAction> = new Subject();
  constructor(
    backend: XHRBackend,
    defaultOptions: RequestOptions,
    private router: Router,
    private route: ActivatedRoute,
    private error: ErrorHandlerService
  ) {
    super(backend, defaultOptions);

    // Prevent Ajax Request Caching for Internet Explorer
    defaultOptions.headers.append('Cache-control', 'no-cache');
    defaultOptions.headers.append('Cache-control', 'no-store');
    defaultOptions.headers.append('Pragma', 'no-cache');
    defaultOptions.headers.append('Expires', '0');
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    let errMsg: string;
    const me = this;

    if (url instanceof Request) {
      this.httpAction.next({url: url.url, method: url.method, values: url.getBody()});
    }
    return super.request(url, options).map(res => {
      // Successful Response;
      if (url instanceof Request) {
        this.httpAction.next({url: url.url, method: url.method, isComplete: true, values: res});
      }
      return res;
    })
    .catch((err: Response) => {
      if (err.status === 401) {
        this.error.error = err.statusText + ' - ' + err.json().message;
        this.router.navigate(['/login'], { queryParams: { u: encodeURIComponent(window.location.pathname) } });
      } else {
        let body: any;
        try { body = err.json(); } catch (ex) { body = err.text() || ''; }
        errMsg = `${err.status} - ${err.statusText || ''}: ${body.message ? body.message : err.url}`;
        this.error.error = errMsg;
        this.router.navigate(['../'], { relativeTo: this.route })
      }
      if (url instanceof Request) {
        this.httpAction.next({url: url.url, method: url.method, isComplete: true, failed: true, values: err});
      }
      return Observable.throw(errMsg);
    });
  }
}
