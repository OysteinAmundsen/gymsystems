import { Component, ViewChild } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MatDialogModule } from '@angular/material';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga/angulartics2-ga';

import { MockIfAuthDirective } from 'app/shared/directives/auth/if-auth.directive.spec';
import { Angulartics2Module } from 'angulartics2';

import { TranslateModuleTest, DummyProvider } from 'app/app.module.spec';
import { TestContext, initContext } from 'src/testing/test-context.spec';
import { AppComponent } from 'app/app.component';

@Component({ template: `<app-root></app-root>` })
class TestComponent { }

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
      ServiceWorkerModule.register('/ngsw-worker.js', { enabled: false }),
      MatDialogModule,
      NoopAnimationsModule
    ],
    providers: [
      { provide: Angulartics2GoogleAnalytics, useClass: DummyProvider }
    ]
  });

  it('should create the app', function (this: Context) {
    expect(this.testedDirective).toBeTruthy();
  });

  describe('language', function () {
    let originalTimeout;
    beforeEach(function () {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 90000;
    });
    afterEach(function () {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('can change', async function (this: Context) {
      await this.testedDirective.changeLang('no').toPromise();
      this.detectChanges();
      expect(this.testedDirective.currentLang).toBe('no');
    });

    it('can reset', async function (this: Context) {
      await this.testedDirective.changeLang('en').toPromise();
      this.detectChanges();
      expect(this.testedDirective.currentLang).toBe('en');
    });
  });
});
