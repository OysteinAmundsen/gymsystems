import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppModule } from 'app/app.module';
import { ConfigureModule } from './configure.module';

import { ConfigureComponent } from './configure.component';

import { UserService } from 'app/services/api';
import { UserServiceStub } from 'app/services/api/user/user.service.stub';

describe('views.configure:ConfigureComponent', () => {

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

  it('should create', () => {
    const fixture = TestBed.createComponent(ConfigureComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
