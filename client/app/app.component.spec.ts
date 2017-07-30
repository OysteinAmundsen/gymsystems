import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2/dist';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from './app.module';

import { UserServiceStub } from './services/api/user.service.stub';
import { TournamentServiceStub } from './services/api/tournament.service.stub';
import { ErrorHandlerService } from './services/config/ErrorHandler.service';
import { TournamentService, UserService } from './services/api';

import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpModule,
        RouterTestingModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
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
    expect(component).toBeTruthy();
  }));
});
