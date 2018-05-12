import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppModuleTest } from 'app/app.module.spec';
import { VenueEditorComponent } from './venue-editor.component';
import { AgmCoreModule } from '@agm/core';
import { VenueService } from 'app/services/api';
import { MatCardModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule } from '@angular/material';

describe('VenueEditorComponent', () => {
  let component: VenueEditorComponent;
  let fixture: ComponentFixture<VenueEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModuleTest,
        MatCardModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        AgmCoreModule.forRoot({ apiKey: VenueService.apiKey })
      ],
      declarations: [ VenueEditorComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenueEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
