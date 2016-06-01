import {
  beforeEachProviders,
  describe,
  expect,
  it,
  inject
} from '@angular/core/testing';
import { Gymsystems2AppComponent } from '../app/gymsystems2.component';

beforeEachProviders(() => [Gymsystems2AppComponent]);

describe('App: Gymsystems2', () => {
  it('should create the app',
      inject([Gymsystems2AppComponent], (app: Gymsystems2AppComponent) => {
    expect(app).toBeTruthy();
  }));
});
