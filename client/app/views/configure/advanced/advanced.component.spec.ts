/* tslint:disable:no-unused-variable */
/*
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app';

import { AdvancedComponent } from './advanced.component';
import { SharedModule } from 'app/shared/shared.module';
import { DisciplinesModule } from 'app/views/configure/tournament/disciplines/disciplines.module';
import { DivisionsModule } from 'app/views/configure/tournament/divisions/divisions.module';

import { ConfigurationService, TournamentService, DivisionService } from 'app/services/api';
import { ConfigurationServiceStub } from 'app/services/api/configuration.service.stub';
import { TournamentServiceStub } from 'app/services/api/tournament.service.stub';
import { DivisionServiceStub } from 'app/services/api/division.service.stub';

describe('AdvancedComponent', () => {
  let component: AdvancedComponent;
  let fixture: ComponentFixture<AdvancedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        SharedModule,
        HttpModule,
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [Http]
          }
        }),
        DisciplinesModule,
        DivisionsModule
      ],
      declarations: [
        AdvancedComponent
      ],
      providers: [
        {provide: ConfigurationService, useClass: ConfigurationServiceStub},
        {provide: TournamentService, useClass: TournamentServiceStub},
        {provide: DivisionService, useClass: DivisionServiceStub}
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
*/
