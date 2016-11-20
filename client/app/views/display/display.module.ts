import { DisplayComponent } from './display.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DisplayRoutes } from './display.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([...DisplayRoutes])
  ],
  declarations: [
    DisplayComponent
  ]
})
export class DisplayModule { }
