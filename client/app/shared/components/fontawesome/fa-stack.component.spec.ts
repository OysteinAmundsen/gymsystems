import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaStackComponent } from './fa-stack.component';

describe('shared.components:FaStackComponent', () => {
  let component: FaStackComponent;
  let fixture: ComponentFixture<FaStackComponent>;

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
