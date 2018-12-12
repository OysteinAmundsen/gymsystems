import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppModuleTest } from 'app/app.module.spec';
import { ClubModule } from 'app/views/configure/club/club.module';
import { TroopEditorComponent } from './troop-editor.component';
import { TroopsComponent } from '../troops.component';
import { ClubEditorComponent } from '../../club-editor/club-editor.component';

import { ClubService, UserService, ConfigurationService } from 'app/services/api';

import { ClubServiceStub } from 'app/services/api/club/club.service.stub';
import { UserServiceStub } from 'app/services/api/user/user.service.stub';
import { ConfigurationServiceStub } from 'app/services/api/configuration/configuration.service.stub';

describe('views.configure.club:TroopEditorComponent', () => {
  let component: TroopEditorComponent;
  let fixture: ComponentFixture<TroopEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModuleTest,
        ClubModule,
        RouterTestingModule,
      ],
      providers: [
        ClubEditorComponent,
        TroopsComponent,
        { provide: ClubService, useClass: ClubServiceStub },
        { provide: ConfigurationService, useClass: ConfigurationServiceStub },
        { provide: UserService, useClass: UserServiceStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TroopEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
