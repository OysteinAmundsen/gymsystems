import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const storageMock = <Storage><unknown>{
  // We are in a node environment. Just return a mock
  getItem: (): string => null,
  setItem: (): void => { },
  removeItem: (): void => { }
};

const locationMock = <Location><unknown>{
  protocol: '',
  host: ''
}

/**
 * Service for retreiving common browser objects. This provides unit-test-safety
 * as these objects logically does not exist in a test environment.
 */
@Injectable({ providedIn: 'root' })
export class BrowserService {
  static localStorage(): Storage {
    return (BrowserService.isBrowser() ? window.localStorage : storageMock);
  }

  static sessionStorage(): Storage {
    return (BrowserService.isBrowser() ? window.sessionStorage : storageMock);
  }

  static location(): Location {
    return (BrowserService.isBrowser() ? window.location : locationMock)
  }

  static isBrowser(): boolean {
    return (typeof window !== 'undefined');
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  sessionStorage(): Storage {
    return BrowserService.sessionStorage();
  }

  localStorage(): Storage {
    return BrowserService.localStorage();
  }

  window(): Window {
    return isPlatformBrowser(this.platformId) ? window : <any>{}
  }

  location(): Location {
    return isPlatformBrowser(this.platformId) ? location : locationMock;
  }

  document(): Document {
    return isPlatformBrowser(this.platformId) ? document : <any>{
      querySelectorAll: () => { }
    }
  }
}
