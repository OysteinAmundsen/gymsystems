import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { TranslateService, TranslateModule, TranslateLoader, TranslateFakeLoader } from "@ngx-translate/core";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { GraphService } from "app/shared/services/graph.service";
import { MemberSelectorComponent } from "./member-selector.component";
import { IClub } from 'app/model/IClub';
import { of } from 'rxjs';
import { IGymnast } from 'app/model';

describe("MemberSelectorComponent", () => {
  let component: MemberSelectorComponent;
  let fixture: ComponentFixture<MemberSelectorComponent>;

  beforeEach(() => {
    const translateServiceStub = {};
    const graphServiceStub = {
      getData: (query: string) => of({ getGymnasts: <IGymnast[]>[{ id: 1, name: 'Test', birthYear: 1990 }] })
    };

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        DragDropModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })
      ],
      declarations: [MemberSelectorComponent],
      providers: [
        { provide: TranslateService, useValue: translateServiceStub },
        { provide: GraphService, useValue: graphServiceStub }
      ]
    });
    fixture = TestBed.createComponent(MemberSelectorComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it("memberListHidden defaults to: true", () => {
    expect(component.memberListHidden).toEqual(true);
  });

  it("availableMembers defaults to: []", () => {
    expect(component.availableMembers).toEqual([]);
  });

  it("filteredMembers defaults to: []", () => {
    expect(component.filteredMembers).toEqual([]);
  });

  it("isLoadingMembers defaults to: false", () => {
    expect(component.isLoadingMembers).toEqual(false);
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      spyOn(component, "loadAvailableMembers");
      component.ngOnInit();
      expect(component.loadAvailableMembers).toHaveBeenCalled();
    });
  });

  describe("loadAvailableMembers", () => {
    it("makes expected calls", () => {
      const graphServiceStub: GraphService = fixture.debugElement.injector.get(GraphService);
      spyOn(graphServiceStub, "getData").and.callThrough();
      spyOn(component, "addFilter");
      component.club = <IClub>{ id: 1 };
      component.gymnasts = <IGymnast[]>[{ id: 2, name: 'another' }];

      component.loadAvailableMembers();
      expect(component.addFilter).toHaveBeenCalled();
      expect(graphServiceStub.getData).toHaveBeenCalled();
    });
  });
});
