import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReplaySubject } from 'rxjs/Rx';

import { AppModule } from 'app/app.module';
import { TournamentModule } from '../tournament.module';
import { ScheduleComponent } from './schedule.component';
import { TournamentEditorComponent } from '../tournament-editor/tournament-editor.component';

import { ITournament } from 'app/services/model/ITournament';
import { ScheduleService, DivisionService, DisciplineService, TeamsService, ConfigurationService } from 'app/services/api';

import { dummyTournament } from 'app/services/api/tournament/tournament.service.stub';

import { DivisionServiceStub } from 'app/services/api/division/division.service.stub';
import { DisciplineServiceStub } from 'app/services/api/discipline/discipline.service.stub';
import { TeamsServiceStub } from 'app/services/api/teams/teams.service.stub';
import { ConfigurationServiceStub } from 'app/services/api/configuration/configuration.service.stub';
import { ScheduleServiceStub } from 'app/services/api/schedule/schedule.service.stub';
import { ErrorHandlerService } from 'app/services/config/ErrorHandler.service';


class DummyParent {
  tournamentSubject = new ReplaySubject<ITournament>(1);
  constructor() {
    this.tournamentSubject.next(dummyTournament);
  }
}
describe('views.configure.tournament:ScheduleComponent', () => {
  let component: ScheduleComponent;
  let fixture: ComponentFixture<ScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        TournamentModule,
        RouterTestingModule,
      ],
      providers: [
        ErrorHandlerService,
        { provide: TournamentEditorComponent, useClass: DummyParent },
        { provide: DivisionService, useClass: DivisionServiceStub },
        { provide: DisciplineService, useClass: DisciplineServiceStub },
        { provide: TeamsService, useClass: TeamsServiceStub },
        { provide: ScheduleService, useClass: ScheduleServiceStub },
        { provide: ConfigurationService, useClass: ConfigurationServiceStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
