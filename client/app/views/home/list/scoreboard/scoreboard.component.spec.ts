/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { Component } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app';

import { ScoreboardComponent } from './scoreboard.component';
import { ScoreGroupComponent } from '../score-group/score-group.component';
import { ScoreComponent } from '../score/score.component';
import { SharedModule } from 'app/shared/shared.module';
import { ScoreService, UserService } from 'app/services/api';
import { ITournamentParticipant } from "app/services/model/ITournamentParticipant";
import { IDiscipline } from "app/services/model/IDiscipline";
import { ITeam } from "app/services/model/ITeam";
import { ITournament } from "app/services/model/ITournament";
import { IScoreGroup } from "app/services/model/IScoreGroup";
import { Operation } from "app/services/model/Operation";

describe('ScoreboardComponent', () => {
  let component: ScoreboardComponent;
  let fixture: ComponentFixture<TestCmpWrapper>;

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
      declarations: [
        TestCmpWrapper,
        ScoreboardComponent,
        ScoreGroupComponent,
        ScoreComponent
      ],
      providers: [
        ScoreService,
        UserService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCmpWrapper);
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
 selector  : 'test-cmp',
 template  : `<scoreboard [participant]="item" (onClose)="closeEditor()"></scoreboard>`
})
class TestCmpWrapper {
  item: ITournamentParticipant = <ITournamentParticipant>{
    id: 0,
    startNumber: 0,
    discipline: <IDiscipline>{
      id: 0,
      name: '',
      sortOrder: 0,
      tournament: <ITournament>{},
      scoreGroups: [
        <IScoreGroup>{
          id: 0,
          name: '',
          type: 'C',
          judges: 2,
          max: 5,
          min: 0,
          discipline: <IDiscipline>{ },
          operation: Operation.Addition
        }
      ]
    },
    team: <ITeam>{},
    tournament: <ITournament>{},
    scores: []
  }
  constructor() {
  }
}
