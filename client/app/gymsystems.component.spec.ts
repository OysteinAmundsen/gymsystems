import {
  beforeEachProviders,
  describe,
  expect,
  it,
  inject
} from '@angular/core/testing';
import { GymsystemsAppComponent } from '../app/gymsystems.component';

beforeEachProviders(() => [GymsystemsAppComponent]);

describe('App: Gymsystems', () => {
  it('should create the app',
      inject([GymsystemsAppComponent], (app: GymsystemsAppComponent) => {
    expect(app).toBeTruthy();
  }));
});
