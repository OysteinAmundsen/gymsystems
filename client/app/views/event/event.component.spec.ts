import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule, Http } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app/app.module';
import { RouterTestingModule } from '@angular/router/testing';

import { EventComponent } from './event.component';
import { SharedModule } from 'app/shared/shared.module';
import { TournamentService, UserService } from 'app/services/api';
import { TournamentServiceStub } from 'app/services/api/tournament.service.stub';
import { UserServiceStub } from 'app/services/api/user.service.stub';

describe('EventComponent', () => {
  let component: EventComponent;
  let fixture: ComponentFixture<EventComponent>;

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
      declarations: [ EventComponent ],
      providers: [
        {provide: TournamentService, useClass: TournamentServiceStub},
        {provide: UserService, useClass: UserServiceStub},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
