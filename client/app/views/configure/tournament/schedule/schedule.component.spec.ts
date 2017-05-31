import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app';
import { DragulaModule } from 'ng2-dragula';

import { ScheduleComponent } from './schedule.component';
import { SharedModule } from 'app/shared/shared.module';
import { ScheduleService, TournamentService, DivisionService, DisciplineService, TeamsService, ConfigurationService } from 'app/services/api';
import { TournamentServiceStub } from 'app/services/api/tournament.service.stub';
import { DivisionServiceStub } from 'app/services/api/division.service.stub';
import { DisciplineServiceStub } from 'app/services/api/discipline.service.stub';
import { TeamsServiceStub } from 'app/services/api/teams.service.stub';
import { ScheduleServiceStub } from 'app/services/api/schedule.service.stub';
import { ConfigurationServiceStub } from "app/services/api/configuration.service.stub";

describe('ScheduleComponent', () => {
  let component: ScheduleComponent;
  let fixture: ComponentFixture<ScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        DragulaModule,
        HttpModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [Http]
          }
        }),
      ],
      declarations: [ ScheduleComponent ],
      providers: [
        {provide: TournamentService, useClass: TournamentServiceStub},
        {provide: DivisionService, useClass: DivisionServiceStub},
        {provide: DisciplineService, useClass: DisciplineServiceStub},
        {provide: TeamsService, useClass: TeamsServiceStub},
        {provide: ScheduleService, useClass: ScheduleServiceStub},
        {provide: ConfigurationService, useClass: ConfigurationServiceStub},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
