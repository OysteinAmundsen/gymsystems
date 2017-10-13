// Framework & libs
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MarkdownToHtmlModule } from 'markdown-to-html-pipe';
import {
  MatCardModule, MatFormFieldModule, MatSelectModule, MatOptionModule, MatSlideToggleModule, MatButtonModule, MatDialogModule, MatListModule
} from '@angular/material';

// Module dependencies
import { SharedModule } from 'app/shared/shared.module';
import { EventRoutingModule } from './event-routing.module';

// Module components
import { EventComponent } from './event.component';
import { ListComponent } from './list/list.component';
import { ScoreGroupComponent } from './list/score-group/score-group.component';
import { ScoreComponent } from './list/score/score.component';
import { ScoreboardComponent } from './list/scoreboard/scoreboard.component';
import { DisplayComponent } from './display/display.component';
import { FullscreenComponent } from './display/fullscreen/fullscreen.component';
import { ResultsComponent } from './results/results.component';
import { SignoffReportComponent } from './signoff-report/signoff-report.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { ContextMenuComponent } from './list/context-menu/context-menu.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MarkdownToHtmlModule,

    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule,

    EventRoutingModule
  ],
  declarations: [
    EventComponent,
    ListComponent,
    ScoreGroupComponent,
    ScoreComponent,
    ScoreboardComponent,

    DisplayComponent,
    FullscreenComponent,

    ResultsComponent,

    SignoffReportComponent,

    ContextMenuComponent
  ],
  entryComponents: [
    ContextMenuComponent
  ]
})
export class EventModule { }
