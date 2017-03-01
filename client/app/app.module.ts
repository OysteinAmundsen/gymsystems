import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// Modules
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';

// Services
import {
  UserService,
  ScoreService,
  TournamentService,
  DisciplineService,
  DivisionService,
  TeamsService,
  ConfigurationService,
  ScheduleService
} from './api';
// import { RoleService } from './api';

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

    AppRoutingModule,
    SharedModule
  ],
  providers: [
    UserService,
    ScoreService,
    TournamentService,
    DisciplineService,
    DivisionService,
    TeamsService,
    ConfigurationService,
    ScheduleService
  ],
  // providers: [RoleService],
  bootstrap: [AppComponent]
})
export class AppModule { }
