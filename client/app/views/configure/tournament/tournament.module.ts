import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { DisciplinesModule } from './disciplines/disciplines.module';

import { TournamentRoutes } from './tournament.routes';

import { TournamentComponent } from './tournament.component';
import { TournamentEditorComponent } from './tournament-editor/tournament-editor.component';

import { TeamsComponent, TeamEditorComponent } from './teams';
import { DivisionsComponent } from './divisions/divisions.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { DivisionEditorComponent } from './divisions/division-editor/division-editor.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    SharedModule,
    DisciplinesModule
  ],
  declarations: [
    TournamentComponent, TournamentEditorComponent,
    TeamsComponent, TeamEditorComponent, DivisionsComponent, ScheduleComponent, DivisionEditorComponent
  ]
})
export class TournamentModule { }
