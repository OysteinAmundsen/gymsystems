import {Injectable} from '@angular/core';
import { Http, Request, Response, RequestOptionsArgs, RequestOptions, XHRBackend } from '@angular/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

@Injectable()
export class AuthHttp extends Http {
  constructor(backend: XHRBackend, defaultOptions: RequestOptions, private router: Router) {
    super(backend, defaultOptions);

    //Prevent Ajax Request Caching for Internet Explorer
    defaultOptions.headers.append('Cache-control', 'no-cache');
    defaultOptions.headers.append('Cache-control', 'no-store');
    defaultOptions.headers.append('Pragma', 'no-cache');
    defaultOptions.headers.append('Expires', '0');
  }

  isUnauthorized(status: number): boolean {
    return status === 401;
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    let errMsg: string;

    return super.request(url, options).map(res => {
      //Successful Response;
      return res;
    })
    .catch((err: any) => {
      if (this.isUnauthorized(err.status)) {
        this.router.navigate(['/login']);
      }
      else {
        const body = err.text() || '';
        errMsg = `${err.status} - ${err.statusText || ''}: ${body}`;
      }
      return Observable.throw(errMsg);
    });
  }
}
