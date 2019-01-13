// import { ComponentFixture, TestBed } from "@angular/core/testing";
// import { NO_ERRORS_SCHEMA } from "@angular/core";
// import { FormBuilder } from "@angular/forms";
// import { GraphService } from "app/shared/services/graph.service";
// import { DivisionType } from "app/model";
// import { DivisionEditorComponent } from "./division-editor.component";
// import { of } from 'rxjs';

// describe("views.configure.tournament:DivisionEditorComponent", () => {
//   let component: DivisionEditorComponent;
//   let fixture: ComponentFixture<DivisionEditorComponent>;
//   beforeEach(() => {
//     const formBuilderStub = { group: () => ({}) };
//     const graphServiceStub = {
//       saveData: () => of({}),
//       deleteData: () => of({})
//     };
//     TestBed.configureTestingModule({
//       schemas: [NO_ERRORS_SCHEMA],
//       declarations: [DivisionEditorComponent],
//       providers: [
//         { provide: FormBuilder, useValue: formBuilderStub },
//         { provide: GraphService, useValue: graphServiceStub }
//       ]
//     });
//     fixture = TestBed.createComponent(DivisionEditorComponent);
//     component = fixture.componentInstance;
//   });
//   it("can load instance", () => {
//     expect(component).toBeTruthy();
//   });
//   it("standalone defaults to: false", () => {
//     expect(component.standalone).toEqual(false);
//   });
//   it("divisionTypes defaults to: DivisionType", () => {
//     expect(component.divisionTypes).toEqual(DivisionType);
//   });
//   describe("ngOnInit", () => {
//     it("makes expected calls", () => {
//       const formBuilderStub: FormBuilder = fixture.debugElement.injector.get(FormBuilder);
//       spyOn(formBuilderStub, "group");
//       component.ngOnInit();
//       expect(formBuilderStub.group).toHaveBeenCalled();
//     });
//   });
//   describe("save", () => {
//     it("makes expected calls", () => {
//       const graphServiceStub: GraphService = fixture.debugElement.injector.get(GraphService);
//       spyOn(graphServiceStub, "saveData");
//       component.save();
//       expect(graphServiceStub.saveData).toHaveBeenCalled();
//     });
//   });
//   describe("delete", () => {
//     it("makes expected calls", () => {
//       const graphServiceStub: GraphService = fixture.debugElement.injector.get(GraphService);
//       spyOn(graphServiceStub, "deleteData");
//       component.delete();
//       expect(graphServiceStub.deleteData).toHaveBeenCalled();
//     });
//   });
// });
