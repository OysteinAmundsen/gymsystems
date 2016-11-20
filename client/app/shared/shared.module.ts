import { PanelComponent } from './panel/panel.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog/dialog.component';
import { FaComponent } from './fontawesome/fa.component';
import { FaStackComponent } from './fontawesome/fa-stack.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DialogComponent,
    FaComponent,
    FaStackComponent,
    PanelComponent
  ],
  exports: [
    DialogComponent,
    FaComponent,
    FaStackComponent,
    PanelComponent
  ]
})
export class SharedModule { }
