import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { GraphService } from "app/shared/services/graph.service";
import { IClub } from "app/model";
import { MatAutocomplete, MatAutocompleteModule } from "@angular/material";
import { ClubLookupComponent } from "./club-lookup.component";
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';

describe("ClubLookupComponent", () => {
  let component: ClubLookupComponent;
  let fixture: ComponentFixture<ClubLookupComponent>;
  const iClubStub = { name: {} };

  beforeEach(() => {
    const graphServiceStub = { get: () => ({ subscribe: () => ({}) }) };

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ClubLookupComponent],
      imports: [
        MatAutocompleteModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })
      ],
      providers: [
        { provide: GraphService, useValue: graphServiceStub }
      ]
    });
    fixture = TestBed.createComponent(ClubLookupComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it("clubList defaults to: []", () => {
    expect(component.clubList).toEqual([]);
  });

  // describe("ngOnInit", () => {
  //   it("makes expected calls", () => {
  //     const graphServiceStub: GraphService = fixture.debugElement.injector.get(GraphService);
  //     spyOn(graphServiceStub, "get");
  //     component.ngOnInit();
  //     expect(graphServiceStub.get).toHaveBeenCalled();
  //   });
  // });
});
