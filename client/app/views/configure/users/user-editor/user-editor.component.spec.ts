import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app';

import { SharedModule } from 'app/shared/shared.module';
import { UserEditorComponent } from './user-editor.component';
import { UserService, ClubService } from 'app/services/api';
import { Observable } from 'rxjs/Observable';
import { IUser, Role } from 'app/services/model/IUser';
import { IClub } from 'app/services/model/IClub';
import { UserServiceStub } from 'app/services/api/user.service.stub';
import { ClubServiceStub } from 'app/services/api/club.service.stub';
import { ErrorHandlerService } from 'app/services/config/ErrorHandler.service';
import { HttpInterceptor } from 'app/services/config/HttpInterceptor';

describe('UserEditorComponent', () => {
  let component: UserEditorComponent;
  let fixture: ComponentFixture<UserEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        HttpModule,
        FormsModule,
        RouterTestingModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [Http]
          }
        }),
      ],
      declarations: [ UserEditorComponent ],
      providers: [
        ErrorHandlerService,
        { provide: Http, useClass: HttpInterceptor },
        { provide: UserService, useClass: UserServiceStub },
        { provide: ClubService, useClass: ClubServiceStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

