import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ConfigureRoutes } from './configure.routes';
import { SharedModule } from 'app/shared/shared.module';

import { ConfigureComponent } from './configure.component';
import { ConfigureScoreComponent } from './configure-score/configure-score.component';
import { ConfigureDisplayComponent } from './configure-display/configure-display.component';
import { MacroDialogComponent } from './configure-display/macro-dialog/macro-dialog.component';
import { ConfigureDisciplinesComponent, DisciplineEditorComponent } from './configure-disciplines';
import { ConfigureTeamsComponent, TeamEditorComponent } from './configure-teams';
import { ConfigureTournamentComponent, TournamentEditorComponent } from './configure-tournament';
import { AdvancedComponent } from './advanced/advanced.component';
import { ScoreGroupEditorComponent } from './configure-score/score-group-editor/score-group-editor.component';

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
    DisciplineEditorComponent,

    ConfigureTeamsComponent,
    TeamEditorComponent,

    ConfigureTournamentComponent,
    TournamentEditorComponent,

    AdvancedComponent,

    ScoreGroupEditorComponent
  ]
})
export class ConfigureModule { }
