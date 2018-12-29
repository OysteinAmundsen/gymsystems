import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from "@ngx-translate/core";
import { ITournament } from "app/model";
import { GraphService } from "app/services/graph.service";
import { HomeComponent } from "./home.component";
import { RouterTestingModule } from '@angular/router/testing';
import { MarkdownToHtmlModule } from 'markdown-to-html-pipe';
import { of } from 'rxjs';
import { IfAuthDirective } from 'app/shared/directives';
import * as moment from 'moment';
import { CommonService } from 'app/shared/common.service';

describe("HomeComponent", () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  const iTournamentStub = {
    id: 1,
    name: 'Test Tournament',
    description_no: '',
    description_en: '',
    startDate: moment().startOf('day').toDate().getTime(),
    endDate: moment().endOf('day').toDate().getTime(),
    times: { day: 0, time: '11,12' },
    venue: { name: 'Test venue', address: '', capacity: 0 }
  };

  beforeEach(() => {
    const tournamentServiceStub = { dateSpan: () => ({}) };
    const graphServiceStub = { getData: () => of({ getTournaments: [iTournamentStub] }) };

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        RouterTestingModule,
        MarkdownToHtmlModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })
      ],
      declarations: [HomeComponent, IfAuthDirective],
      providers: [
        { provide: GraphService, useValue: graphServiceStub }
      ]
    });
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it("current defaults to: []", () => {
    expect(component.current).toEqual([]);
  });

  it("isLoading defaults to: true", () => {
    expect(component.isLoading).toEqual(true);
  });

  describe("getDateSpan", () => {
    it("makes expected calls", () => {
      spyOn(CommonService, "dateSpan");
      component.getDateSpan(<ITournament><unknown>iTournamentStub);
      expect(CommonService.dateSpan).toHaveBeenCalled();
    });
  });

  describe("ngOnInit", () => {
    it("should display current tournament", () => {
      const graphServiceStub: GraphService = fixture.debugElement.injector.get(GraphService);
      spyOn(graphServiceStub, "getData").and.callThrough();
      component.ngOnInit();
      expect(graphServiceStub.getData).toHaveBeenCalled();
      expect(component.hasTournaments).toBeFalsy();
      expect(component.current.length).toBe(1);
    });

    it("should display current tournament", () => {
      const graphServiceStub: GraphService = fixture.debugElement.injector.get(GraphService);
      // Create past tournaments
      const past = [0, 1].map((a, idx) => {
        return Object.assign({}, iTournamentStub, {
          id: idx + 20,
          startDate: moment(iTournamentStub.startDate).subtract(idx + 1, 'weeks'),
          endDate: moment(iTournamentStub.endDate).subtract(idx + 1, 'weeks')
        });
      });
      // Create future tournaments
      const future = [0, 1].map((a, idx) => {
        return Object.assign({}, iTournamentStub, {
          id: idx + 50,
          startDate: moment(iTournamentStub.startDate).add(idx + 1, 'weeks'),
          endDate: moment(iTournamentStub.endDate).add(idx + 1, 'weeks')
        });
      });
      spyOn(graphServiceStub, "getData").and.callFake(() => of({ getTournaments: [...past, ...future] }));
      component.ngOnInit();
      expect(graphServiceStub.getData).toHaveBeenCalled();
      expect(component.current.length).toBe(0);
      expect(component.hasTournaments).toBeTruthy();
      expect(component.hasFuture).toBeTruthy();
      expect(component.hasPast).toBeTruthy();
    });
  });
});
