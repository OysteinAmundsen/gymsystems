import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaStackComponent } from './fa-stack.component';

describe('FaStackComponent', () => {
  let component: FaStackComponent;
  let fixture: ComponentFixture<app-faStackComponent >;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FaStackComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaStackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});