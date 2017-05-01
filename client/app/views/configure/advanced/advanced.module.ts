import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragulaModule } from 'ng2-dragula';

import { SharedModule } from 'app/shared/shared.module';
import { DisciplinesModule } from '../tournament/disciplines/disciplines.module';
import { DivisionsModule } from '../tournament/divisions/divisions.module';

import { AdvancedComponent } from './advanced.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DragulaModule,

    SharedModule,
    DisciplinesModule,
    DivisionsModule,
  ],
  declarations: [
    AdvancedComponent
  ]
})
export class AdvancedModule { }
