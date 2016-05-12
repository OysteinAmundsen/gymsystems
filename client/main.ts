import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { Gymsystems2AppComponent, environment } from './app';

if (environment.production) {
  enableProdMode();
}

bootstrap(Gymsystems2AppComponent);
