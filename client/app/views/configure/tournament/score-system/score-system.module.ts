import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DragulaModule } from 'ng2-dragula';

import { SharedModule } from 'app/shared/shared.module';
import { ScoreSystemComponent } from './score-system.component';
import { ScoreGroupEditorComponent } from './score-group-editor/score-group-editor.component';

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
    ScoreSystemComponent, ScoreGroupEditorComponent,
  ],
  exports: [
    ScoreSystemComponent, ScoreGroupEditorComponent,
  ]
})
export class ScoreSystemModule { }
