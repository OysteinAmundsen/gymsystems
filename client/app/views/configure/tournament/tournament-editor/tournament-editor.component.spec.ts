import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app/app.module';
import { RouterTestingModule } from '@angular/router/testing';

import { TournamentEditorComponent } from './tournament-editor.component';
import { SharedModule } from 'app/shared/shared.module';
import { ErrorHandlerService, HttpInterceptor } from 'app/services/config';
import { UserService, TournamentService, ClubService } from 'app/services/api';
import { TournamentServiceStub } from 'app/services/api/tournament/tournament.service.stub';
import { UserServiceStub } from 'app/services/api/user/user.service.stub';
import { ClubServiceStub } from 'app/services/api/club/club.service.stub';

describe('TournamentEditorComponent', () => {
  let component: TournamentEditorComponent;
  let fixture: ComponentFixture<TournamentEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        SharedModule,
        RouterTestingModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
      ],
      declarations: [ TournamentEditorComponent ],
      providers: [
        ErrorHandlerService,
        { provide: Http, useClass: HttpInterceptor },
        { provide: ClubService, useClass: ClubServiceStub },
        { provide: UserService, useClass: UserServiceStub },
        { provide: TournamentService, useClass: TournamentServiceStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
