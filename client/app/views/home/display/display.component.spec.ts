/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app';

import { SharedModule } from 'app/shared/shared.module';
import { DisplayComponent } from './display.component';
import { ConfigurationService, ScheduleService, TournamentService, DisplayService, EventService, UserService } from 'app/services/api';
import { EventServiceStub } from 'app/services/api/event.service.stub';
import { DisplayServiceStub } from 'app/services/api/display.service.stub';
import { TournamentServiceStub } from 'app/services/api/tournament.service.stub';
import { ScheduleServiceStub } from 'app/services/api/schedule.service.stub';
import { ConfigurationServiceStub } from 'app/services/api/configuration.service.stub';
import { UserServiceStub } from 'app/services/api/user.service.stub';

describe('DisplayComponent', () => {
  let component: DisplayComponent;
  let fixture: ComponentFixture<DisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        RouterTestingModule,
        HttpModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [Http]
          }
        }),
      ],
      declarations: [ DisplayComponent ],
      providers: [
        {provide: UserService, useClass: UserServiceStub},
        {provide: ConfigurationService, useClass: ConfigurationServiceStub},
        {provide: ScheduleService, useClass: ScheduleServiceStub},
        {provide: TournamentService, useClass: TournamentServiceStub},
        {provide: DisplayService, useClass: DisplayServiceStub},
        {provide: EventService, useClass: EventServiceStub},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
