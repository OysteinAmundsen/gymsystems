/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder } from '@angular/forms';
import { Component } from '@angular/core';

import { ScoreGroupComponent } from './score-group.component';
import { ScoreComponent } from '../score/score.component';

import { IScoreContainer } from '../IScoreContainer';
import { IScoreGroup, IDiscipline, Operation } from 'app/services/model';
import { AppModule } from 'app/app.module';
import { EventModule } from 'app/views/event/event.module';
import { ScoreService } from 'app/services/api';
import { ScoreServiceStub } from 'app/services/api/score/score.service.stub';

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
describe('views.event.list:ScoreGroupComponent', () => {
  let component: ScoreGroupComponent;
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
        { provide: ScoreService, useClass: ScoreServiceStub }
      ]
    })
    .overrideModule(EventModule, {
      set: {
        exports: [
          ScoreGroupComponent
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
