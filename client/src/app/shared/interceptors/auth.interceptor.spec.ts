import { TestBed } from "@angular/core/testing";
import { Injector } from "@angular/core";
import { HttpRequest, HttpHandler, HttpResponse } from "@angular/common/http";
import { MatSnackBar } from "@angular/material";
import { JwtHelperService } from "@auth0/angular-jwt";
import { ErrorHandlerService } from "app/shared/interceptors/error-handler.service";
import { HttpStateService } from "app/shared/interceptors/http-state.service";
import { AuthInterceptor } from "./auth.interceptor";
import { of } from 'rxjs';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { Role } from 'app/model';
import { HttpMethod } from './http-method';
import { RouterTestingModule } from '@angular/router/testing';

describe("shared.interceptors:AuthInterceptor", () => {
  let service: AuthInterceptor;
  const mockSessionStorage = {
    getItem: () => JSON.stringify({ id: 1, name: 'Test User', role: Role.Organizer, club: { id: 1, name: 'Test club' }, token: 'ThisIsAnInvalidToken' })
  };

  beforeEach(() => {
    const injectorStub = {};

    const httpRequestStub = { headers: { has: () => false } };
    const httpResponseStub = new HttpResponse({
      body: {},
      status: 200,
      statusText: 'Ok',
      url: '/nowhere'
    });
    const httpHandlerStub = { handle: () => of(httpResponseStub) };

    const matSnackBarStub = { open: () => ({}) };
    const errorHandlerServiceStub = {
      message: '',
      error: { code: 200, message: '' },
      setError: () => ({})
    };
    const httpStateServiceStub = { notifySubscribers: () => ({ method: HttpMethod.Get }) };
    const jwtHelperServiceStub = { isTokenExpired: () => false };

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })
      ],
      providers: [
        AuthInterceptor,
        { provide: Injector, useValue: injectorStub },
        { provide: HttpRequest, useValue: httpRequestStub },
        { provide: HttpHandler, useValue: httpHandlerStub },
        { provide: HttpResponse, useValue: httpResponseStub },
        { provide: MatSnackBar, useValue: matSnackBarStub },
        { provide: ErrorHandlerService, useValue: errorHandlerServiceStub },
        { provide: HttpStateService, useValue: httpStateServiceStub },
        { provide: JwtHelperService, useValue: jwtHelperServiceStub }
      ]
    });
    service = TestBed.get(AuthInterceptor);
  });

  it("can load instance", () => {
    expect(service).toBeTruthy();
  });

  describe("intercept", () => {
    it("handles http 200 request", () => {
      const httpHandlerStub: HttpHandler = TestBed.get(HttpHandler);
      const httpStateServiceStub: HttpStateService = TestBed.get(HttpStateService);
      const jwtHelperServiceStub: JwtHelperService = TestBed.get(JwtHelperService);

      spyOn(sessionStorage, 'getItem').and.callFake(mockSessionStorage.getItem);
      spyOn(jwtHelperServiceStub, "isTokenExpired");
      spyOn(httpStateServiceStub, "notifySubscribers").and.callThrough();
      spyOn(httpHandlerStub, "handle").and.callThrough();
      spyOn(service, "validateResponse");

      service.intercept(TestBed.get(HttpRequest), httpHandlerStub).subscribe(
        data => {
          expect(sessionStorage.getItem).toHaveBeenCalled();
          expect(jwtHelperServiceStub.isTokenExpired).toHaveBeenCalled();
          expect(httpStateServiceStub.notifySubscribers).toHaveBeenCalled();
          expect(httpHandlerStub.handle).toHaveBeenCalled();
          expect(service.validateResponse).toHaveBeenCalled();
        },
        error => fail('A valid request should not throw')
      );
    });


    // A REST request returning anything but HTTP 200 will throw immediatelly,
    // but a graphql request will allways return a valid response. We have to
    // Check it for errors in the response handler
    // FIXME: Don't know why this throws a warning: You provided 'undefined' where a stream was expected.
    // it("handles http 400 request", () => {
    //   const httpHandlerStub = {
    //     handle: () => of(new HttpResponse({
    //       body: { errors: [{ message: { statusCode: 400, error: 'Unknown' } }] },
    //       status: 400,
    //       statusText: 'Unknown',
    //       url: '/nowhere'
    //     }))
    //   };

    //   spyOn(service, "handleError");
    //   service.intercept(TestBed.get(HttpRequest), httpHandlerStub).subscribe(
    //     data => fail('Should have failed with 400 error'),
    //     error => {
    //       expect(service.handleError).toHaveBeenCalled();
    //     }
    //   );
    // });
  });

  describe("validateResponse", () => {
  });

  describe("analyzeAndReport", () => {
    it("Should notify on save requests", () => {
      const httpStateServiceStub: HttpStateService = TestBed.get(HttpStateService);
      const matSnackBarStub: MatSnackBar = TestBed.get(MatSnackBar);

      spyOn(httpStateServiceStub, 'notifySubscribers').and.callFake(() => ({ url: '', operation: 'save', method: HttpMethod.Post, values: {}, isComplete: false, failed: false }));
      spyOn(matSnackBarStub, "open");
      service.analyzeAndReport(TestBed.get(HttpRequest), TestBed.get(HttpResponse));
      expect(matSnackBarStub.open).toHaveBeenCalled(); // Should present a snack for POST requests
    });


    it("Should notify on delete requests", () => {
      const httpStateServiceStub: HttpStateService = TestBed.get(HttpStateService);
      const matSnackBarStub: MatSnackBar = TestBed.get(MatSnackBar);

      spyOn(httpStateServiceStub, 'notifySubscribers').and.callFake(() => ({ url: '', operation: 'delete', method: HttpMethod.Post, values: {}, isComplete: false, failed: false }));
      spyOn(matSnackBarStub, "open");
      service.analyzeAndReport(TestBed.get(HttpRequest), TestBed.get(HttpResponse));
      expect(matSnackBarStub.open).toHaveBeenCalled(); // Should present a snack for DELETE requests
    });
  });

  describe("checkError", () => {
  });

  describe("handleError", () => {
    // it("handles http 401 request", () => {
    //   const routerStub = TestBed.get('Router');

    //   const httpHandlerStub = {
    //     handle: () => of(new HttpResponse({
    //       body: { errors: [{ message: { statusCode: 401, error: 'Unknown' } }] },
    //       status: 401,
    //       statusText: 'Unknown',
    //       url: '/nowhere'
    //     }))
    //   };

    //   spyOn(routerStub, "navigate");
    //   service.intercept(TestBed.get(HttpRequest), httpHandlerStub).subscribe(
    //     data => fail('Should have failed with 401 error'),
    //     error => {
    //       expect(routerStub.navigate).toHaveBeenCalled();
    //     }
    //   );
    // });

    // it("should not redirect if request header 'noReport' is set", () => {
    //   const routerStub = TestBed.get('Router');

    //   const httpHandlerStub = {
    //     handle: () => of(new HttpResponse({
    //       body: { errors: [{ message: { statusCode: 401, error: 'Unknown' } }] },
    //       status: 401,
    //       statusText: 'Unknown',
    //       url: '/nowhere'
    //     }))
    //   };

    //   spyOn(routerStub, "navigate");
    //   service.intercept(<HttpRequest<any>><unknown>{ headers: { has: () => true } }, httpHandlerStub).subscribe(
    //     data => fail('Should have failed with 401 error'),
    //     error => {
    //       expect(routerStub.navigate).not.toHaveBeenCalled();
    //     }
    //   );
    // });
  });
});
