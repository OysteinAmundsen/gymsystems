/*
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule, Http } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app/app.module';
import { SharedModule } from 'app/shared/shared.module';

import { TroopEditorComponent } from './troop-editor.component';
import { ErrorHandlerService, HttpInterceptor } from 'app/services/config';
import { TournamentEditorComponent } from 'app/views/configure/tournament/tournament-editor/tournament-editor.component';
import { ClubService, UserService } from 'app/services/api';
import { ClubServiceStub } from 'app/services/api/club/club.service.stub';
import { UserServiceStub } from 'app/services/api/user/user.service.stub';
import { DragulaModule } from 'ng2-dragula';
import { ClubEditorComponent } from '../../club-editor/club-editor.component';
import { TroopsComponent } from '../troops.component';

describe('TroopEditorComponent', () => {
  let component: TroopEditorComponent;
  let fixture: ComponentFixture<TroopEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientModule,
        DragulaModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
      ],
      declarations: [
        TroopEditorComponent,
      ],
      providers: [
        ErrorHandlerService,
        ClubEditorComponent,
        TroopsComponent,
        { provide: Http, useClass: HttpInterceptor },
        { provide: ClubService, useClass: ClubServiceStub },
        { provide: UserService, useClass: UserServiceStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TroopEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
*/
