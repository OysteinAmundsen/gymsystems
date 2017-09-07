import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppModule } from 'app/app.module';
import { ClubModule } from '../club.module';
import { TroopsComponent } from './troops.component';
import { ClubEditorComponent } from '../club-editor/club-editor.component';

import { UserService, ClubService, ConfigurationService } from 'app/services/api';

import { UserServiceStub } from 'app/services/api/user/user.service.stub';
import { ClubServiceStub } from 'app/services/api/club/club.service.stub';
import { ConfigurationServiceStub } from 'app/services/api/configuration/configuration.service.stub';

describe('views.configure.club:TroopsComponent', () => {
  let component: TroopsComponent;
  let fixture: ComponentFixture<TroopsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        ClubModule,
        RouterTestingModule,
      ],
      providers: [
        ClubEditorComponent,
        { provide: ConfigurationService, useClass: ConfigurationServiceStub },
        { provide: UserService, useClass: UserServiceStub },
        { provide: ClubService, useClass: ClubServiceStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TroopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
