import {
  beforeEachProviders,
  it,
  describe,
  expect,
  inject
} from '@angular/core/testing';
import { TeamsService } from './teams.service';

describe('Teams Service', () => {
  beforeEachProviders(() => [TeamsService]);

  it('should ...',
      inject([TeamsService], (service: TeamsService) => {
    expect(service).toBeTruthy();
  }));
});
