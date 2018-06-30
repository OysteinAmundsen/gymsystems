import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ServiceWorkerModule } from '@angular/service-worker';

import { TournamentService, UserService } from './services/api';

import { UserServiceStub } from './services/api/user/user.service.stub';
import { TournamentServiceStub } from './services/api/tournament/tournament.service.stub';
import { ErrorHandlerService } from './services/http/ErrorHandler.service';

import { TestContext, initContext } from '../testing/test-context.spec';
import { AppComponent } from './app.component';
import { AppModuleTest, TranslateModuleTest, DummyProvider } from 'app/app.module.spec';
import { environment } from '../environments/environment';
import { Component } from '@angular/core';
import { MockIfAuthDirective } from 'app/shared/directives/auth/if-auth.directive.spec';
import { MatDialogModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Angulartics2Module } from 'angulartics2';


@Component({template: `<app-root></app-root>`})
class TestComponent {}

describe('views:AppComponent', () => {
  type Context = TestContext<AppComponent, TestComponent>;
  initContext(AppComponent, TestComponent, {
    declarations: [
      MockIfAuthDirective
    ],
    imports: [
      RouterTestingModule,
      TranslateModuleTest,
      Angulartics2Module.forRoot([DummyProvider]),
      ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production}),
      MatDialogModule,
      NoopAnimationsModule
    ],
    providers: [
      {provide: Angulartics2GoogleAnalytics, useClass: DummyProvider}
    ]
  });

  it('should create the app', function(this: Context) {
    expect(this.testedElement).toBeTruthy();
  });

  // it('can change language', function(this: Context) {
  //   this.testedElement.changeLang('en');
  //   expect(this.testedElement.translate.getCurrentLang()).toBe('en');
  // });
});
