/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule, Http } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app/app.module';

import { SharedModule } from 'app/shared/shared.module';
import { DisciplinesModule } from '../tournament/disciplines/disciplines.module';
import { DivisionsModule } from '../tournament/divisions/divisions.module';
import { ScoreSystemModule } from '../tournament/score-system/score-system.module';

import { AdvancedComponent } from './advanced.component';

import { ConfigurationService, TournamentService, DivisionService } from 'app/services/api';
import { ConfigurationServiceStub } from 'app/services/api/configuration.service.stub';
import { TournamentServiceStub } from 'app/services/api/tournament.service.stub';
import { DivisionServiceStub } from 'app/services/api/division.service.stub';
import { HttpInterceptor } from 'app/services/config/HttpInterceptor';
import { ErrorHandlerService } from 'app/services/config/ErrorHandler.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';

describe('AdvancedComponent', () => {
  let component: AdvancedComponent;
  let fixture: ComponentFixture<AdvancedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        HttpModule,
        FormsModule,
        RouterTestingModule,
        ScoreSystemModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        DisciplinesModule,
        DivisionsModule
      ],
      declarations: [
        AdvancedComponent,
      ],
      providers: [
        ErrorHandlerService,
        { provide: Http, useClass: HttpInterceptor },
        { provide: ConfigurationService, useClass: ConfigurationServiceStub },
        { provide: TournamentService, useClass: TournamentServiceStub },
        { provide: DivisionService, useClass: DivisionServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
