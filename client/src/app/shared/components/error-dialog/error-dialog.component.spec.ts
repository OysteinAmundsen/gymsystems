import { ComponentFixture, TestBed, fakeAsync, tick, discardPeriodicTasks, flush } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from "@angular/material";
import { ErrorDialogComponent } from "./error-dialog.component";
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';

describe("shared.components:ErrorDialogComponent", () => {
  let component: ErrorDialogComponent;
  let fixture: ComponentFixture<ErrorDialogComponent>;

  beforeEach(() => {
    const matDialogRefStub = { close: (dialogResult?: any) => { } };
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        MatDialogModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })
      ],
      declarations: [ErrorDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MAT_DIALOG_DATA, useValue: { header: 'Error-header', message: 'Error-message', autocloseAfter: 10 * 1000 } },
      ]
    });
    fixture = TestBed.createComponent(ErrorDialogComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it("timeRemaining defaults to: 0", () => {
    expect(component.timeRemaining).toEqual(0);
  });

  it("step defaults to: 100", () => {
    expect(component.step).toEqual(100);
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      spyOn(component, "countDown");
      component.ngOnInit();
      expect(component.countDown).toHaveBeenCalled();
    });
  });

  describe("close", () => {
    it("makes expected calls", () => {
      const matDialogRefStub = fixture.debugElement.injector.get(MatDialogRef);
      spyOn(matDialogRefStub, "close");
      component.close();
      expect(matDialogRefStub.close).toHaveBeenCalled();
    });
  });

  // TODO: Error: 1 timer(s) still in the queue.
  // describe("countDown", () => {
  //   it("makes expected calls", fakeAsync(() => {
  //     spyOn(component, "close");
  //     component.countDown();
  //     tick((11 * 1000));
  //     fixture.detectChanges();
  //     discardPeriodicTasks();
  //     expect(component.close).toHaveBeenCalled();
  //     fixture.destroy();
  //   }));
  // });
});
