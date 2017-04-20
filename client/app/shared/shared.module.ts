import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DatepickerComponent } from './datepicker/datepicker.component';
import { DialogComponent } from './dialog/dialog.component';
import { FloatingLabelContainerDirective } from './floating-label/floating-label-container.directive';
import { PanelComponent } from './panel/panel.component';
import { FaComponent } from './fontawesome/fa.component';
import { FaStackComponent } from './fontawesome/fa-stack.component';
import { AutofocusDirective } from './autofocus/autofocus.directive';
import { SlideToggleComponent } from './slide-toggle/slide-toggle.component';
import { IfAuthDirective } from './if-auth.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    DatepickerComponent,
    DialogComponent,
    FloatingLabelContainerDirective,
    PanelComponent,
    FaComponent,
    FaStackComponent,
    AutofocusDirective,
    SlideToggleComponent,
    IfAuthDirective
  ],
  exports: [
    DatepickerComponent,
    DialogComponent,
    FloatingLabelContainerDirective,
    PanelComponent,
    FaComponent,
    FaStackComponent,
    AutofocusDirective,
    SlideToggleComponent,
    IfAuthDirective
  ]
})
export class SharedModule { }

