import { HttpCacheService } from './../http-cache.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Intercepting all HTTP requests, caching every GET, if not a 'noCache' header is set.
 * If a PUT, POST or DELETE is executed, the global cache is invalidated.
 */
@Injectable()
export class HttpCacheInterceptor implements HttpInterceptor {
  constructor(private cache: HttpCacheService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (['PUT', 'POST', 'DELETE'].indexOf(req.method) > -1) {
      // Force reload of cache after a modification is done.
      this.cache.invalidateAll();
    } else if (req.method === 'GET' && !req.headers.has('noCache') && this.cache.contains(req.urlWithParams)) {
      // Exists in cache. Return cached result instead of executing the http query
      return of(this.cache.get(req.urlWithParams));
    }

    // Execute request
    return next.handle(req).pipe(
      map(result => {
        // Cache result
        if (req.method === 'GET' && !req.headers.has('noCache')) {
          this.cache.add(req.urlWithParams, result);
        }
        // Return original result
        return result;
      })
    );
  }
}
