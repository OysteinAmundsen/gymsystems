import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';

import { SharedModule } from 'app/shared/shared.module';

import { VenueComponent } from './venue.component';
import { VenueEditorComponent } from './venue-editor/venue-editor.component';
import { VenueService } from 'app/services/api';
import { MdSortModule, MdCardModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    AgmCoreModule,

    MdSortModule,
    MdCardModule,

    RouterModule,
  ],
  declarations: [VenueComponent, VenueEditorComponent]
})
export class VenueModule { }
