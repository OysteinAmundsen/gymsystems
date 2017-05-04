import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';

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
  EventService,
  DisplayService,
  ClubService
} from './services/api';
// import { RoleService } from './api';

// Components
import { AppComponent } from './app.component';
import { AuthHttp } from './services/config/AuthHttp';
import { RoleAdminGuard, RoleOrganizerGuard, RoleClubGuard, RoleSecretariatGuard, RoleUserGuard } from './shared/guards/role-guards';
import { ErrorHandlerService } from "app/services/config/ErrorHandler.service";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: Http) {
    return new TranslateHttpLoader(http, './i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    }),
    Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics ]),

    AppRoutingModule,
    SharedModule
  ],
  exports: [ TranslateModule ],
  providers: [
    // API Services
    ErrorHandlerService,
    UserService,
    ScoreService,
    ScoreGroupService,
    TournamentService,
    DisciplineService,
    DivisionService,
    TeamsService,
    ConfigurationService,
    ScheduleService,
    DisplayService,
    ClubService,

    // SSE Provider
    EventService,

    // Activation guards
    RoleAdminGuard,
    RoleOrganizerGuard,
    RoleSecretariatGuard,
    RoleClubGuard,
    RoleUserGuard,

    // Authentication interceptor
    { provide: Http, useClass: AuthHttp }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
