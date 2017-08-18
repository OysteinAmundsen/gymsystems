/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app/app.module';

import { ScoreboardComponent } from './scoreboard.component';
import { ScoreGroupComponent } from '../score-group/score-group.component';
import { ScoreComponent } from '../score/score.component';
import { ListComponent } from 'app/views/event/list/list.component';
import { EventComponent } from 'app/views/event/event.component';

import { DummyParent } from 'app/views/event/list/list.component.spec';

import { SharedModule } from 'app/shared/shared.module';

import { ScoreService, UserService, ScheduleService, TeamsService, EventService, ConfigurationService } from 'app/services/api';
import { ITeamInDiscipline, IDiscipline, ITeam, ITournament, IScoreGroup, Operation } from 'app/services/model';

import { HttpInterceptor } from 'app/services/config/HttpInterceptor';
import { ErrorHandlerService } from 'app/services/config/ErrorHandler.service';
import { MediaService } from 'app/services';

import { UserServiceStub } from 'app/services/api/user/user.service.stub';
import { ScoreServiceStub } from 'app/services/api/score/score.service.stub';
import { ScheduleServiceStub } from 'app/services/api/schedule/schedule.service.stub';
import { TeamsServiceStub } from 'app/services/api/teams/teams.service.stub';
import { EventServiceStub } from 'app/services/api/event/event.service.stub';
import { ConfigurationServiceStub } from 'app/services/api/configuration/configuration.service.stub';

@Component({
 selector  : 'app-cmp',
 template  : `<app-scoreboard [participant]="item"></app-scoreboard>`
})
class WrapperComponent {
  item: ITeamInDiscipline = <ITeamInDiscipline>{
    id: 0, startNumber: 0, team: <ITeam>{}, tournament: <ITournament>{}, scores: [], discipline: <IDiscipline>{
      id: 0, name: '', sortOrder: 0, tournament: <ITournament>{}, scoreGroups: [
        <IScoreGroup>{ id: 0, name: '', type: 'C', judges: 2, max: 5, min: 0, discipline: <IDiscipline>{ }, operation: Operation.Addition }
      ]
    },
  }
  constructor() {
  }
}
describe('ScoreboardComponent', () => {
  let component: ScoreboardComponent;
  let fixture: ComponentFixture<WrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
      ],
      declarations: [
        WrapperComponent,
        ScoreboardComponent,
        ScoreGroupComponent,
        ScoreComponent
      ],
      providers: [
        ListComponent,
        ErrorHandlerService,
        MediaService,
        { provide: EventComponent, useClass: DummyParent},
        { provide: Http, useClass: HttpInterceptor },
        { provide: ScoreService, useClass: ScoreServiceStub },
        { provide: UserService, useClass: UserServiceStub },
        { provide: ScheduleService, useClass: ScheduleServiceStub},
        { provide: TeamsService, useClass: TeamsServiceStub},
        { provide: EventService, useClass: EventServiceStub},
        { provide: ConfigurationService, useClass: ConfigurationServiceStub},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperComponent);
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
