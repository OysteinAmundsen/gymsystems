import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgeClassComponent } from './age-class.component';

describe('AgeClassComponent', () => {
  let component: AgeClassComponent;
  let fixture: ComponentFixture<AgeClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgeClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgeClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
