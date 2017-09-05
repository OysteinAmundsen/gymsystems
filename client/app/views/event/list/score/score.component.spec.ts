/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder } from '@angular/forms';
import { Component } from '@angular/core';

import { AppModule } from 'app/app.module';
import { EventModule } from '../../event.module';
import { ScoreComponent } from './score.component';
import { IScoreGroup, IDiscipline, Operation, IScore, ITeamInDiscipline } from 'app/services/model';

@Component({
 selector  : 'app-cmp',
 template  : `<app-score [form]="form" [model]="score" [index]="idx"></app-score>`
})
class WrapperComponent {
  form;
  score: IScore = <IScore>{
    id: 0, value: 0, participant: <ITeamInDiscipline>{ }, judgeIndex: 1,
    scoreGroup: <IScoreGroup>{
      id: 0, name: '', type: 'C', judges: 2, max: 5, min: 0, discipline: <IDiscipline>{ }, operation: Operation.Addition
    },
  }
  idx = 0;
  constructor(private fb: FormBuilder) {
    this.form = fb.group({ 'field_C_1': [''] });
  }
}

describe('views.event.list:ScoreComponent', () => {
  let component: ScoreComponent;
  let fixture: ComponentFixture<WrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        EventModule,
        RouterTestingModule,
      ],
      declarations: [ WrapperComponent ]
    })
    .overrideModule(EventModule, {
      set: {
        exports: [ ScoreComponent ]
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

