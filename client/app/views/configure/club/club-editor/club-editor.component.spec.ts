import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpModule, Http } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app/app.module';
import { SharedModule } from 'app/shared/shared.module';

import { ClubEditorComponent } from './club-editor.component';
import { ClubService, UserService } from 'app/services/api';

import { ClubServiceStub } from 'app/services/api/club.service.stub';
import { UserServiceStub } from 'app/services/api/user.service.stub';
import { ErrorHandlerService } from 'app/services/config/ErrorHandler.service';
import { HttpInterceptor } from 'app/services/config/HttpInterceptor';

describe('ClubEditorComponent', () => {
  let component: ClubEditorComponent;
  let fixture: ComponentFixture<ClubEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [Http]
          }
        }),
      ],
      declarations: [ ClubEditorComponent ],
      providers: [
        ErrorHandlerService,
        { provide: Http, useClass: HttpInterceptor },
        { provide: ClubService, useClass: ClubServiceStub },
        { provide: UserService, useClass: UserServiceStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});