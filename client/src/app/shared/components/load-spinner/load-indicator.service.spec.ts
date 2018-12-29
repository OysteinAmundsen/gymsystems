import { TestBed } from '@angular/core/testing';
import { LoadIndicatorService } from './load-indicator.service';
import { MatDialog } from '@angular/material';

describe('LoadIndicatorService', () => {
  let service: LoadIndicatorService;

  beforeEach(() => {
    const matDialogStub = {
      open: () => ({
        afterClosed: () => ({
          toPromise: () => ({
            issue: {},
            then: () => ({})
          })
        })
      })
    };
    TestBed.configureTestingModule({
      providers: [
        LoadIndicatorService,
        { provide: MatDialog, useValue: matDialogStub },
      ]
    });
    service = TestBed.get(LoadIndicatorService);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });

});
