import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppModuleTest } from 'app/app.module.spec';
import { TournamentModule } from '../tournament.module';
import { TournamentEditorComponent } from './tournament-editor.component';

import { ErrorHandlerService } from 'app/services/http';

import { UserService, TournamentService, ClubService } from 'app/services/api';
import { TournamentServiceStub } from 'app/services/api/tournament/tournament.service.stub';
import { UserServiceStub } from 'app/services/api/user/user.service.stub';
import { ClubServiceStub } from 'app/services/api/club/club.service.stub';

describe('views.configure.tournament:TournamentEditorComponent', () => {
  let component: TournamentEditorComponent;
  let fixture: ComponentFixture<TournamentEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModuleTest,
        TournamentModule,
        RouterTestingModule,
      ],
      providers: [
        ErrorHandlerService,
        { provide: ClubService, useClass: ClubServiceStub },
        { provide: UserService, useClass: UserServiceStub },
        { provide: TournamentService, useClass: TournamentServiceStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
