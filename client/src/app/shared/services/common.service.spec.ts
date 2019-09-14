/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CommonService } from './common.service';
import { MatDialogModule } from '@angular/material';

describe('shared.services.Common', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule
      ],
      providers: [CommonService]
    });
  });

  it('should ...', inject([CommonService], (service: CommonService) => {
    expect(service).toBeTruthy();
  }));
});
