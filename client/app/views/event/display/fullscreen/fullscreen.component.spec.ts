import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReplaySubject } from 'rxjs/Rx';

import { AppModule } from 'app/app.module';
import { EventModule } from '../../event.module';
import { FullscreenComponent } from './fullscreen.component';
import { EventComponent } from '../../event.component';

import { ConfigurationService, ScheduleService, TournamentService, DisplayService, EventService } from 'app/services/api';
import { ITournament } from 'app/services/model';

import { EventServiceStub } from 'app/services/api/event/event.service.stub';
import { DisplayServiceStub } from 'app/services/api/display/display.service.stub';
import { TournamentServiceStub, dummyTournament } from 'app/services/api/tournament/tournament.service.stub';
import { ScheduleServiceStub } from 'app/services/api/schedule/schedule.service.stub';
import { ConfigurationServiceStub } from 'app/services/api/configuration/configuration.service.stub';

class DummyParent {
  tournamentSubject = new ReplaySubject<ITournament>(1);
  constructor() {
    this.tournamentSubject.next(dummyTournament);
  }
}
describe('views.event.display:FullscreenComponent', () => {
  let component: FullscreenComponent;
  let fixture: ComponentFixture<FullscreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        EventModule,
        RouterTestingModule,
      ],
      providers: [
        {provide: EventComponent, useClass: DummyParent},
        {provide: ConfigurationService, useClass: ConfigurationServiceStub},
        {provide: ScheduleService, useClass: ScheduleServiceStub},
        {provide: TournamentService, useClass: TournamentServiceStub},
        {provide: DisplayService, useClass: DisplayServiceStub},
        {provide: EventService, useClass: EventServiceStub},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
