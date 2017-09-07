import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppModule } from 'app/app.module';
import { ConfigureModule } from '../../configure.module';

import { UserEditorComponent } from './user-editor.component';

import { ErrorHandlerService } from 'app/services/config';
import { UserService, ClubService } from 'app/services/api';
import { UserServiceStub } from 'app/services/api/user/user.service.stub';
import { ClubServiceStub } from 'app/services/api/club/club.service.stub';

describe('views.configure.users:UserEditorComponent', () => {
  let component: UserEditorComponent;
  let fixture: ComponentFixture<UserEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        ConfigureModule,
        RouterTestingModule,
      ],
      providers: [
        ErrorHandlerService,
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

