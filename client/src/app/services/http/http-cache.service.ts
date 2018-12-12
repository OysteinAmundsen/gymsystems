import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HttpCacheService {
  cache: {[url: string]: any} = [];

  constructor() { }

  contains(url: string) {
    return this.cache.hasOwnProperty(url);
  }

  get(url: string) {
    return this.cache[url];
  }

  add(url: string, obj: any) {
    this.cache[url] = obj;
  }

  invalidate(url: string) {
    delete this.cache[url];
  }

  invalidateAll(urlPart?: string) {
    if (urlPart) {
      // invalidate all urls resembling given
      Object.keys(this.cache).forEach(key => {
        if (key.indexOf(urlPart) > -1) {
          this.invalidate(key);
        }
      });
    } else {
      this.cache = [];
    }
  }
}
