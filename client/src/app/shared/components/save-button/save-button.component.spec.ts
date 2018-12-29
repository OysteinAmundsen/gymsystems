import { ComponentFixture, TestBed, fakeAsync, flush } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from "@ngx-translate/core";
import { HttpStateService, HttpAction, HttpMethod } from "app/services/http";
import { SaveButtonComponent } from "./save-button.component";
import { of, ReplaySubject } from 'rxjs';

describe("shared.components:SaveButtonComponent", () => {
  let component: SaveButtonComponent;
  let fixture: ComponentFixture<SaveButtonComponent>;
  const httpAction = new ReplaySubject(1);

  beforeEach(() => {
    const httpStateServiceStub = { httpAction: httpAction };
    httpAction.next({});

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })
      ],
      declarations: [SaveButtonComponent],
      providers: [
        { provide: HttpStateService, useValue: httpStateServiceStub }
      ]
    });
    fixture = TestBed.createComponent(SaveButtonComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it("disabled defaults to: false", () => {
    expect(component.disabled).toEqual(false);
  });

  it("buttonType defaults to: button", () => {
    expect(component.buttonType).toEqual("button");
  });

  it("isSaving defaults to: false", () => {
    expect(component.isSaving).toEqual(false);
  });

  it("success defaults to: false", () => {
    expect(component.success).toEqual(false);
  });

  it("isListening defaults to: false", () => {
    expect(component.isListening).toEqual(false);
  });

  it("subscriptions defaults to: []", () => {
    expect(component.subscriptions).toEqual([]);
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      const httpStateServiceStub = fixture.debugElement.injector.get(HttpStateService);
      spyOn(httpStateServiceStub.httpAction, "subscribe").and.callThrough();
      component.ngOnInit();
      expect(httpStateServiceStub.httpAction.subscribe).toHaveBeenCalled();
    });

    it("reacts to click only", fakeAsync(() => {
      component.ngOnInit();
      httpAction.next({ url: '', method: HttpMethod.Post, isComplete: false });
      flush();
      expect(component.isSaving).toBeFalsy();
      expect(component.isListening).toBeFalsy();
    }));

    it("reacts to save click", fakeAsync(() => {
      component.ngOnInit();
      component.click();
      httpAction.next({ url: '', method: HttpMethod.Post, isComplete: false });
      flush();
      expect(component.isSaving).toBeTruthy();

      httpAction.next({ url: '', method: HttpMethod.Post, isComplete: true });
      flush();
      expect(component.isSaving).toBeFalsy();
      expect(component.isListening).toBeFalsy();
    }));
  });
});
