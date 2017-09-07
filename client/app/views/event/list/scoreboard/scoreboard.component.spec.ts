/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { AppModule } from 'app/app.module';
import { EventModule } from '../../event.module';
import { ScoreboardComponent } from './scoreboard.component';

import { ITeamInDiscipline, IDiscipline, ITeam, ITournament, IScoreGroup, Operation } from 'app/services/model';
import { ScoreService, UserService, ScheduleService, TeamsService, EventService, ConfigurationService } from 'app/services/api';
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
describe('views.event.list:ScoreboardComponent', () => {
  let component: ScoreboardComponent;
  let fixture: ComponentFixture<WrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        EventModule,
        RouterTestingModule,
      ],
      declarations: [
        WrapperComponent
      ],
      providers: [
        MediaService,
        { provide: ScoreService, useClass: ScoreServiceStub },
        { provide: UserService, useClass: UserServiceStub },
        { provide: ScheduleService, useClass: ScheduleServiceStub },
        { provide: TeamsService, useClass: TeamsServiceStub },
        { provide: EventService, useClass: EventServiceStub },
        { provide: ConfigurationService, useClass: ConfigurationServiceStub },
      ]
    })
    .overrideModule(EventModule, {
      set: {
        exports: [
          ScoreboardComponent
        ]
      }
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
