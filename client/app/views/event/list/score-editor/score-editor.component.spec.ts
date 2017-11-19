import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreEditorComponent } from './score-editor.component';

describe('ScoreEditorComponent', () => {
  let component: ScoreEditorComponent;
  let fixture: ComponentFixture<ScoreEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoreEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
