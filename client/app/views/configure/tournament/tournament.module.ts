import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';

import { TournamentRoutes } from './tournament.routes';

import { TournamentComponent } from './tournament.component';
import { TournamentEditorComponent } from './tournament-editor/tournament-editor.component';

import { ScoreComponent, ScoreGroupEditorComponent } from './score-system';
import { DisciplinesComponent, DisciplineEditorComponent } from './disciplines';
import { TeamsComponent, TeamEditorComponent } from './teams';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    SharedModule,
  ],
  declarations: [
    TournamentComponent, TournamentEditorComponent,
    ScoreComponent, ScoreGroupEditorComponent,
    DisciplinesComponent, DisciplineEditorComponent,
    TeamsComponent, TeamEditorComponent
  ]
})
export class TournamentModule { }
