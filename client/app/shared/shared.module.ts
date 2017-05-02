import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from "@ngx-translate/core";

// Shared components
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { PanelComponent } from './components/panel/panel.component';
import { FaComponent } from './components/fontawesome/fa.component';
import { FaStackComponent } from './components/fontawesome/fa-stack.component';
import { SlideToggleComponent } from './components/slide-toggle/slide-toggle.component';

// Shared directives
import { FloatingLabelContainerDirective } from './directives/floating-label/floating-label-container.directive';
import { AutofocusDirective } from './directives/autofocus/autofocus.directive';
import { IfAuthDirective } from './directives/auth/if-auth.directive';

// Shared pipes
import { ToUpperPipe } from './pipes/to-upper.pipe';
import { TypeaheadComponent } from './components/typeahead/typeahead.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [
    DatepickerComponent,
    DialogComponent,
    PanelComponent,
    FaComponent,
    FaStackComponent,
    SlideToggleComponent,
    TypeaheadComponent,

    FloatingLabelContainerDirective,
    AutofocusDirective,
    IfAuthDirective,

    ToUpperPipe,
  ],
  exports: [
    // Export common modules
    CommonModule,
    TranslateModule,

    // Export components
    DatepickerComponent,
    DialogComponent,
    PanelComponent,
    FaComponent,
    FaStackComponent,
    SlideToggleComponent,
    TypeaheadComponent,

    FloatingLabelContainerDirective,
    AutofocusDirective,
    IfAuthDirective,

    ToUpperPipe
  ]
})
export class SharedModule { }

