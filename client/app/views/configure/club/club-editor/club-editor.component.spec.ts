import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubEditorComponent } from './club-editor.component';

describe('ClubEditorComponent', () => {
  let component: ClubEditorComponent;
  let fixture: ComponentFixture<ClubEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClubEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
