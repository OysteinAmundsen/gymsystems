import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MarkdownToHtmlModule } from 'markdown-to-html-pipe';
import { DragulaModule } from 'ng2-dragula';
import {
  MatSortModule, MatCardModule, MatTabsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule,
  MatOptionModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule, MatSlideToggleModule
} from '@angular/material';

import { SharedModule } from 'app/shared/shared.module';
import { ConfigureSharedModule } from '../_shared/_shared.module';
import { DisciplinesModule } from './disciplines/disciplines.module';
import { DivisionsModule } from './divisions/divisions.module';

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
    MarkdownToHtmlModule,
    DragulaModule,

    MatCardModule,
    MatTabsModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSlideToggleModule,

    SharedModule,
    DisciplinesModule,
    DivisionsModule,
    ConfigureSharedModule
  ],
  declarations: [
    TournamentComponent, TournamentEditorComponent,
    TeamsComponent, TeamEditorComponent, ScheduleComponent, InfoComponent
  ]
})
export class TournamentModule { }
