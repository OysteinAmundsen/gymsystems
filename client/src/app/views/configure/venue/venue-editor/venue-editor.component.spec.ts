// import { ComponentFixture, TestBed } from "@angular/core/testing";
// import { NO_ERRORS_SCHEMA } from "@angular/core";
// import { FormBuilder } from "@angular/forms";
// import { ActivatedRoute } from "@angular/router";
// import { Router } from "@angular/router";
// import { IVenue } from "app/model";
// import { TranslateService, TranslateModule } from "@ngx-translate/core";
// import { MatAutocompleteSelectedEvent, MatAutocompleteModule } from "@angular/material";
// import { MatAutocomplete } from "@angular/material";
// import { GraphService } from "../../../../services/graph.service";
// import { VenueEditorComponent } from "./venue-editor.component";
// import { of } from 'rxjs';

// describe("views.configure:VenueEditorComponent", () => {
//   let component: VenueEditorComponent;
//   let fixture: ComponentFixture<VenueEditorComponent>;
//   const iVenueStub = <IVenue>{};

//   beforeEach(() => {
//     const formBuilderStub = { group: () => ({}) };
//     const activatedRouteStub = {
//       params: of({}),
//       queryParams: of({})
//     };
//     const routerStub = { navigate: () => ({}) };
//     const translateServiceStub = {};
//     const matAutocompleteSelectedEventStub = {
//       option: {
//         value: {
//           formatted_address: {},
//           geometry: { location: { lat: {}, lng: {} } }
//         }
//       }
//     };
//     const matAutocompleteStub = {
//       options: { find: () => ({ select: () => ({}) }) },
//       _emitSelectEvent: () => ({})
//     };
//     const graphServiceStub = {
//       getData: () => of({}),
//       saveData: () => of({}),
//       deleteData: () => of({})
//     };
//     TestBed.configureTestingModule({
//       imports: [
//         MatAutocompleteModule,
//         TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })
//       ],
//       schemas: [NO_ERRORS_SCHEMA],
//       declarations: [VenueEditorComponent],
//       providers: [
//         { provide: FormBuilder, useValue: formBuilderStub },
//         { provide: ActivatedRoute, useValue: activatedRouteStub },
//         { provide: Router, useValue: routerStub },
//         { provide: TranslateService, useValue: translateServiceStub },
//         { provide: MatAutocompleteSelectedEvent, useValue: matAutocompleteSelectedEventStub },
//         { provide: MatAutocomplete, useValue: matAutocompleteStub },
//         { provide: GraphService, useValue: graphServiceStub }
//       ]
//     });
//     fixture = TestBed.createComponent(VenueEditorComponent);
//     component = fixture.componentInstance;
//   });
//   it("can load instance", () => {
//     expect(component).toBeTruthy();
//   });

//   describe("tabOut", () => {
//     it("makes expected calls", () => {
//       const matAutocompleteStub: MatAutocomplete = fixture.debugElement.injector.get(
//         MatAutocomplete
//       );
//       spyOn(matAutocompleteStub, "_emitSelectEvent");
//       component.tabOut(matAutocompleteStub);
//       expect(matAutocompleteStub._emitSelectEvent).toHaveBeenCalled();
//     });
//   });

//   describe("ngOnInit", () => {
//     it("makes expected calls", () => {
//       const formBuilderStub: FormBuilder = fixture.debugElement.injector.get(
//         FormBuilder
//       );
//       const graphServiceStub: GraphService = fixture.debugElement.injector.get(
//         GraphService
//       );
//       spyOn(component, "venueReceived");
//       spyOn(formBuilderStub, "group");
//       spyOn(graphServiceStub, "getData");
//       component.ngOnInit();
//       expect(component.venueReceived).toHaveBeenCalled();
//       expect(formBuilderStub.group).toHaveBeenCalled();
//       expect(graphServiceStub.getData).toHaveBeenCalled();
//     });
//   });

//   describe("createTournament", () => {
//     it("makes expected calls", () => {
//       const routerStub: Router = fixture.debugElement.injector.get(Router);
//       spyOn(routerStub, "navigate");
//       component.createTournament();
//       expect(routerStub.navigate).toHaveBeenCalled();
//     });
//   });

//   describe("save", () => {
//     it("makes expected calls", () => {
//       const graphServiceStub: GraphService = fixture.debugElement.injector.get(
//         GraphService
//       );
//       spyOn(component, "cancel");
//       spyOn(graphServiceStub, "saveData");
//       component.save();
//       expect(component.cancel).toHaveBeenCalled();
//       expect(graphServiceStub.saveData).toHaveBeenCalled();
//     });
//   });

//   describe("cancel", () => {
//     it("makes expected calls", () => {
//       const routerStub: Router = fixture.debugElement.injector.get(Router);
//       spyOn(routerStub, "navigate");
//       component.cancel();
//       expect(routerStub.navigate).toHaveBeenCalled();
//     });
//   });

//   describe("delete", () => {
//     it("makes expected calls", () => {
//       const graphServiceStub: GraphService = fixture.debugElement.injector.get(
//         GraphService
//       );
//       spyOn(graphServiceStub, "deleteData");
//       component.delete();
//       expect(graphServiceStub.deleteData).toHaveBeenCalled();
//     });
//   });
// });
