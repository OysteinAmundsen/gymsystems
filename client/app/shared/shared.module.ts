import { PanelComponent } from './panel/panel.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog/dialog.component';
import { FaComponent } from './fontawesome/fa.component';
import { FaStackComponent } from './fontawesome/fa-stack.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FloatingLabelContainerDirective } from './floating-label/floating-label-container.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    DialogComponent,
    FaComponent,
    FaStackComponent,
    PanelComponent,
    DatepickerComponent,
    FloatingLabelContainerDirective
  ],
  exports: [
    DialogComponent,
    FaComponent,
    FaStackComponent,
    PanelComponent,
    DatepickerComponent,
    FloatingLabelContainerDirective
  ]
})
export class SharedModule { }
