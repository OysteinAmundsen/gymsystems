import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppModuleTest } from 'app/app.module.spec';
import { SaveButtonComponent } from './save-button.component';

describe('shared.components:SaveButtonComponent', () => {
  let component: SaveButtonComponent;
  let fixture: ComponentFixture<SaveButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModuleTest
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
