import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { GraphService } from "app/shared/services/graph.service";
import { IDivision } from "app/model";
import { DivisionLookupComponent } from "./division-lookup.component";
import { MatFormFieldModule, MatSelectModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

describe("DivisionLookupComponent", () => {
  let component: DivisionLookupComponent;
  let fixture: ComponentFixture<DivisionLookupComponent>;
  const iDivisionStub = {};

  beforeEach(() => {
    const graphServiceStub = { getData: () => ({ subscribe: () => ({}) }) };
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule
      ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [DivisionLookupComponent],
      providers: [
        { provide: GraphService, useValue: graphServiceStub }
      ]
    });
    fixture = TestBed.createComponent(DivisionLookupComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it("placeholder defaults to: Division", () => {
    expect(component.placeholder).toEqual("Division");
  });

  it("divisions defaults to: []", () => {
    expect(component.divisions).toEqual([]);
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      const graphServiceStub: GraphService = fixture.debugElement.injector.get(GraphService);
      spyOn(graphServiceStub, "getData");
      component.ngOnInit();
      expect(graphServiceStub.getData).toHaveBeenCalled();
    });
  });
});
