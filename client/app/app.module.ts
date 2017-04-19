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
import { RoleAdminGuard } from "app/shared/guards/role-guards";
import { RoleClubGuard, RoleSecretariatGuard, RoleUserGuard } from "app/shared/guards/role-guards";

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
    // API Services
    UserService,
    ScoreService,
    ScoreGroupService,
    TournamentService,
    DisciplineService,
    DivisionService,
    TeamsService,
    ConfigurationService,
    ScheduleService,

    // SSE Provider
    EventService,

    // Activation guards
    RoleAdminGuard,
    RoleSecretariatGuard,
    RoleClubGuard,
    RoleUserGuard,

    // Authentication interceptor
    { provide: Http, useClass: AuthHttp }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
