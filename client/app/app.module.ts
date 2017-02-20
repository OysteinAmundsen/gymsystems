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
import { RoleService, UserService, TournamentService, DisciplineService, ScoreService, TeamsService } from './api';

// Components
import { AppComponent } from './app.component';

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
