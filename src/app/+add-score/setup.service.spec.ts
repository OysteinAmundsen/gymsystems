import {
  beforeEachProviders,
  it,
  describe,
  expect,
  inject
} from '@angular/core/testing';
import { SetupService } from './setup.service';

describe('Setup Service', () => {
  beforeEachProviders(() => [SetupService]);

  it('should ...',
      inject([SetupService], (service: SetupService) => {
    expect(service).toBeTruthy();
  }));
});
