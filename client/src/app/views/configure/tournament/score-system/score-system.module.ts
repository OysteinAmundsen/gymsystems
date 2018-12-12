import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// import { DragulaModule } from 'ng2-dragula';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { SharedModule } from 'app/shared/shared.module';
import { ScoreSystemComponent } from './score-system.component';
import { ScoreGroupEditorComponent } from './score-group-editor/score-group-editor.component';
import { MatCardModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule, MatButtonModule, MatAutocompleteModule, MatListModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    // DragulaModule.forRoot(),

    DragDropModule,
    MatListModule,
    MatAutocompleteModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule,

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
