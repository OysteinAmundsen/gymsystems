/*
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app/app.module';

import { SharedModule } from 'app/shared/shared.module';

import { SignoffReportComponent } from './signoff-report.component';
import { EventComponent } from 'app/views/event/event.component';

import { ScheduleService, TeamsService, ScoreService, ConfigurationService } from 'app/services/api';

import { DummyParent } from 'app/views/event/list/list.component.spec';
import { ScheduleServiceStub } from 'app/services/api/schedule/schedule.service.stub';
import { TeamsServiceStub } from 'app/services/api/teams/teams.service.stub';
import { ScoreServiceStub } from 'app/services/api/score/score.service.stub';
import { ConfigurationServiceStub } from 'app/services/api/configuration/configuration.service.stub';

describe('SignoffReportComponent', () => {
  let component: SignoffReportComponent;
  let fixture: ComponentFixture<SignoffReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpModule,
        SharedModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
      ],
      declarations: [ SignoffReportComponent ],
      providers: [
        {provide: EventComponent, useClass: DummyParent},
        {provide: ScheduleService, useClass: ScheduleServiceStub},
        {provide: ConfigurationService, useClass: ConfigurationServiceStub},
        {provide: TeamsService, useClass: TeamsServiceStub},
        {provide: ScoreService, useClass: ScoreServiceStub},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignoffReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
*/
