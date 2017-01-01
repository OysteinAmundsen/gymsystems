import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ConfigureRoutes } from './configure.routes';
import { SharedModule } from '../../shared/shared.module';

import { ConfigureComponent } from './configure.component';
import { ConfigureScoreComponent } from './configure-score/configure-score.component';
import { ConfigureDisplayComponent } from './configure-display/configure-display.component';
import { MacroDialogComponent } from './configure-display/macro-dialog/macro-dialog.component';
import { ConfigureDisciplinesComponent } from './configure-disciplines/configure-disciplines.component';
import { ConfigureTeamsComponent } from './configure-teams/configure-teams.component';
import { ConfigureTournamentComponent } from './configure-tournament/configure-tournament.component';
import { AdvancedComponent } from './advanced/advanced.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    SharedModule,
    RouterModule.forChild([...ConfigureRoutes])
  ],
  declarations: [
    ConfigureComponent,
    ConfigureScoreComponent,
    ConfigureDisplayComponent,
    MacroDialogComponent,
    ConfigureDisciplinesComponent,
    ConfigureTeamsComponent,
    ConfigureTournamentComponent,
    AdvancedComponent
  ]
})
export class ConfigureModule { }
