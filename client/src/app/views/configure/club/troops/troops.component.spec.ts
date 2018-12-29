import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { TranslateService, TranslateFakeLoader, TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { ITroop, Gender, Role } from "app/model";
import { UserService } from "app/services/api";
import { ConfigurationService } from "app/services/api";
import { ClubEditorComponent } from "app/views/configure/club/club-editor/club-editor.component";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { GraphService } from "app/services/graph.service";
import { TroopsComponent } from "./troops.component";
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { MatTableModule } from '@angular/material';
import { IfAuthDirective } from 'app/shared/directives';

describe("views.configure.club:TroopsComponent", () => {
  let component: TroopsComponent;
  let fixture: ComponentFixture<TroopsComponent>;
  const iClubStub = { id: 1, name: 'Test club' };
  const iGymnastStub = { id: 1, name: 'Test gymnast', gender: Gender.Male };
  const iTroopStub = {
    id: 1,
    gymnasts: [iGymnastStub],
    club: iClubStub,
  };

  beforeEach(() => {
    const userServiceStub = { getMe: () => of({ id: 1, name: 'Test user', role: Role.Organizer, club: iClubStub }) };
    const configurationServiceStub = { getByname: () => of({
      name: 'defaultValues', value: {
        division: [{}]
      }
    }) };
    const clubEditorComponentStub = { clubSubject: of(iClubStub), club: iClubStub };
    const graphServiceStub = {
      getData: () => of({
        getGymnasts: [iGymnastStub],
        getTroops: [iTroopStub]
      }),
      saveData: () => of({})
    };
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        MatTableModule,
        RouterTestingModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })
      ],
      declarations: [TroopsComponent, IfAuthDirective],
      providers: [
        { provide: UserService, useValue: userServiceStub },
        { provide: ConfigurationService, useValue: configurationServiceStub },
        { provide: ClubEditorComponent, useValue: clubEditorComponentStub },
        { provide: GraphService, useValue: graphServiceStub }
      ]
    });
    fixture = TestBed.createComponent(TroopsComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it("defaults defaults to: []", () => {
    expect(component.defaults).toEqual([]);
  });

  it("displayedColumns defaults to: ['name', 'ageGroup', 'genderGroup', 'members']", () => {
    expect(component.displayedColumns).toEqual(["name", "ageGroup", "genderGroup", "members"]);
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
      const userServiceStub: UserService = fixture.debugElement.injector.get(UserService);
      const configurationServiceStub: ConfigurationService = fixture.debugElement.injector.get(ConfigurationService);
      spyOn(userServiceStub, "getMe").and.callThrough();
      spyOn(component, "loadTeams").and.callThrough();
      spyOn(configurationServiceStub, "getByname").and.callThrough();
      component.ngOnInit();
      expect(userServiceStub.getMe).toHaveBeenCalled();
      expect(component.loadTeams).toHaveBeenCalled();
      expect(configurationServiceStub.getByname).toHaveBeenCalled();
    });
  });

  describe("loadTeams", () => {
    it("makes expected calls", () => {
      component.ngOnInit();

      const graphServiceStub: GraphService = fixture.debugElement.injector.get(GraphService);
      spyOn(graphServiceStub, "getData").and.callThrough();
      spyOn(component, "onTeamsReceived");
      component.loadTeams();
      expect(graphServiceStub.getData).toHaveBeenCalled();
      expect(component.onTeamsReceived).toHaveBeenCalled();
    });
  });

  describe("addTeam", () => {
    it("makes expected calls", () => {
      component.ngOnInit();

      const routerStub: Router = fixture.debugElement.injector.get(Router);
      spyOn(routerStub, "navigate");
      component.addTeam();
      expect(routerStub.navigate).toHaveBeenCalled();
    });
  });

  describe("generateTeams", () => {
    it("makes expected calls", () => {
      component.ngOnInit();

      const graphServiceStub: GraphService = fixture.debugElement.injector.get(GraphService);
      spyOn(graphServiceStub, "getData").and.callThrough();
      spyOn(graphServiceStub, "saveData").and.callThrough();
      spyOn(component, "onTeamsReceived");
      component.generateTeams();
      expect(graphServiceStub.getData).toHaveBeenCalled();
      expect(graphServiceStub.saveData).toHaveBeenCalled();
      expect(component.onTeamsReceived).toHaveBeenCalled();
    });
  });
});
