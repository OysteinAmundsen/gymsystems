import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaComponent } from './fa.component';

describe('FaComponent', () => {
  let component: FaComponent;
  let fixture: ComponentFixture<app-faComponent >;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
