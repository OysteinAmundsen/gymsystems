import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// import { DragulaModule } from 'ng2-dragula';
import { MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule } from '@angular/material';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { SharedModule } from 'app/shared/shared.module';
import { ScoreSystemModule } from '../score-system/score-system.module';

import { DisciplinesComponent } from './disciplines.component';
import { DisciplineEditorComponent } from './discipline-editor/discipline-editor.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    // DragulaModule.forRoot(),
    ScoreSystemModule,

    DragDropModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,

    SharedModule,
  ],
  declarations: [
    DisciplinesComponent, DisciplineEditorComponent
  ],
  exports: [
    DisciplinesComponent, DisciplineEditorComponent,
  ]
})
export class DisciplinesModule { }
