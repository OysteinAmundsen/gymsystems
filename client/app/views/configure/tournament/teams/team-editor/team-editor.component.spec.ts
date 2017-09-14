/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/Rx';

import { AppModuleTest } from 'app/app.module.spec';
import { TournamentModule } from '../../tournament.module';
import { TeamsComponent } from '../teams.component';
import { TeamEditorComponent } from './team-editor.component';
import { TournamentEditorComponent } from '../../tournament-editor/tournament-editor.component';

import { ErrorHandlerService } from 'app/services/config/ErrorHandler.service';
import { ITeam, ITournament, IClub, IUser, Role, Classes } from 'app/model';
import {
  TeamsService, TournamentService, ClubService, UserService, DivisionService, DisciplineService, ConfigurationService
} from 'app/services/api';
import { MediaService } from 'app/services/media.service';

import { TeamsServiceStub } from 'app/services/api/teams/teams.service.stub';
import { TournamentServiceStub, dummyTournament } from 'app/services/api/tournament/tournament.service.stub';
import { ClubServiceStub } from 'app/services/api/club/club.service.stub';
import { UserServiceStub } from 'app/services/api/user/user.service.stub';
import { DivisionServiceStub } from 'app/services/api/division/division.service.stub';
import { DisciplineServiceStub } from 'app/services/api/discipline/discipline.service.stub';
import { ConfigurationServiceStub } from 'app/services/api/configuration/configuration.service.stub';

const club: IClub = <IClub>{
  id          : 0,
  name        : 'HAUGESUND TURNFORENING'
}
const user: IUser = <IUser>{
  id    : 0,
  name  : 'admin',
  email : 'admin@admin.no',
  role  : Role.Admin,
  club  : club
};
class DummyParent {
  tournamentSubject = new ReplaySubject<ITournament>(1);
  constructor() {
    this.tournamentSubject.next(dummyTournament);
  }
}
@Component({
 selector  : 'app-cmp',
 template  : `<app-team-editor [team]='selected'></app-team-editor>`
})
class WrapperComponent {
  selected: ITeam = <ITeam>{
    id: 0, class: Classes.TeamGym, name: 'Haugesund-1', divisions: [], disciplines: [], gymnasts: [], club: club, tournament: <ITournament>{
      id: 0, createdBy: user, club: user.club, name: 'Landsturnstevnet 2017', description_no: 'Test tekst', description_en: 'Test text',
      location: 'Haugesund', schedule: [], disciplines: [], divisions: []
    },
  }
}
describe('views.configure.tournament:TeamEditorComponent', () => {
  let component: TeamEditorComponent;
  let fixture: ComponentFixture<WrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModuleTest,
        TournamentModule,
        RouterTestingModule,
      ],
      declarations: [
        WrapperComponent
      ],
      providers: [
        MediaService,
        ErrorHandlerService,
        TeamsComponent,
        { provide: TournamentEditorComponent, useClass: DummyParent },
        { provide: ConfigurationService, useClass: ConfigurationServiceStub },
        { provide: TeamsService, useClass: TeamsServiceStub },
        { provide: TournamentService, useClass: TournamentServiceStub },
        { provide: ClubService, useClass: ClubServiceStub },
        { provide: UserService, useClass: UserServiceStub },
        { provide: DivisionService, useClass: DivisionServiceStub },
        { provide: DisciplineService, useClass: DisciplineServiceStub },
      ]
    })
    .overrideModule(TournamentModule, {
      set: {
        exports: [
          TeamEditorComponent
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperComponent);
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
