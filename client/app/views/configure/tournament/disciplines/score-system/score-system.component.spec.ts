/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ScoreSystemComponent } from './score-system.component';

describe('ScoreComponent', () => {
  let component: ScoreSystemComponent;
  let fixture: ComponentFixture<ScoreSystemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScoreSystemComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
