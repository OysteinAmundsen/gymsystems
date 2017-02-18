import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DisplayRoutes } from './display.routes';
import { DisplayComponent } from './display.component';
import { FullscreenComponent } from './fullscreen/fullscreen.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([...DisplayRoutes])
  ],
  declarations: [
    DisplayComponent,
    FullscreenComponent
  ]
})
export class DisplayModule { }
