import { TestBed } from "@angular/core/testing";
import { MatDialog } from "@angular/material";
import { ErrorHandlerService } from "./error-handler.service";

describe("shared.interceptors.ErrorHandlerService", () => {
  let service: ErrorHandlerService;

  beforeEach(() => {
    const matDialogStub = { open: () => ({}) };
    TestBed.configureTestingModule({
      providers: [
        ErrorHandlerService,
        { provide: MatDialog, useValue: matDialogStub }
      ]
    });
    service = TestBed.get(ErrorHandlerService);
  });

  it("can load instance", () => {
    expect(service).toBeTruthy();
  });
});
