import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppModule } from 'app/app.module';
import { RegisterComponent } from './register.component';

import { UserService, ClubService } from 'app/services/api';
import { ErrorHandlerService } from 'app/services/config';
import { ClubServiceStub } from 'app/services/api/club/club.service.stub';
import { UserServiceStub } from 'app/services/api/user/user.service.stub';

describe('views.home:RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        RouterTestingModule,
      ],
      providers: [
        {provide: UserService, useClass: UserServiceStub},
        {provide: ClubService, useClass: ClubServiceStub},
        ErrorHandlerService,

      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
