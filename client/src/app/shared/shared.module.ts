import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
// import { DragulaModule } from 'ng2-dragula';
import { DragDropModule } from '@angular/cdk/drag-drop';

// Shared components
import { DialogComponent } from './components/dialog/dialog.component';

// Shared directives
import { AutofocusDirective } from './directives/autofocus/autofocus.directive';
import { IfAuthDirective } from './directives/auth/if-auth.directive';

// Shared pipes
import { OrderByPipe } from './pipes/order-by.pipe';
import { MultirangeComponent } from './components/multirange/multirange.component';
import { SaveButtonComponent } from './components/save-button/save-button.component';
import { UtcDatePipe } from './pipes/utc-date.pipe';
import { HelpBlockComponent } from './components/help-block/help-block.component';
import { ToCaseDirective } from './directives/to-uppercase/to-uppercase.directive';
import { MatButtonModule, MatProgressBarModule, MatDialogModule } from '@angular/material';
import { ErrorDialogComponent } from './components/error-dialog/error-dialog.component';
import { LoadSpinnerComponent } from './components/load-spinner/load-spinner.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,

    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    // DragulaModule.forRoot(),

    MatDialogModule,
    MatButtonModule,
    MatProgressBarModule,

    RouterModule,
  ],
  declarations: [
    DialogComponent,
    ErrorDialogComponent,
    MultirangeComponent,
    SaveButtonComponent,
    HelpBlockComponent,
    LoadSpinnerComponent,

    ToCaseDirective,
    AutofocusDirective,
    IfAuthDirective,

    OrderByPipe,
    UtcDatePipe,
  ],
  exports: [
    // Export common modules
    CommonModule,
    TranslateModule,

    // Export components
    DialogComponent,
    ErrorDialogComponent,
    MultirangeComponent,
    SaveButtonComponent,
    HelpBlockComponent,
    LoadSpinnerComponent,

    ToCaseDirective,
    AutofocusDirective,
    IfAuthDirective,

    OrderByPipe,
    UtcDatePipe,
  ],
  entryComponents: [
    ErrorDialogComponent,
  ]
})
export class SharedModule { }
