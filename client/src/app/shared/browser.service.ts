import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const storageMock = <Storage><unknown>{
  // We are in a node environment. Just return a mock
  getItem: (): string => null,
  setItem: (): void => { },
  removeItem: (): void => { }
};

/**
 * Service for retreiving common browser objects. This provides unit-test-safety
 * as these objects logically does not exist in a test environment.
 */
@Injectable({ providedIn: 'root' })
export class BrowserService {
  static localStorage(): Storage {
    return (typeof window !== 'undefined' ? window.localStorage : storageMock);
  }

  static sessionStorage(): Storage {
    return (typeof window !== 'undefined' ? window.sessionStorage : storageMock);
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

  document(): Document {
    return isPlatformBrowser(this.platformId) ? document : <any>{
      querySelectorAll: () => { }
    }
  }
}
