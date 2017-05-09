import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app';

import { SharedModule } from 'app/shared/shared.module';
import { ResultsComponent } from './results.component';
import { ScheduleService, TeamsService, TournamentService, EventService, UserService } from 'app/services/api';
import { UserServiceStub } from 'app/services/api/user.service.stub';
import { EventServiceStub } from 'app/services/api/event.service.stub';
import { TournamentServiceStub } from 'app/services/api/tournament.service.stub';
import { TeamsServiceStub } from 'app/services/api/teams.service.stub';
import { ScheduleServiceStub } from 'app/services/api/schedule.service.stub';

describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [Http]
          }
        }),
      ],
      declarations: [ ResultsComponent ],
      providers: [
        {provide: ScheduleService, useClass: ScheduleServiceStub},
        {provide: TeamsService, useClass: TeamsServiceStub},
        {provide: TournamentService, useClass: TournamentServiceStub},
        {provide: EventService, useClass: EventServiceStub},
        {provide: UserService, useClass: UserServiceStub},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
