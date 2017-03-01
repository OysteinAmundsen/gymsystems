/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ScoreGroupComponent } from './score-group.component';

describe('ScoreGroupComponent', () => {
  let component: ScoreGroupComponent;
  let fixture: ComponentFixture<ScoreGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScoreGroupComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
