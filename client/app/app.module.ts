import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';

// Modules
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { HomeModule } from './views/home/home.module';
import { ConfigureModule } from './views/configure/configure.module';
import { EventModule } from "./views/event/event.module";

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

// Components
import { AppComponent } from './app.component';
import { HttpInterceptor } from './services/config/HttpInterceptor';
import { RoleGuard } from './shared/guards/role-guard';
import { ErrorHandlerService } from 'app/services/config/ErrorHandler.service';
import { MediaService } from 'app/services/media.service';

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

    // Packaged modules (Not lazy loaded)
    SharedModule,
    HomeModule,
    EventModule,
    ConfigureModule,

    // Routes last (!important)
    AppRoutingModule,
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
    MediaService,

    // SSE Provider
    EventService,

    // Activation guards
    RoleGuard,

    // Authentication interceptor
    { provide: Http, useClass: HttpInterceptor }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
