/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AddScoreComponent } from './add-score.component';

describe('ScoreComponent', () => {
  let component: AddScoreComponent;
  let fixture: ComponentFixture<AddScoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddScoreComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
