/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app/app.module';
import { MarkdownToHtmlModule } from 'markdown-to-html-pipe';
import { ReplaySubject } from 'rxjs/Rx';

import { SharedModule } from 'app/shared/shared.module';
import { ListComponent } from './list.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { ScoreGroupComponent } from './score-group/score-group.component';
import { ScoreComponent } from './score/score.component';
import { EventComponent } from '../event.component';

import { UserService, ScheduleService, TeamsService, EventService, ConfigurationService, ScoreService } from 'app/services/api';
import { MediaService } from 'app/services/media.service';
import { ITournament } from 'app/services/model/ITournament';

import { EventServiceStub } from 'app/services/api/event.service.stub';
import { TeamsServiceStub } from 'app/services/api/teams.service.stub';
import { TournamentServiceStub, dummyTournament } from 'app/services/api/tournament.service.stub';
import { UserServiceStub } from 'app/services/api/user.service.stub';
import { ScheduleServiceStub } from 'app/services/api/schedule.service.stub';
import { ErrorHandlerService } from 'app/services/config/ErrorHandler.service';
import { ConfigurationServiceStub } from 'app/services/api/configuration.service.stub';
import { ScoreServiceStub } from 'app/services/api/score.service.stub';

class DummyParent {
  tournamentSubject = new ReplaySubject<ITournament>(1);
  constructor() {
    this.tournamentSubject.next(dummyTournament);
  }
}
describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        RouterTestingModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        MarkdownToHtmlModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [Http]
          }
        }),
      ],
      declarations: [
        ListComponent ,
        ScoreboardComponent,
        ScoreGroupComponent,
        ScoreComponent
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