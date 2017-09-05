import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppModule } from 'app/app.module';
import { LogoutComponent } from './logout.component';

import { ErrorHandlerService } from 'app/services/config';
import { UserService } from 'app/services/api';
import { UserServiceStub } from 'app/services/api/user/user.service.stub';

describe('views.home:LogoutComponent', () => {
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        RouterTestingModule,
      ],
      providers: [
        {provide: UserService, useClass: UserServiceStub},
        ErrorHandlerService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
