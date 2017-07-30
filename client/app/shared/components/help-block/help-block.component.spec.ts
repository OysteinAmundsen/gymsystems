import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpBlockComponent } from './help-block.component';
import { FaComponent } from '../fontawesome/fa.component';
import { FaStackComponent } from '../fontawesome/fa-stack.component';

describe('HelpBlockComponent', () => {
  let component: HelpBlockComponent;
  let fixture: ComponentFixture<HelpBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FaComponent,
        FaStackComponent,
        HelpBlockComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
