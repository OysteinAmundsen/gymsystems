import { TestBed, inject } from '@angular/core/testing';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule, MatProgressBarModule } from '@angular/material';

import { ErrorHandlerService } from './ErrorHandler.service';
import { ErrorDialogComponent } from 'app/shared/components/error-dialog/error-dialog.component';
import { TranslateModuleTest } from 'app/app.module.spec';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    MatDialogModule,
    MatProgressBarModule,
    TranslateModuleTest,
  ],
  declarations: [
    ErrorDialogComponent
  ],
  exports: [
    ErrorDialogComponent
  ],
  entryComponents: [ErrorDialogComponent]
})
export class TestModule { }

describe('services.config:ErrorHandlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestModule
      ],
      providers: [ErrorHandlerService]
    });
  });

  it('can be injected', inject([ErrorHandlerService], (service: ErrorHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
