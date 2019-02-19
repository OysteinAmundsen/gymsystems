import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { IGymnast, Role } from "app/model";
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from "@ngx-translate/core";
import { Gender } from "app/model";
import { MembersComponent } from "./members.component";
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { MatTableModule } from '@angular/material';
import { IfAuthDirective } from 'app/shared/directives';
import { ClubEditorComponent } from '../club-editor/club-editor.component';
import { UserService } from 'app/shared/services/api';
import { MemberStateService } from './member-state.service';
import { GraphService } from 'app/shared/services/graph.service';
import { Router } from '@angular/router';

describe("views.configure.club:MembersComponent", () => {
  let component: MembersComponent;
  let fixture: ComponentFixture<MembersComponent>;
  const iGymnastStub = <IGymnast>{
    id: 1,
    gender: Gender.Male,
    troop: [{ id: 1, name: 'Test troop' }],
  };

  beforeEach(() => {
    const clubEditorComponentStub = { clubSubject: of({ id: 1, name: 'Test club' }) };
    const memberStateServiceStub = { sort: {} };
    const graphServiceStub = { getData: () => of({}) };
    const userServiceStub = { getMe: () => of({ id: 1, name: 'Test user', role: Role.Club }) };

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        MatTableModule,
        RouterTestingModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })
      ],
      declarations: [MembersComponent, IfAuthDirective],
      providers: [
        { provide: ClubEditorComponent, useValue: clubEditorComponentStub },
        { provide: UserService, useValue: userServiceStub },
        { provide: MemberStateService, useValue: memberStateServiceStub },
        { provide: GraphService, useValue: graphServiceStub }
      ]
    });
    fixture = TestBed.createComponent(MembersComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it("displayedColumns defaults to: ['name', 'birthYear', 'gender', 'teams', 'allergies']", () => {
    expect(component.displayedColumns).toEqual([
      "name",
      "birthYear",
      "gender",
      "teams",
      "allergies"
    ]);
  });

  it("genders defaults to: Gender", () => {
    expect(component.genders).toEqual(Gender);
  });

  it("subscriptions defaults to: []", () => {
    expect(component.subscriptions).toEqual([]);
  });

  it("selectMode defaults to: false", () => {
    expect(component.selectMode).toEqual(false);
  });

  it("selection defaults to: []", () => {
    expect(component.selection).toEqual([]);
  });

  it("allSelected defaults to: false", () => {
    expect(component.allSelected).toEqual(false);
  });

  it("allIndeterminate defaults to: false", () => {
    expect(component.allIndeterminate).toEqual(false);
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      spyOn(component, "loadMembers");
      component.ngOnInit();
      expect(component.loadMembers).toHaveBeenCalled();
    });
  });

  describe("loadMembers", () => {
    it("makes expected calls", () => {
      component.ngOnInit();

      const graphServiceStub = fixture.debugElement.injector.get(GraphService);
      spyOn(graphServiceStub, "getData").and.callThrough();
      spyOn(component, "onMembersReceived");
      component.loadMembers();
      expect(component.onMembersReceived).toHaveBeenCalled();
      expect(graphServiceStub.getData).toHaveBeenCalled();
    });
  });

  describe("addMember", () => {
    it("makes expected calls", () => {
      component.ngOnInit();

      const routerStub = fixture.debugElement.injector.get(Router);
      spyOn(routerStub, "navigate");
      component.addMember();
      expect(routerStub.navigate).toHaveBeenCalled();
    });
  });
});
