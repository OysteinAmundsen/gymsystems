import {Injectable} from '@angular/core';
import { Http, Request, Response, RequestOptionsArgs, RequestOptions, XHRBackend } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

import { UserService } from 'app/services/api';
import { ErrorHandlerService } from "app/services/config/ErrorHandler.service";

@Injectable()
export class AuthHttp extends Http {
  constructor(backend: XHRBackend, defaultOptions: RequestOptions, private router: Router, private error: ErrorHandlerService) {
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

    return super.request(url, options).map(res => {
      //Successful Response;
      return res;
    })
    .catch((err: any) => {
      if (err.status === 401) {
        me.router.navigate(['/login'], { queryParams: { u: encodeURIComponent(window.location.pathname) } });
      }
      else {
        const body = err.text() || '';
        errMsg = `${err.status} - ${err.statusText || ''}: ${body}`;
        this.error.error = errMsg;
      }
      return Observable.throw(errMsg);
    });
  }
}
