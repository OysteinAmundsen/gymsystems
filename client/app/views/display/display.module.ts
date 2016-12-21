import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DisplayRoutes } from './display.routes';
import { DisplayComponent } from './display.component';

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
