import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgeClassEditorComponent } from './age-class-editor.component';

describe('AgeClassEditorComponent', () => {
  let component: AgeClassEditorComponent;
  let fixture: ComponentFixture<AgeClassEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgeClassEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgeClassEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
