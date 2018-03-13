import { Injectable, InjectionToken, Inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { timeout } from 'rxjs/operators';

export const defaultTimeout = 1000 * 10; // 10 second timeout
export const DEFAULT_TIMEOUT = new InjectionToken<number>('defaultTimeout');

/**
 * The default HttpClient does not provide any timeout for requests.
 * If more than the max allowed number of requests for the HTTP protocol is
 * is in execution, and no reply is given from server, the requests will block
 * all future requests from being made. Thus making the application unresponsive.
 *
 * This becomes a problem when application is run inder a server with low IOPS limitations.
 */
@Injectable()
export class TimeoutInterceptor implements HttpInterceptor {
  constructor(@Inject(DEFAULT_TIMEOUT) protected timeOut) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Max duration before timeout set from header or default
    const newTimeout = Number(req.headers.get('timeout')) || this.timeOut;

    // Replace old timeout value
    let headers: HttpHeaders;
    headers = req.headers.delete('timeout');
    const clonedReq = req.clone({headers: headers});

    // Execute request, but timeout after set duration
    return next.handle(clonedReq).pipe(
      timeout(newTimeout)
    );
  }
}
