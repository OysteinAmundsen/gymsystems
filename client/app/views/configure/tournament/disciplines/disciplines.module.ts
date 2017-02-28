import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DragulaModule } from 'ng2-dragula';

import { SharedModule } from 'app/shared/shared.module';
import { DisciplinesComponent } from './disciplines.component';
import { DisciplineEditorComponent } from './discipline-editor/discipline-editor.component';
import { ScoreSystemComponent, ScoreGroupEditorComponent } from './score-system';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    DragulaModule,

    SharedModule
  ],
  declarations: [
    DisciplinesComponent, DisciplineEditorComponent,
    ScoreSystemComponent, ScoreGroupEditorComponent,
  ]
})
export class DisciplinesModule { }
