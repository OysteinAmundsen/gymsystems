import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ConfigureRoutes } from './configure.routes';
import { SharedModule } from 'app/shared/shared.module';

import { TournamentModule } from './tournament/tournament.module';
import { UsersModule } from 'app/views/configure/users/users.module';

import { ConfigureComponent } from './configure.component';
import { ConfigureDisplayComponent } from './display/configure-display.component';
import { MacroDialogComponent } from './display/macro-dialog/macro-dialog.component';
import { AdvancedComponent } from './advanced/advanced.component';
import { AdvancedModule } from './advanced/advanced.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([...ConfigureRoutes]),

    SharedModule,
    TournamentModule,
    UsersModule,
    AdvancedModule
  ],
  declarations: [
    ConfigureComponent,
    ConfigureDisplayComponent,
    MacroDialogComponent
  ]
})
export class ConfigureModule { }
