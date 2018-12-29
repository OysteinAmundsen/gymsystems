import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { IGymnast } from "app/model";
import { ClubEditorComponent } from "app/views/configure/club/club-editor/club-editor.component";
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from "@ngx-translate/core";
import { Router } from "@angular/router";
import { MemberStateService } from "app/views/configure/club/members/member-state.service";
import { GraphService } from "app/services/graph.service";
import { Gender } from "app/model";
import { MembersComponent } from "./members.component";
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { MatTableModule } from '@angular/material';
import { IfAuthDirective } from 'app/shared/directives';

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

      const graphServiceStub: GraphService = fixture.debugElement.injector.get(GraphService);
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

      const routerStub: Router = fixture.debugElement.injector.get(Router);
      spyOn(routerStub, "navigate");
      component.addMember();
      expect(routerStub.navigate).toHaveBeenCalled();
    });
  });
});
