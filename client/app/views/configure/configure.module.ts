import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ConfigureRoutes } from './configure.routes';
import { SharedModule } from 'app/shared/shared.module';

import { TournamentModule } from './tournament/tournament.module';

import { ConfigureComponent } from './configure.component';
import { ConfigureDisplayComponent } from './configure-display/configure-display.component';
import { MacroDialogComponent } from './configure-display/macro-dialog/macro-dialog.component';
import { AdvancedComponent } from './advanced/advanced.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([...ConfigureRoutes]),

    SharedModule,
    TournamentModule
  ],
  declarations: [
    ConfigureComponent,
    ConfigureDisplayComponent,
    MacroDialogComponent,
    AdvancedComponent
  ]
})
export class ConfigureModule { }
