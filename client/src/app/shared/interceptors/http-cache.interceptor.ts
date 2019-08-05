import { HttpCacheService } from './http-cache.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { graphqlUri } from 'app/graphql.module';

/**
 * Intercepting all HTTP requests, caching every GET, if not a 'noCache' header is set.
 * If a PUT, POST or DELETE is executed, the global cache is invalidated.
 *
 */
@Injectable()
export class HttpCacheInterceptor implements HttpInterceptor {
  constructor(private cache: HttpCacheService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.indexOf(graphqlUri) > -1) {
      // This interceptor has no effect on GraphQL requests, since they are all POST requests. Just move along quickly.
      return next.handle(req);
    }


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
        const done = !(Object.keys(result).length === 1 && result.type === 0);
        // Cache result
        if (done && req.method === 'GET' && !req.headers.has('noCache')) {
          this.cache.add(req.urlWithParams, result);
        }
        // Return original result
        return result;
      })
    );
  }
}
