// // FIXME: All tests should run
// import { ComponentFixture, TestBed } from "@angular/core/testing";
// import { NO_ERRORS_SCHEMA } from "@angular/core";
// import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
// import { ActivatedRoute, Router } from "@angular/router";
// import { IVenue } from "app/model";
// import { TranslateModule, TranslateLoader, TranslateFakeLoader } from "@ngx-translate/core";
// import { MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatOptionModule, MatCardModule } from "@angular/material";
// import { GraphService } from "../../../../shared/services/graph.service";
// import { VenueEditorComponent } from "./venue-editor.component";
// import { of } from 'rxjs';
// import { RouterTestingModule } from '@angular/router/testing';
// import { HttpClientTestingModule } from '@angular/common/http/testing';

// describe("views.configure:VenueEditorComponent", () => {
//   let component: VenueEditorComponent;
//   let fixture: ComponentFixture<VenueEditorComponent>;
//   const iVenueStub = <IVenue>{};

//   beforeEach(() => {
//     const activatedRouteStub = {
//       params: of({}),
//       queryParams: of({})
//     };
//     // const matAutocompleteSelectedEventStub = {
//     //   option: {
//     //     value: {
//     //       formatted_address: "Test address",
//     //       geometry: { location: { lat: 0.001, lng: 0.002 } }
//     //     }
//     //   }
//     // };
//     const graphServiceStub = {
//       getData: () => of(iVenueStub),
//       saveData: () => of(iVenueStub),
//       deleteData: () => of({})
//     };
//     TestBed.configureTestingModule({
//       imports: [
//         RouterTestingModule,
//         ReactiveFormsModule,
//         MatCardModule,
//         MatFormFieldModule,
//         MatInputModule,
//         MatAutocompleteModule,
//         MatOptionModule,
//         HttpClientTestingModule,
//         TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })
//       ],
//       schemas: [NO_ERRORS_SCHEMA],
//       declarations: [VenueEditorComponent],
//       providers: [
//         { provide: ActivatedRoute, useValue: activatedRouteStub },
//         // { provide: 'MatAutocompleteSelectedEvent', useValue: matAutocompleteSelectedEventStub },
//         { provide: GraphService, useValue: graphServiceStub }
//       ]
//     });
//     fixture = TestBed.createComponent(VenueEditorComponent);
//     component = fixture.componentInstance;
//   });
//   it("can load instance", () => {
//     expect(component).toBeTruthy();
//   });

//   // describe("tabOut", () => {
//   //   it("makes expected calls", () => {
//   //     const matAutocompleteStub = fixture.debugElement.injector.get(MatAutocomplete);
//   //     spyOn(matAutocompleteStub, "_emitSelectEvent");
//   //     component.ngOnInit();
//   //     component.tabOut(matAutocompleteStub);
//   //     expect(matAutocompleteStub._emitSelectEvent).toHaveBeenCalled();
//   //   });
//   // });

//   describe("ngOnInit", () => {
//     it("when no params given", () => {
//       const formBuilderStub = fixture.debugElement.injector.get(FormBuilder);
//       const graphServiceStub = fixture.debugElement.injector.get(GraphService);
//       spyOn(component, "venueReceived");
//       spyOn(formBuilderStub, "group").and.callThrough();
//       spyOn(graphServiceStub, "getData").and.callFake(req => of(iVenueStub));
//       component.ngOnInit();
//       expect(component.venueReceived).not.toHaveBeenCalled();
//     });

//     it("when a venue id is given", () => {
//       const formBuilderStub = fixture.debugElement.injector.get(FormBuilder);
//       const graphServiceStub = fixture.debugElement.injector.get(GraphService);
//       spyOn(component, "venueReceived");
//       spyOn(formBuilderStub, "group").and.callThrough();
//       spyOn(graphServiceStub, "getData").and.callFake(req => of(iVenueStub));
//       component.ngOnInit();
//       expect(component.venueReceived).toHaveBeenCalled();
//     });
//   });

//   describe("createTournament", () => {
//     it("makes expected calls", () => {
//       const routerStub = fixture.debugElement.injector.get(Router);
//       spyOn(routerStub, "navigate");
//       component.ngOnInit();
//       component.createTournament();
//       expect(routerStub.navigate).toHaveBeenCalled();
//     });
//   });

//   describe("save", () => {
//     it("makes expected calls", () => {
//       const graphServiceStub = fixture.debugElement.injector.get(GraphService);
//       spyOn(component, "cancel");
//       spyOn(graphServiceStub, "saveData").and.callFake((res => of(iVenueStub)));
//       component.ngOnInit();
//       component.save();
//       expect(component.cancel).toHaveBeenCalled();
//       expect(graphServiceStub.saveData).toHaveBeenCalled();
//     });
//   });

//   describe("cancel", () => {
//     it("makes expected calls", () => {
//       const routerStub = fixture.debugElement.injector.get(Router);
//       spyOn(routerStub, "navigate");
//       component.cancel();
//       expect(routerStub.navigate).toHaveBeenCalled();
//     });
//   });

//   describe("delete", () => {
//     it("makes expected calls", () => {
//       const graphServiceStub = fixture.debugElement.injector.get(GraphService);
//       spyOn(graphServiceStub, "deleteData");
//       component.ngOnInit();
//       component.delete();
//       expect(graphServiceStub.deleteData).toHaveBeenCalled();
//     });
//   });
// });
