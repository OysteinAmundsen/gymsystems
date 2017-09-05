/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReplaySubject } from 'rxjs/Rx';

import { AppModule } from 'app/app.module';
import { EventModule } from '../event.module';
import { DisplayComponent } from './display.component';
import { EventComponent } from '../event.component';

import { ConfigurationService, ScheduleService, TournamentService, DisplayService, EventService, UserService } from 'app/services/api';
import { ITournament } from 'app/services/model';

import { EventServiceStub } from 'app/services/api/event/event.service.stub';
import { DisplayServiceStub } from 'app/services/api/display/display.service.stub';
import { dummyTournament } from 'app/services/api/tournament/tournament.service.stub';
import { ScheduleServiceStub } from 'app/services/api/schedule/schedule.service.stub';
import { ConfigurationServiceStub } from 'app/services/api/configuration/configuration.service.stub';
import { UserServiceStub } from 'app/services/api/user/user.service.stub';

class DummyParent {
  tournamentSubject = new ReplaySubject<ITournament>(1);
  constructor() {
    this.tournamentSubject.next(dummyTournament);
  }
}
describe('views.event.display:DisplayComponent', () => {
  let component: DisplayComponent;
  let fixture: ComponentFixture<DisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        EventModule,
        RouterTestingModule
      ],
      providers: [
        {provide: EventComponent, useClass: DummyParent},
        {provide: UserService, useClass: UserServiceStub},
        {provide: ConfigurationService, useClass: ConfigurationServiceStub},
        {provide: ScheduleService, useClass: ScheduleServiceStub},
        {provide: DisplayService, useClass: DisplayServiceStub},
        {provide: EventService, useClass: EventServiceStub},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
