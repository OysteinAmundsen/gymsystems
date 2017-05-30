import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultirangeComponent } from './multirange.component';
import { FormsModule } from "@angular/forms";

describe('MultirangeComponent', () => {
  let component: MultirangeComponent;
  let fixture: ComponentFixture<MultirangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [ MultirangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultirangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
