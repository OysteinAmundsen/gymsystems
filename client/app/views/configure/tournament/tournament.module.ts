import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DragulaModule } from 'ng2-dragula';

import { SharedModule } from 'app/shared/shared.module';
import { DisciplinesModule } from './disciplines/disciplines.module';

import { TournamentRoutes } from './tournament.routes';

import { TournamentComponent } from './tournament.component';
import { TournamentEditorComponent } from './tournament-editor/tournament-editor.component';

import { TeamsComponent, TeamEditorComponent } from './teams';
import { DivisionsComponent, DivisionEditorComponent } from './divisions';
import { ScheduleComponent } from './schedule/schedule.component';
import { InfoComponent } from './info/info.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    DragulaModule,

    SharedModule,
    DisciplinesModule
  ],
  declarations: [
    TournamentComponent, TournamentEditorComponent,
    TeamsComponent, TeamEditorComponent, DivisionsComponent, ScheduleComponent, DivisionEditorComponent, InfoComponent
  ]
})
export class TournamentModule { }
