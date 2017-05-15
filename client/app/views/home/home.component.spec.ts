/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app';
import { MarkdownToHtmlModule } from 'markdown-to-html-pipe';

import { SharedModule } from 'app/shared/shared.module';
import { HomeComponent } from './home.component';
import { ScheduleService, UserService, TournamentService } from 'app/services/api';
import { ScheduleServiceStub } from 'app/services/api/schedule.service.stub';
import { UserServiceStub } from 'app/services/api/user.service.stub';
import { TournamentServiceStub } from 'app/services/api/tournament.service.stub';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        RouterTestingModule,
        HttpModule,
        MarkdownToHtmlModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [Http]
          }
        }),
      ],
      declarations: [ HomeComponent ],
      providers: [
        {provide: TournamentService, useClass: TournamentServiceStub},
        {provide: UserService, useClass: UserServiceStub},
        {provide: ScheduleService, useClass: ScheduleServiceStub},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
