import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { UserService } from "app/shared/services/api";
import { MatAutocompleteSelectedEvent, MatAutocompleteModule } from "@angular/material";
import { MatAutocomplete } from "@angular/material";
import { GraphService } from "app/shared/services/graph.service";
import { Role, IClub, IUser } from "app/model";
import { ClubEditorComponent } from "./club-editor.component";
import { of } from 'rxjs';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';

describe("views.configure.club:ClubEditorComponent", () => {
  let component: ClubEditorComponent;
  let fixture: ComponentFixture<ClubEditorComponent>;
  const testClub = { id: 1, name: 'Test club' };
  const matAutocompleteSelectedEventStub = <MatAutocompleteSelectedEvent>{ option: { value: testClub } };

  beforeEach(() => {
    const userServiceStub = { getMe: () => (of({ id: 1, name: 'Test user', role: Role.Organizer, club: testClub })) };
    const activatedRouteStub = { params: of(testClub) };
    const matAutocompleteStub = {
      options: { find: () => ({ select: () => ({}) }) },
      _emitSelectEvent: () => ({})
    };
    const graphServiceStub = {
      getData: (str) => of({
        getClubs: [testClub],
        club: testClub
      }),
      saveData: (type, data, returnVal) => of({ saveClub: testClub }),
      deleteData: (type, id) => of({})
    };
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        ReactiveFormsModule,
        MatAutocompleteModule,
        RouterTestingModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })
      ],
      declarations: [ClubEditorComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: UserService, useValue: userServiceStub },
        { provide: MatAutocompleteSelectedEvent, useValue: matAutocompleteSelectedEventStub },
        { provide: MatAutocomplete, useValue: matAutocompleteStub },
        { provide: GraphService, useValue: graphServiceStub }
      ]
    });
    fixture = TestBed.createComponent(ClubEditorComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it("clubList defaults to: []", () => {
    expect(component.clubList).toEqual([]);
  });

  it("isAdding defaults to: false", () => {
    expect(component.isAdding).toEqual(false);
  });

  it("isEdit defaults to: false", () => {
    expect(component.isEdit).toEqual(false);
  });

  it("roles defaults to: Role", () => {
    expect(component.roles).toEqual(Role);
  });

  describe("ngOnInit", () => {
    it("non-admins should not be able to edit a club that's not yours", () => {
      const userServiceStub: UserService = fixture.debugElement.injector.get(UserService);
      userServiceStub.getMe = () => (of(<IUser>{ id: 1, name: 'Test user', role: Role.Organizer, club: { id: 2 } })); // Give in a user from a different club

      spyOn(userServiceStub, "getMe").and.callThrough();
      spyOn(component, "goBack");
      component.ngOnInit();
      expect(userServiceStub.getMe).toHaveBeenCalled();
      expect(component.goBack).toHaveBeenCalled();
    });

    it("admins should be able to edit a club that's not yours", () => {
      const userServiceStub: UserService = fixture.debugElement.injector.get(UserService);
      const graphServiceStub: GraphService = fixture.debugElement.injector.get(GraphService);

      userServiceStub.getMe = () => (of(<IUser>{ id: 1, name: 'Test user', role: Role.Admin })); // Give in an admin (club is not important)

      spyOn(userServiceStub, "getMe").and.callThrough();
      spyOn(graphServiceStub, "getData").and.callThrough();
      component.ngOnInit();
      expect(userServiceStub.getMe).toHaveBeenCalled();
      expect(graphServiceStub.getData).toHaveBeenCalled();
    });

    it("admins can add a new club", () => {
      const userServiceStub: UserService = fixture.debugElement.injector.get(UserService);
      const graphServiceStub: GraphService = fixture.debugElement.injector.get(GraphService);
      const activatedRouteStub: ActivatedRoute = fixture.debugElement.injector.get(ActivatedRoute);

      userServiceStub.getMe = () => (of(<IUser>{ id: 1, name: 'Test user', role: Role.Admin })); // Give in an admin
      activatedRouteStub.params = of({}); // Give in empty club to indicate adding a club

      spyOn(userServiceStub, "getMe").and.callThrough();
      spyOn(graphServiceStub, "getData").and.callThrough();
      component.ngOnInit();
      expect(userServiceStub.getMe).toHaveBeenCalled();
      expect(graphServiceStub.getData).not.toHaveBeenCalled();
      expect(component.isAdding).toBeTruthy();
    });

  });

  describe("setSelectedClub", () => {
    it("makes expected calls", () => {
      component.ngOnInit();
      spyOn(component, "clubReceived").and.callThrough();
      component.setSelectedClub(matAutocompleteSelectedEventStub);
      expect(component.clubReceived).toHaveBeenCalled();
    });
  });

  describe("tabOut", () => {
    it("makes expected calls", () => {
      component.ngOnInit();
      const matAutocompleteStub: MatAutocomplete = fixture.debugElement.injector.get(MatAutocomplete);
      spyOn(matAutocompleteStub, "_emitSelectEvent").and.callThrough();
      component.tabOut(matAutocompleteStub);
      expect(matAutocompleteStub._emitSelectEvent).toHaveBeenCalled();
    });
  });

  describe("save", () => {
    it("makes expected calls", () => {
      component.ngOnInit();
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      const graphServiceStub: GraphService = fixture.debugElement.injector.get(GraphService);
      spyOn(component, "clubReceived").and.callThrough();
      spyOn(routerStub, "navigate");
      spyOn(graphServiceStub, "saveData").and.callThrough();
      component.save();
      expect(component.clubReceived).toHaveBeenCalled();
      expect(routerStub.navigate).toHaveBeenCalled();
      expect(graphServiceStub.saveData).toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("makes expected calls", () => {
      component.ngOnInit();
      const graphServiceStub: GraphService = fixture.debugElement.injector.get(GraphService);
      spyOn(graphServiceStub, "deleteData").and.callThrough();
      spyOn(component, "goBack");
      component.delete();
      expect(graphServiceStub.deleteData).toHaveBeenCalled();
      expect(component.goBack).toHaveBeenCalled();
    });
  });

  describe("cancel", () => {
    it("should go back when adding", () => {
      const activatedRouteStub: ActivatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
      const userServiceStub: UserService = fixture.debugElement.injector.get(UserService);
      userServiceStub.getMe = () => (of(<IUser>{ id: 1, name: 'Test user', role: Role.Admin, club: testClub })); // Give in an admin user
      activatedRouteStub.params = of({}); // Give in empty club to indicate addin´g a club

      component.ngOnInit();
      spyOn(component, "goBack");
      component.cancel();
      expect(component.goBack).toHaveBeenCalled();
    });

    it("should stay when editing", () => {
      component.ngOnInit();
      spyOn(component, "goBack");
      component.cancel();
      expect(component.goBack).not.toHaveBeenCalled();
    });
  });

  describe("goBack", () => {
    it("makes expected calls", () => {
      component.ngOnInit();
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      spyOn(routerStub, "navigate");
      component.goBack();
      expect(routerStub.navigate).toHaveBeenCalled();
    });
  });
});
