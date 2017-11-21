import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material';

import { ScoreEditorComponent } from './score-editor.component';
import { AppModuleTest } from 'app/app.module.spec';
import { generateParticipants } from 'app/services/api/schedule/schedule.service.stub';
import { ITeamInDiscipline } from 'app/model';

@Component({
  selector: 'app-cmp',
  template: `<app-score-editor [participant]='participant'></app-score-editor>`
})
class WrapperComponent {
  participant: ITeamInDiscipline;
  constructor() {
    this.participant = generateParticipants(1)[0];
  }
}
describe('ScoreEditorComponent', () => {
  let component: ScoreEditorComponent;
  let fixture: ComponentFixture<WrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModuleTest,
        MatCardModule,
      ],
      declarations: [
        WrapperComponent,
        ScoreEditorComponent
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
