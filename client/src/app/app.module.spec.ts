// Framework & libs
import { NgModule, Injectable } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { Angulartics2Module, Angulartics2 } from 'angulartics2';
import { MarkdownToHtmlModule } from 'markdown-to-html-pipe';
import { MatCardModule, MatSnackBarModule, MatDialogModule, MatFormFieldModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Module dependencies
import { SharedModule } from './shared/shared.module';
import { HttpLoaderFactory } from './app.module';

// Module API services
import {
  UserService,
  ConfigurationService,
  EventService,
  DisplayService
} from './services/api';
import { ErrorHandlerService } from './services/http/ErrorHandler.service';
import { MediaService } from './services/media.service';
import { HttpStateService } from 'app/services/http/http-state.service';

// Other services
import { RoleGuard } from './shared/guards/role-guard';
import { AuthInterceptor } from 'app/services/http/auth/auth.interceptor';
import { RouterTestingModule } from '@angular/router/testing';
import { UserServiceStub } from 'app/services/api/user/user.service.stub';
import { DisplayServiceStub } from 'app/services/api/display/display.service.stub';
import { ConfigurationServiceStub } from 'app/services/api/configuration/configuration.service.stub';
import { EventServiceStub } from 'app/services/api/event/event.service.stub';

@Injectable()
export class DummyProvider {
  eventSpy: any;
  constructor(angulartics2: Angulartics2) {
    this.eventSpy = jasmine.createSpy('eventSpy');
    angulartics2.pageTrack.subscribe((x) => this.eventSpy(x));
  }
}

@NgModule({
  imports: [
    // Framework modules
    HttpClientTestingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    TranslateModule
  ]
})
export class TranslateModuleTest { }

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
    TranslateModuleTest,
    MarkdownToHtmlModule,
    Angulartics2Module.forRoot(),

    MatSnackBarModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,

    // Application modules
    SharedModule,
    RouterTestingModule,
  ],
  exports: [
    HttpClientTestingModule,
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
    { provide: ConfigurationService, useClass: ConfigurationServiceStub },
    { provide: EventService, useClass: EventServiceStub },
    { provide: DisplayService, useClass: DisplayServiceStub },
    { provide: UserService, useClass: UserServiceStub },

    // Activation guards
    RoleGuard,

    // Authentication interceptor
    HttpStateService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
})
export class AppModuleTest { }
