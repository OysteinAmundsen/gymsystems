import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ConfigureComponent } from './configure.component';
import { SharedModule } from 'app/shared/shared.module';
import { UserService } from 'app/services/api';
import { HttpModule } from '@angular/http';
import { UserServiceStub } from 'app/services/api/user.service.stub';

describe('ConfigureComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        SharedModule,
        HttpModule,
      ],
      declarations: [ ConfigureComponent ],
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
