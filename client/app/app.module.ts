import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';

// Modules
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';

// Services
import {
  UserService,
  ScoreService,
  ScoreGroupService,
  TournamentService,
  DisciplineService,
  DivisionService,
  TeamsService,
  ConfigurationService,
  ScheduleService,
  EventService
} from './api';
// import { RoleService } from './api';

// Components
import { AppComponent } from './app.component';
import { AuthHttp } from 'app/api/config/AuthHttp';

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
    ScoreGroupService,
    TournamentService,
    DisciplineService,
    DivisionService,
    TeamsService,
    ConfigurationService,
    ScheduleService,
    EventService,
    { provide: Http, useClass: AuthHttp }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
