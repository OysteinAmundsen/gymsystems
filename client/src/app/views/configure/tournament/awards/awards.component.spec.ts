import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardsComponent } from './awards.component';

describe('AwardsComponent', () => {
  let component: AwardsComponent;
  let fixture: ComponentFixture<AwardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
