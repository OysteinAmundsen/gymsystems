import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { AddScoreRoutes } from './add-score.routes';

import { AddScoreComponent } from './add-score.component';
import { ScoreGroupComponent } from './scoreboard/score-group/score-group.component';
import { ScoreComponent } from './scoreboard/score-group/score/score.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([...AddScoreRoutes])
  ],
  declarations: [AddScoreComponent, ScoreGroupComponent, ScoreComponent, ScoreboardComponent]
})
export class AddScoreModule { }
