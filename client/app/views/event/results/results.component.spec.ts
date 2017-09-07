import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReplaySubject } from 'rxjs/Rx';

import { AppModule } from 'app/app.module';
import { EventModule } from '../event.module';
import { ResultsComponent } from './results.component';
import { EventComponent } from '../event.component';

import {
  ScheduleService,
  TeamsService,
  TournamentService,
  EventService,
  UserService,
  ConfigurationService,
  ScoreService } from 'app/services/api';
import { ITournament } from 'app/services/model';

import { UserServiceStub } from 'app/services/api/user/user.service.stub';
import { EventServiceStub } from 'app/services/api/event/event.service.stub';
import { TournamentServiceStub, dummyTournament } from 'app/services/api/tournament/tournament.service.stub';
import { TeamsServiceStub } from 'app/services/api/teams/teams.service.stub';
import { ScheduleServiceStub } from 'app/services/api/schedule/schedule.service.stub';
import { ConfigurationServiceStub } from 'app/services/api/configuration/configuration.service.stub';
import { ScoreServiceStub } from 'app/services/api/score/score.service.stub';

class DummyParent {
  tournamentSubject = new ReplaySubject<ITournament>(1);
  constructor() {
    this.tournamentSubject.next(dummyTournament);
  }
}
describe('views.event.results:ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        EventModule,
        RouterTestingModule,
      ],
      providers: [
        {provide: EventComponent, useClass: DummyParent},
        {provide: ScheduleService, useClass: ScheduleServiceStub},
        {provide: TeamsService, useClass: TeamsServiceStub},
        {provide: TournamentService, useClass: TournamentServiceStub},
        {provide: EventService, useClass: EventServiceStub},
        {provide: UserService, useClass: UserServiceStub},
        {provide: ScoreService, useClass: ScoreServiceStub},
        {provide: ConfigurationService, useClass: ConfigurationServiceStub},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
