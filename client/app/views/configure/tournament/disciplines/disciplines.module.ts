import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DragulaModule } from 'ng2-dragula';

import { SharedModule } from 'app/shared/shared.module';
import { ScoreSystemModule } from '../score-system/score-system.module';

import { DisciplinesComponent } from './disciplines.component';
import { DisciplineEditorComponent } from './discipline-editor/discipline-editor.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    DragulaModule,
    ScoreSystemModule,

    SharedModule
  ],
  declarations: [
    DisciplinesComponent, DisciplineEditorComponent
  ],
  exports: [
    DisciplinesComponent, DisciplineEditorComponent,
  ]
})
export class DisciplinesModule { }
