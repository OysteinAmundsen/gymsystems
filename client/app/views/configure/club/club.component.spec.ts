import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpModule, Http } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app/app.module';
import { SharedModule } from 'app/shared/shared.module';

import { ClubComponent } from './club.component';
import { ClubService, UserService } from 'app/services/api';
import { ClubServiceStub } from 'app/services/api/club.service.stub';
import { UserServiceStub } from 'app/services/api/user.service.stub';

describe('ClubComponent', () => {
  let component: ClubComponent;
  let fixture: ComponentFixture<ClubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        HttpModule,
        FormsModule,
        RouterTestingModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
      ],
      declarations: [ ClubComponent ],
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
