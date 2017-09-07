import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppModule } from 'app/app.module';
import { ConfigureModule } from '../configure.module';
import { UsersComponent } from './users.component';

import { UserService } from 'app/services/api';
import { UserServiceStub } from 'app/services/api/user/user.service.stub';

describe('views.configure.users:UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        ConfigureModule,
        RouterTestingModule,
      ],
      providers: [
        {provide: UserService, useClass: UserServiceStub},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
