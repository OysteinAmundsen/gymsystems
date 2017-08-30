import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, Http } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app/app.module';
import { ReplaySubject } from 'rxjs/Rx';

import { SharedModule } from 'app/shared/shared.module';

import { FullscreenComponent } from './fullscreen.component';
import { ConfigurationService, ScheduleService, TournamentService, DisplayService, EventService } from 'app/services/api';
import { ITournament } from 'app/services/model';

import { EventServiceStub } from 'app/services/api/event/event.service.stub';
import { DisplayServiceStub } from 'app/services/api/display/display.service.stub';
import { TournamentServiceStub, dummyTournament } from 'app/services/api/tournament/tournament.service.stub';
import { ScheduleServiceStub } from 'app/services/api/schedule/schedule.service.stub';
import { ConfigurationServiceStub } from 'app/services/api/configuration/configuration.service.stub';
import { EventComponent } from '../../event.component';

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
        SharedModule,
        RouterTestingModule,
        HttpModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
      ],
      declarations: [ FullscreenComponent ],
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
