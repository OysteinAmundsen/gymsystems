// Framework & libs
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';
import { MarkdownToHtmlModule } from 'markdown-to-html-pipe';
import { AgmCoreModule } from '@agm/core';

// Module dependencies
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';

// Module API services
import {
  UserService, ScoreService, ScoreGroupService, TournamentService, DisciplineService, DivisionService,
  TeamsService, ConfigurationService, ScheduleService, EventService, DisplayService, ClubService, VenueService
} from './services/api';
import { ErrorHandlerService } from './services/config/ErrorHandler.service';
import { MediaService } from './services/media.service';

// Other services
import { RoleGuard } from './shared/guards/role-guard';
import { AuthInterceptor } from './services/config/AuthInterceptor';
import { AuthStateService } from 'app/services/config/auth-state.service';

// Module components
import { AppComponent } from './app.component';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/home/login/login.component';
import { LogoutComponent } from './views/home/logout/logout.component';
import { RegisterComponent } from './views/home/register/register.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    LogoutComponent,
    RegisterComponent
  ],
  imports: [
    // Framework modules
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MarkdownToHtmlModule,
    Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics ]),
    AgmCoreModule.forRoot({ apiKey: VenueService.apiKey }),

    // Application modules
    SharedModule,

    // Routes last (!important)
    AppRoutingModule,
  ],
  exports: [
    TranslateModule,
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
    DisplayService,
    ClubService,
    MediaService,
    VenueService,

    ErrorHandlerService,

    // SSE Provider
    EventService,

    // Activation guards
    RoleGuard,

    // Authentication interceptor
    AuthStateService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
