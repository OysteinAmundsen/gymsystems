import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

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
} from './services/api';
// import { RoleService } from './api';

// Components
import { AppComponent } from './app.component';
import { AuthHttp } from './services/config/AuthHttp';
import { RoleAdminGuard } from './shared/guards/role-guards';
import { RoleClubGuard, RoleSecretariatGuard, RoleUserGuard } from './shared/guards/role-guards';

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

    AppRoutingModule,
    SharedModule
  ],
  exports: [ TranslateModule ],
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
