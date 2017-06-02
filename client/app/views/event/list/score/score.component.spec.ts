/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { Component } from '@angular/core';
import { HttpModule, Http } from '@angular/http';

import { ScoreComponent } from './score.component';
import { IScoreGroup } from 'app/services/model/IScoreGroup';
import { IDiscipline } from 'app/services/model/IDiscipline';
import { Operation } from 'app/services/model/Operation';
import { ITournamentParticipantScore } from 'app/services/model/ITournamentParticipantScore';
import { ITournamentParticipant } from 'app/services/model/ITournamentParticipant';

@Component({
 selector  : 'app-cmp',
 template  : `<app-score [form]="form" [model]="score" [index]="idx"></app-score>`
})
class WrapperComponent {
  form;
  score: ITournamentParticipantScore = <ITournamentParticipantScore>{
    id: 0, value: 0, participant: <ITournamentParticipant>{ }, judgeIndex: 1,
    scoreGroup: <IScoreGroup>{
      id: 0, name: '', type: 'C', judges: 2, max: 5, min: 0, discipline: <IDiscipline>{ }, operation: Operation.Addition
    },
  }
  idx = 0;
  constructor(private fb: FormBuilder) {
    this.form = fb.group({ 'field_C_1': [''] });
  }
}

describe('ScoreComponent', () => {
  let component: ScoreComponent;
  let fixture: ComponentFixture<WrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [ WrapperComponent, ScoreComponent ]
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

