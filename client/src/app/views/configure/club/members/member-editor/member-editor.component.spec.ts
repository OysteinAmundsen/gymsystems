import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { ClubEditorComponent } from "app/views/configure/club/club-editor/club-editor.component";
import { MatAutocompleteSelectedEvent, MatAutocompleteModule } from "@angular/material";
import { GraphService } from "app/shared/services/graph.service";
import { MemberEditorComponent } from "./member-editor.component";
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { Gender } from 'app/model/Gender';

describe("views.configure.club:MemberEditorComponent", () => {
  let component: MemberEditorComponent;
  let fixture: ComponentFixture<MemberEditorComponent>;

  beforeEach(() => {
    const activatedRouteStub = { params: of({ id: 1 }) };
    const iTroopStub = { id: 1, name: "Test troop" };
    const iGymnastStub = {
      id: 1,
      name: "Test gymnast",
      email: "somewhere@someone.no",
      phone: "99999999",
      birthDate: new Date().getTime(),
      birthYear: 2004,
      club: { id: 1, name: "Test club" },
      troop: iTroopStub,
      gender: Gender.Male,
      allergies: '',
      guardian1: null,
      guardian1Phone: null,
      guardian1Email: null,
      guardian2: null,
      guardian2Phone: null,
      guardian2Email: null
    };
    const clubEditorComponentStub = { clubSubject: of({}) };
    const matAutocompleteSelectedEventStub = { option: { value: {} } };
    const graphServiceStub = {
      getData: () => (of({ gymnast: iGymnastStub })),
      saveData: () => (of({ saveGymnast: iGymnastStub })),
      deleteData: () => (of({}))
    };

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        MatAutocompleteModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })
      ],
      declarations: [MemberEditorComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: ClubEditorComponent, useValue: clubEditorComponentStub },
        { provide: MatAutocompleteSelectedEvent, useValue: matAutocompleteSelectedEventStub },
        { provide: GraphService, useValue: graphServiceStub }
      ]
    });
    fixture = TestBed.createComponent(MemberEditorComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it("troopList defaults to: []", () => {
    expect(component.troopList).toEqual([]);
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      const formBuilderStub: FormBuilder = fixture.debugElement.injector.get(FormBuilder);
      const graphServiceStub: GraphService = fixture.debugElement.injector.get(GraphService);
      spyOn(formBuilderStub, "group").and.callThrough();
      spyOn(graphServiceStub, "getData").and.callThrough();
      spyOn(component, "memberReceived");
      component.ngOnInit();
      expect(formBuilderStub.group).toHaveBeenCalled();
      expect(graphServiceStub.getData).toHaveBeenCalled();
      expect(component.memberReceived).toHaveBeenCalled();
    });
  });

  describe("save", () => {
    it("makes expected calls", () => {
      component.ngOnInit();

      const graphServiceStub: GraphService = fixture.debugElement.injector.get(GraphService);
      spyOn(graphServiceStub, "saveData").and.callThrough();
      spyOn(component, "close");
      component.save();
      expect(graphServiceStub.saveData).toHaveBeenCalled();
      expect(component.close).toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("makes expected calls", () => {
      component.ngOnInit();

      const graphServiceStub: GraphService = fixture.debugElement.injector.get(GraphService);
      spyOn(graphServiceStub, "deleteData").and.callThrough();
      spyOn(component, "close");
      component.delete();
      expect(graphServiceStub.deleteData).toHaveBeenCalled();
      expect(component.close).toHaveBeenCalled();
    });
  });

  describe("close", () => {
    it("makes expected calls", () => {
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      spyOn(routerStub, "navigate");
      component.close();
      expect(routerStub.navigate).toHaveBeenCalled();
    });
  });
});
