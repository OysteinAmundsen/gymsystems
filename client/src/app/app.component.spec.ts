import { ComponentFixture, TestBed, flush, fakeAsync } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from "@ngx-translate/core";
import { Angulartics2GoogleAnalytics } from "angulartics2/ga";
import { UserService } from "./shared/services/api";
import { SwUpdate } from "@angular/service-worker";
import { AppComponent } from "./app.component";
import { IfAuthDirective } from './shared/directives';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from '@angular/common/http';

describe("AppComponent", () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    const angulartics2GoogleAnalyticsStub = { startTracking: () => ({}) };
    const userServiceStub = { getMe: () => of({}) };
    const swUpdateStub = {
      available: of({}),
      activateUpdate: () => Promise.resolve()
    };
    const httpClientStub = {
      get: () => of({})
    };
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })
      ],
      declarations: [AppComponent, IfAuthDirective],
      providers: [
        { provide: HttpClient, useValue: httpClientStub },
        { provide: Angulartics2GoogleAnalytics, useValue: angulartics2GoogleAnalyticsStub },
        { provide: UserService, useValue: userServiceStub },
        { provide: SwUpdate, useValue: swUpdateStub }
      ]
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it("navState defaults to: false", () => {
    expect(component.navState).toEqual(false);
  });

  it("showHelp defaults to: false", () => {
    expect(component.showHelp).toEqual(false);
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      const userServiceStub: UserService = fixture.debugElement.injector.get(UserService);
      spyOn(component, "changeLang");
      spyOn(userServiceStub, "getMe").and.callThrough();
      component.ngOnInit();
      expect(component.changeLang).toHaveBeenCalled();
      expect(userServiceStub.getMe).toHaveBeenCalled();
    });
  });

  describe('language', () => {
    it('can change', fakeAsync(() => {
      component.changeLang('no').toPromise();
      flush();
      expect(component.currentLang).toBe('no');
    }));

    it('can reset', fakeAsync(() => {
      component.changeLang('en').toPromise();
      flush();
      expect(component.currentLang).toBe('en');
    }));
  });
});
