/* tslint:disable:no-unused-variable */

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2/dist';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app';

import { UserServiceStub } from 'app/services/api/user.service.stub';
import { TournamentServiceStub } from 'app/services/api/tournament.service.stub';
import { ErrorHandlerService } from 'app/services/config/ErrorHandler.service';
import { TournamentService, UserService } from 'app/services/api';

import { AppComponent } from './app.component';
import { SharedModule } from 'app/shared/shared.module';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpModule,
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [Http]
          }
        }),
        Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics ]),
        SharedModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        {provide: UserService, useClass: UserServiceStub },
        {provide: TournamentService, useClass: TournamentServiceStub },
        ErrorHandlerService,
      ]
    });
    TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
