/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReplaySubject } from 'rxjs/Rx';

import { AppModule } from 'app/app.module';
import { EventModule } from '../event.module';
import { ListComponent } from './list.component';
import { EventComponent } from '../event.component';

import { UserService, ScheduleService, TeamsService, EventService, ConfigurationService, ScoreService } from 'app/services/api';
import { MediaService } from 'app/services/media.service';
import { ITournament } from 'app/services/model/ITournament';

import { EventServiceStub } from 'app/services/api/event/event.service.stub';
import { TeamsServiceStub } from 'app/services/api/teams/teams.service.stub';
import { TournamentServiceStub, dummyTournament } from 'app/services/api/tournament/tournament.service.stub';
import { UserServiceStub } from 'app/services/api/user/user.service.stub';
import { ScheduleServiceStub } from 'app/services/api/schedule/schedule.service.stub';
import { ErrorHandlerService } from 'app/services/config/ErrorHandler.service';
import { ConfigurationServiceStub } from 'app/services/api/configuration/configuration.service.stub';
import { ScoreServiceStub } from 'app/services/api/score/score.service.stub';

export class DummyParent {
  tournamentSubject = new ReplaySubject<ITournament>(1);
  constructor() {
    this.tournamentSubject.next(dummyTournament);
  }
}
describe('views.event.list:ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

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
        {provide: UserService, useClass: UserServiceStub},
        {provide: TeamsService, useClass: TeamsServiceStub},
        {provide: EventService, useClass: EventServiceStub},
        {provide: ScoreService, useClass: ScoreServiceStub},
        {provide: ConfigurationService, useClass: ConfigurationServiceStub},
        ErrorHandlerService,
        MediaService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
