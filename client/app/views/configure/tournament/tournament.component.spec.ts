import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, Http } from '@angular/http';
// import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app/app.module';

import { SharedModule } from 'app/shared/shared.module';
import { TournamentComponent } from './tournament.component';
import { TournamentEditorComponent } from './tournament-editor/tournament-editor.component';
import { TournamentService, UserService } from 'app/services/api';
import { TournamentServiceStub } from 'app/services/api/tournament/tournament.service.stub';
import { UserServiceStub } from 'app/services/api/user/user.service.stub';

describe('TournamentComponent', () => {
  let component: TournamentComponent;
  let fixture: ComponentFixture<TournamentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        SharedModule,
        RouterTestingModule,
        // HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [Http]
          }
        }),
      ],
      declarations: [
        TournamentComponent,
        TournamentEditorComponent
      ],
      providers: [
        {provide: TournamentService, useClass: TournamentServiceStub},
        {provide: UserService, useClass: UserServiceStub},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
