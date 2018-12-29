import { TestBed } from "@angular/core/testing";
import { TemplateRef } from "@angular/core";
import { ViewContainerRef } from "@angular/core";
import { UserService } from "app/services/api";
import { Role } from "app/model";
import { IfAuthDirective } from "./if-auth.directive";

describe("shared.directives:IfAuthDirective", () => {
  let directive: IfAuthDirective;

  beforeEach(() => {
    const templateRefStub = {};
    const viewContainerRefStub = {
      clear: () => ({}),
      createEmbeddedView: () => ({})
    };
    const userServiceStub = {};
    TestBed.configureTestingModule({
      providers: [
        IfAuthDirective,
        { provide: TemplateRef, useValue: templateRefStub },
        { provide: ViewContainerRef, useValue: viewContainerRefStub },
        { provide: UserService, useValue: userServiceStub }
      ]
    });
    directive = TestBed.get(IfAuthDirective);
  });
  it("can load instance", () => {
    expect(directive).toBeTruthy();
  });
  it("visible defaults to: false", () => {
    expect(directive.visible).toEqual(false);
  });
  it("roles defaults to: Role", () => {
    expect(directive.roles).toEqual(Role);
  });
  describe("hide", () => {
    it("makes expected calls", () => {
      const viewContainerRefStub: ViewContainerRef = TestBed.get(ViewContainerRef);
      spyOn(viewContainerRefStub, "clear");
      directive.hide();
      expect(viewContainerRefStub.clear).toHaveBeenCalled();
    });
  });
  describe("show", () => {
    it("makes expected calls", () => {
      const viewContainerRefStub: ViewContainerRef = TestBed.get(ViewContainerRef);
      spyOn(viewContainerRefStub, "createEmbeddedView");
      directive.show();
      expect(viewContainerRefStub.createEmbeddedView).toHaveBeenCalled();
    });
  });
});
