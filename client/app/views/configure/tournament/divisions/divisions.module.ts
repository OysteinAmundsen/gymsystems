import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DragulaModule } from 'ng2-dragula';

import { SharedModule } from 'app/shared/shared.module';
import { DivisionsComponent } from './divisions.component';
import { DivisionEditorComponent } from './division-editor/division-editor.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    DragulaModule,

    SharedModule
  ],
  declarations: [
    DivisionsComponent, DivisionEditorComponent
  ],
  exports: [
    DivisionsComponent, DivisionEditorComponent
  ]
})
export class DivisionsModule { }
