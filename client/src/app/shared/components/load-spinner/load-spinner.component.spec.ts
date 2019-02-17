import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LoadSpinnerComponent } from './load-spinner.component';

describe('shared.components:LoadSpinnerComponent', () => {
  let comp: LoadSpinnerComponent;
  let fixture: ComponentFixture<LoadSpinnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoadSpinnerComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(LoadSpinnerComponent);
    comp = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(comp).toBeTruthy();
  });

});
