import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app/app.module';
import { ReplaySubject } from 'rxjs/Rx';

import { SharedModule } from 'app/shared/shared.module';

import { ResultsComponent } from './results.component';
import {
  ScheduleService,
  TeamsService,
  TournamentService,
  EventService,
  UserService,
  ConfigurationService,
  ScoreService } from 'app/services/api';
import { ITournament } from 'app/services/model/ITournament';

import { UserServiceStub } from 'app/services/api/user.service.stub';
import { EventServiceStub } from 'app/services/api/event.service.stub';
import { TournamentServiceStub, dummyTournament } from 'app/services/api/tournament.service.stub';
import { TeamsServiceStub } from 'app/services/api/teams.service.stub';
import { ScheduleServiceStub } from 'app/services/api/schedule.service.stub';
import { ConfigurationServiceStub } from 'app/services/api/configuration.service.stub';
import { ScoreServiceStub } from 'app/services/api/score.service.stub';
import { EventComponent } from '../event.component';

class DummyParent {
  tournamentSubject = new ReplaySubject<ITournament>(1);
  constructor() {
    this.tournamentSubject.next(dummyTournament);
  }
}
describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [Http]
          }
        }),
      ],
      declarations: [ ResultsComponent ],
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
