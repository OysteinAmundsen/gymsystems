/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app/app.module';

import { ScoreGroupComponent } from './score-group.component';
import { ScoreComponent } from '../score/score.component';
import { IScoreContainer } from '../IScoreContainer';
import { IScoreGroup } from 'app/services/model/IScoreGroup';
import { IDiscipline } from 'app/services/model/IDiscipline';
import { Operation } from 'app/services/model/Operation';

@Component({
 selector  : 'app-cmp',
 template  : `<app-score-group [model]="group" [form]="scoreForm"></app-score-group>`
})
class WrapperComponent {
  group: IScoreContainer = <IScoreContainer>{
    scores: [], group: <IScoreGroup>{
      id: 0, name: '', type: 'C', judges: 2, max: 5, min: 0, discipline: <IDiscipline>{ }, operation: Operation.Addition
    },
  }
  scoreForm;

  constructor(private fb: FormBuilder) {
    this.scoreForm = fb.group({ 'field_C_0': [''], 'field_C_1': [''] });
  }
}
describe('ScoreGroupComponent', () => {
  let component: ScoreGroupComponent;
  let fixture: ComponentFixture<WrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
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
        ScoreGroupComponent,
        ScoreComponent
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
