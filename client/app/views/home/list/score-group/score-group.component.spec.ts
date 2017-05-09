/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app';

import { ScoreGroupComponent } from './score-group.component';
import { ScoreComponent } from 'app/views/home/list/score/score.component';
import { IScoreContainer } from "app/views/home/list/IScoreContainer";
import { IScoreGroup } from "app/services/model/IScoreGroup";
import { IDiscipline } from "app/services/model/IDiscipline";
import { Operation } from "app/services/model/Operation";

describe('ScoreGroupComponent', () => {
  let component: ScoreGroupComponent;
  let fixture: ComponentFixture<TestCmpWrapper>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
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
        ScoreGroupComponent,
        ScoreComponent
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
 template  : `<app-score-group [model]="group" [form]="scoreForm"></app-score-group>`
})
class TestCmpWrapper {
  group: IScoreContainer = <IScoreContainer>{
    group: <IScoreGroup>{
      id: 0,
      name: '',
      type: 'C',
      judges: 2,
      max: 5,
      min: 0,
      discipline: <IDiscipline>{

      },
      operation: Operation.Addition
    },
    scores: []
  }
  scoreForm;

  constructor(private fb: FormBuilder) {
    this.scoreForm = fb.group({
      'field_C_0': [''],
      'field_C_1': ['']
    });
  }
}
