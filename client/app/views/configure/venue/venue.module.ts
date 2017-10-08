import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import {
  MatSortModule, MatCardModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, MatOptionModule
} from '@angular/material';

import { SharedModule } from 'app/shared/shared.module';

import { VenueComponent } from './venue.component';
import { VenueEditorComponent } from './venue-editor/venue-editor.component';
import { VenueService } from 'app/services/api';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    AgmCoreModule,

    MatSortModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule,

    RouterModule,
  ],
  declarations: [VenueComponent, VenueEditorComponent]
})
export class VenueModule { }
