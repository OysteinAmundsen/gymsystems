// Framework & libs
import { NgModule } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';
import { MarkdownToHtmlModule } from 'markdown-to-html-pipe';
import { AgmCoreModule } from '@agm/core';

// Module dependencies
import { SharedModule } from './shared/shared.module';
import { HttpLoaderFactory } from './app.module';

// Module API services
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
  ClubService,
  VenueService
} from './services/api';
import { ErrorHandlerService } from './services/config/ErrorHandler.service';
import { MediaService } from './services/media.service';
import { AuthStateService } from 'app/services/config/auth-state.service';

// Other services
import { RoleGuard } from './shared/guards/role-guard';
import { AuthInterceptor } from './services/config/AuthInterceptor';
import { RouterTestingModule } from '@angular/router/testing';
import { UserServiceStub } from 'app/services/api/user/user.service.stub';
import { TournamentServiceStub } from 'app/services/api/tournament/tournament.service.stub';
import { VenueServiceStub } from 'app/services/api/venue/venue.service.stub';
import { ClubServiceStub } from 'app/services/api/club/club.service.stub';
import { DisplayServiceStub } from 'app/services/api/display/display.service.stub';
import { ScheduleServiceStub } from 'app/services/api/schedule/schedule.service.stub';
import { ConfigurationServiceStub } from 'app/services/api/configuration/configuration.service.stub';
import { TeamsServiceStub } from 'app/services/api/teams/teams.service.stub';
import { DivisionServiceStub } from 'app/services/api/division/division.service.stub';
import { DisciplineServiceStub } from 'app/services/api/discipline/discipline.service.stub';
import { ScoreGroupServiceStub } from 'app/services/api/scoregroup/scoregroup.service.stub';
import { ScoreServiceStub } from 'app/services/api/score/score.service.stub';
import { EventServiceStub } from 'app/services/api/event/event.service.stub';
import { MdCardModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/**
 * Reusable module for component testing.
 * This will setup most dependencies to alleviate
 * testbed module definition bloat.
 *
 * This should simulate the app module closely, without
 * all its declarations. It will also export some modules
 * in order to make them available to the test
 */
@NgModule({
  imports: [
    // Framework modules
    FormsModule,
    ReactiveFormsModule,
    HttpClientTestingModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MarkdownToHtmlModule,
    Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics ]),
    // AgmCoreModule.forRoot({
    //   apiKey: VenueService.apiKey
    // }),

    // Application modules
    SharedModule,
    RouterTestingModule,
  ],
  exports: [
    HttpClientTestingModule,
    TranslateModule,
    RouterTestingModule,
    FormsModule,
    ReactiveFormsModule,
    Angulartics2Module,
    SharedModule,
  ],
  providers: [
    // API Services
    ErrorHandlerService,
    MediaService,
    { provide: ScoreService, useClass: ScoreServiceStub },
    { provide: ScoreGroupService, useClass: ScoreGroupServiceStub },
    { provide: DisciplineService, useClass: DisciplineServiceStub },
    { provide: DivisionService, useClass: DivisionServiceStub },
    { provide: TeamsService, useClass: TeamsServiceStub },
    { provide: ConfigurationService, useClass: ConfigurationServiceStub },
    { provide: ScheduleService, useClass: ScheduleServiceStub },
    { provide: EventService, useClass: EventServiceStub },
    { provide: DisplayService, useClass: DisplayServiceStub },
    { provide: ClubService, useClass: ClubServiceStub },
    { provide: VenueService, useClass: VenueServiceStub },
    { provide: UserService, useClass: UserServiceStub },
    { provide: TournamentService, useClass: TournamentServiceStub },

    // Activation guards
    RoleGuard,

    // Authentication interceptor
    AuthStateService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
})
export class AppModuleTest { }
