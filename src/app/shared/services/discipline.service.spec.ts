import {
  beforeEachProviders,
  it,
  describe,
  expect,
  inject
} from '@angular/core/testing';
import { DisciplineService } from './discipline.service';

describe('Discipline Service', () => {
  beforeEachProviders(() => [DisciplineService]);

  it('should ...',
      inject([DisciplineService], (service: DisciplineService) => {
    expect(service).toBeTruthy();
  }));
});
