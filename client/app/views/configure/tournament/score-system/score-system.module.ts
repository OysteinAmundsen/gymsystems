import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DragulaModule } from 'ng2-dragula';

import { SharedModule } from 'app/shared/shared.module';
import { ScoreSystemComponent } from './score-system.component';
import { ScoreGroupEditorComponent } from './score-group-editor/score-group-editor.component';
import { MatCardModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    DragulaModule,

    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,

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
