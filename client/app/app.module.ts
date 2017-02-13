import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// Modules
import { SharedModule } from './shared/shared.module';
import { HomeModule } from './views/home/home.module';
import { AddScoreModule } from './views/add-score/add-score.module';
import { ConfigureModule } from './views/configure/configure.module';
import { AppRoutingModule } from './app-routing.module';

// Services
import { RoleService } from './api/role.service';
import { UserService } from './api/user.service';
import { TournamentService } from './api/tournament.service';
import { DisciplineService } from 'app/api/discipline.service';
import { ScoreService } from './api/score.service';

// Components
import { AppComponent } from './app.component';
import { TeamsService } from 'app/api/teams.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,

    SharedModule,
    HomeModule,
    AddScoreModule,
    ConfigureModule,
    AppRoutingModule
  ],
  providers: [ScoreService, TournamentService, TeamsService, DisciplineService, ScoreService, UserService, RoleService],
  bootstrap: [AppComponent]
})
export class AppModule { }
