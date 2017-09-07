import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';

import { AppModule } from 'app/app.module';
import { ClubModule } from './club.module';
import { ClubComponent } from './club.component';

import { ClubService, UserService } from 'app/services/api';
import { ClubServiceStub } from 'app/services/api/club/club.service.stub';
import { UserServiceStub } from 'app/services/api/user/user.service.stub';

describe('views.configure.club:ClubComponent', () => {
  let component: ClubComponent;
  let fixture: ComponentFixture<ClubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        ClubModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: ClubService, useClass: ClubServiceStub },
        { provide: UserService, useClass: UserServiceStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
