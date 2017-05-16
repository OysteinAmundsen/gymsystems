import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DragulaModule } from 'ng2-dragula';
import { MarkdownToHtmlModule } from 'markdown-to-html-pipe';

import { SharedModule } from 'app/shared/shared.module';
import { DisciplinesModule } from './disciplines/disciplines.module';
import { DivisionsModule } from './divisions/divisions.module';

import { TournamentRoutes } from './tournament.routes';

import { TournamentComponent } from './tournament.component';
import { TournamentEditorComponent } from './tournament-editor/tournament-editor.component';

import { TeamsComponent, TeamEditorComponent } from './teams';
import { ScheduleComponent } from './schedule/schedule.component';
import { InfoComponent } from './info/info.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    DragulaModule,
    MarkdownToHtmlModule,

    SharedModule,
    DisciplinesModule,
    DivisionsModule
  ],
  declarations: [
    TournamentComponent, TournamentEditorComponent,
    TeamsComponent, TeamEditorComponent, ScheduleComponent, InfoComponent
  ]
})
export class TournamentModule { }
