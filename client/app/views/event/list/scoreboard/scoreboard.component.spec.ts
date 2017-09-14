/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { AppModuleTest } from 'app/app.module.spec';
import { EventModule } from '../../event.module';
import { ScoreboardComponent } from './scoreboard.component';

import { ITeamInDiscipline, IDiscipline, ITeam, ITournament, IScoreGroup, Operation } from 'app/model';

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
        AppModuleTest,
        EventModule,
        RouterTestingModule,
      ],
      declarations: [
        WrapperComponent
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

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
