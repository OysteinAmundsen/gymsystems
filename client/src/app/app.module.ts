import { HttpCacheInterceptor } from './shared/interceptors/http-cache.interceptor';
// Framework & libs
import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule, LOCALE_ID, Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { JwtModule } from '@auth0/angular-jwt';

import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Angulartics2Module } from 'angulartics2';
import { MarkdownToHtmlModule } from 'markdown-to-html-pipe';
import { AgmCoreModule } from '@agm/core';
import {
  MatCardModule, MatSnackBarModule, MatInputModule, MatFormFieldModule, MatAutocompleteModule,
  MatOptionModule, MatSlideToggleModule, MatButtonModule, MatDialogModule, MatListModule
} from '@angular/material';

import { environment } from '../environments/environment';

// Locale
import { registerLocaleData } from '@angular/common';
import localeNo from '@angular/common/locales/nb';
registerLocaleData(localeNo);

// Module dependencies
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';

// Other services
import { AuthInterceptor } from './shared/interceptors';

// Module components
import { AppComponent } from './app.component';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/home/login/login.component';
import { LogoutComponent } from './views/home/logout/logout.component';
import { RegisterComponent } from './views/home/register/register.component';
import { IUser } from './model/IUser';
import { GraphQLModule } from './graphql.module';
import { BrowserService } from './shared/browser.service';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './i18n/', '.json');
}

export function tokenGetter() {
  const currentUser: IUser = JSON.parse(BrowserService.sessionStorage().getItem('currentUser'));
  return currentUser ? currentUser.token : null;
}

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
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
    BrowserModule.withServerTransition({ appId: 'gymsystems' }),
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    TranslateModule.forRoot({
      loader: { provide: TranslateLoader, useFactory: HttpLoaderFactory, deps: [HttpClient] }
    }),
    MarkdownToHtmlModule,
    Angulartics2Module.forRoot({
      pageTracking: {
        clearIds: true,
        clearQueryParams: true
      }
    }),
    AgmCoreModule.forRoot({ apiKey: environment.geoApiKey }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        skipWhenExpired: true,
        whitelistedDomains: ['localhost', 'gymsystems.org']
      }
    }),

    // Material imports
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

    GraphQLModule
  ],
  providers: [
    // Authentication interceptor
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpCacheInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'nb-NO' },
    { // hammer instantion with custom config
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
