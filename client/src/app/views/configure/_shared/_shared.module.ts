import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatAutocompleteModule, MatFormFieldModule, MatSelectModule } from '@angular/material';
import { DragDropModule } from '@angular/cdk/drag-drop';
// import { DragulaModule } from 'ng2-dragula';

import { SharedModule } from 'app/shared/shared.module';
import { MemberSelectorComponent } from './member-selector/member-selector.component';
import { DivisionLookupComponent } from './division-lookup/division-lookup.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    // DragulaModule.forRoot(),
    ReactiveFormsModule,
    RouterModule,

    DragDropModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatSelectModule,
    SharedModule,
  ],
  declarations: [MemberSelectorComponent, DivisionLookupComponent],
  exports: [MemberSelectorComponent, DivisionLookupComponent]
})
export class ConfigureSharedModule { }
