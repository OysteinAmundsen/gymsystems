// Framework & libs
import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { MarkdownToHtmlModule } from 'markdown-to-html-pipe';
import { AgmCoreModule } from '@agm/core';
import {
  MatCardModule, MatSnackBarModule, MatInputModule, MatFormFieldModule, MatAutocompleteModule,
  MatOptionModule, MatSlideToggleModule, MatButtonModule, MatDialogModule, MatListModule
} from '@angular/material';
import 'hammerjs';
import 'hammer-timejs';

import { environment } from 'environments/environment';

// Locale
import { registerLocaleData } from '@angular/common';
import localeNo from '@angular/common/locales/nb';
registerLocaleData(localeNo);

// Module dependencies
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';

// Module API services
import {
  UserService, ScoreService, ScoreGroupService, TournamentService, DisciplineService, DivisionService,
  TeamsService, ConfigurationService, ScheduleService, EventService, DisplayService, ClubService, VenueService, JudgeService
} from './services/api';
import { ErrorHandlerService } from './services/config/ErrorHandler.service';
import { MediaService } from './services/media.service';

// Other services
import { RoleGuard } from './shared/guards/role-guard';
import { AuthInterceptor, TimeoutInterceptor, DEFAULT_TIMEOUT, defaultTimeout } from './services/config';
import { AuthStateService } from './services/config/auth-state.service';

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

export class MyHammerConfig extends HammerGestureConfig  {
  buildHammer(element: HTMLElement) {
    const mc = new Hammer(element, {
      touchAction: 'auto',
    });
    return mc;
  }
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
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production}),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MarkdownToHtmlModule,
    Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics ], { developerMode: !environment.production }),
    AgmCoreModule.forRoot({ apiKey: VenueService.apiKey }),

    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatCardModule,
    MatSnackBarModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatDialogModule,

    // Application modules
    SharedModule,

    // Routes last (!important)
    AppRoutingModule,
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
    JudgeService,

    ErrorHandlerService,

    // SSE Provider
    EventService,

    // Activation guards
    RoleGuard,

    // Authentication interceptor
    AuthStateService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true },
    { provide: DEFAULT_TIMEOUT, useValue: defaultTimeout },
    { provide: LOCALE_ID, useValue: 'nb-NO' },
    { // hammer instantion with custom config
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
