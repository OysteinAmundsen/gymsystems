import { TestBed } from "@angular/core/testing";
import { HttpRequest } from "@angular/common/http";
import { HttpResponse } from "@angular/common/http";
import { HttpStateService } from "./http-state.service";

describe("HttpStateService", () => {
  let service: HttpStateService;
  beforeEach(() => {
    const httpRequestStub = { method: {} };
    const httpResponseStub = { status: {} };
    TestBed.configureTestingModule({
      providers: [
        HttpStateService,
        { provide: HttpRequest, useValue: httpRequestStub },
        { provide: HttpResponse, useValue: httpResponseStub }
      ]
    });
    service = TestBed.get(HttpStateService);
  });
  it("can load instance", () => {
    expect(service).toBeTruthy();
  });
});
