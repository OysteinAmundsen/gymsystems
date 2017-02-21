import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DatepickerComponent } from './datepicker/datepicker.component';
import { DialogComponent } from './dialog/dialog.component';
import { FloatingLabelContainerDirective } from './floating-label/floating-label-container.directive';
import { PanelComponent } from './panel/panel.component';
import { FaComponent } from './fontawesome/fa.component';
import { FaStackComponent } from './fontawesome/fa-stack.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [DatepickerComponent, DialogComponent, FloatingLabelContainerDirective, PanelComponent, FaComponent, FaStackComponent],
  exports: [DatepickerComponent, DialogComponent, FloatingLabelContainerDirective, PanelComponent, FaComponent, FaStackComponent]
})
export class SharedModule { }

