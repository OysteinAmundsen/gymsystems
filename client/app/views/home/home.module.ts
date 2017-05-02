import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';

import { HomeRoutes } from './home.routes';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login/login.component';

import { ListComponent } from './list/list.component';
import { ScoreGroupComponent } from './list/score-group/score-group.component';
import { ScoreComponent } from './list/score/score.component';
import { ScoreboardComponent } from './list/scoreboard/scoreboard.component';

import { DisplayComponent } from './display/display.component';
import { FullscreenComponent } from './display/fullscreen/fullscreen.component';
import { LogoutComponent } from './logout/logout.component';
import { RegisterComponent } from './register/register.component';
import { ResultsComponent } from './results/results.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([...HomeRoutes]),
    SharedModule
  ],
  declarations: [
    HomeComponent,
    LoginComponent,
    ListComponent,
    ScoreGroupComponent,
    ScoreComponent,
    ScoreboardComponent,

    DisplayComponent,
    FullscreenComponent,
    LogoutComponent,
    RegisterComponent,
    ResultsComponent
  ]
})
export class HomeModule { }
