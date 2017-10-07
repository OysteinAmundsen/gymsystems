import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DragulaModule } from 'ng2-dragula';

import { SharedModule } from 'app/shared/shared.module';
import { DisciplinesModule } from '../tournament/disciplines/disciplines.module';
import { DivisionsModule } from '../tournament/divisions/divisions.module';
import { ScoreSystemModule } from '../tournament/score-system/score-system.module';

import { AdvancedComponent } from './advanced.component';
import { MdTabsModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DragulaModule,

    MdTabsModule,

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
