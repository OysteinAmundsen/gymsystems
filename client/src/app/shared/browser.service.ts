import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { PLATFORM_BROWSER_ID, PLATFORM_SERVER_ID } from '@angular/common/src/platform_id';

const storageMock = <Storage><unknown>{
  // We are in a node environment. Just return a mock
  getItem: (): string => null,
  setItem: (): void => { },
  removeItem: (): void => { }
};

@Injectable({ providedIn: 'root' })
export class BrowserService {
  static localStorage(): Storage {
    return (typeof window !== 'undefined' ? window.sessionStorage : storageMock);
  }

  static sessionStorage(): Storage {
    return (typeof window !== 'undefined' ? window.sessionStorage : storageMock);
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  sessionStorage() {
    return BrowserService.sessionStorage();
  }

  localStorage() {
    return BrowserService.localStorage();
  }

  window() {
    return isPlatformBrowser(this.platformId) ? window : <any>{}
  }

  document() {
    return isPlatformBrowser(this.platformId) ? document : <any>{
      querySelectorAll: () => { }
    }
  }
}
