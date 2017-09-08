import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DragulaModule } from 'ng2-dragula';
import { RouterModule } from '@angular/router';
import { Angular2FontawesomeModule } from 'angular2-fontawesome';

// Shared components
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { PanelComponent } from './components/panel/panel.component';
import { SlideToggleComponent } from './components/slide-toggle/slide-toggle.component';

// Shared directives
import { FloatingLabelContainerDirective } from './directives/floating-label/floating-label-container.directive';
import { AutofocusDirective } from './directives/autofocus/autofocus.directive';
import { IfAuthDirective } from './directives/auth/if-auth.directive';

// Shared pipes
import { ToUpperPipe } from './pipes/to-upper.pipe';
import { TypeaheadComponent } from './components/typeahead/typeahead.component';
import { OrderByPipe } from './pipes/order-by.pipe';
import { MultirangeComponent } from './components/multirange/multirange.component';
import { SaveButtonComponent } from './components/save-button/save-button.component';
import { UtcDatePipe } from './pipes/utc-date.pipe';
import { HelpBlockComponent } from './components/help-block/help-block.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    DragulaModule,
    RouterModule,
    Angular2FontawesomeModule
  ],
  declarations: [
    DatepickerComponent,
    DialogComponent,
    PanelComponent,
    SlideToggleComponent,
    TypeaheadComponent,
    MultirangeComponent,
    SaveButtonComponent,
    HelpBlockComponent,

    FloatingLabelContainerDirective,
    AutofocusDirective,
    IfAuthDirective,

    ToUpperPipe,
    OrderByPipe,
    UtcDatePipe,
  ],
  exports: [
    // Export common modules
    CommonModule,
    TranslateModule,
    Angular2FontawesomeModule,

    // Export components
    DatepickerComponent,
    DialogComponent,
    PanelComponent,
    SlideToggleComponent,
    TypeaheadComponent,
    MultirangeComponent,
    SaveButtonComponent,
    HelpBlockComponent,

    FloatingLabelContainerDirective,
    AutofocusDirective,
    IfAuthDirective,

    ToUpperPipe,
    OrderByPipe,
    UtcDatePipe,
  ]
})
export class SharedModule { }

