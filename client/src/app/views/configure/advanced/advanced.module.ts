import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// import { DragulaModule } from 'ng2-dragula';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTabsModule, MatFormFieldModule, MatInputModule } from '@angular/material';

import { SharedModule } from 'app/shared/shared.module';
import { DisciplinesModule } from '../tournament/disciplines/disciplines.module';
import { DivisionsModule } from '../tournament/divisions/divisions.module';
import { ScoreSystemModule } from '../tournament/score-system/score-system.module';

import { AdvancedComponent } from './advanced.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // DragulaModule.forRoot(),

    DragDropModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,

    SharedModule,
    DisciplinesModule,
    DivisionsModule,
    ScoreSystemModule,
  ],
  declarations: [
    AdvancedComponent
  ]
})
export class AdvancedModule { }
