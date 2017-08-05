/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/Rx';

import { SharedModule } from 'app/shared/shared.module';
import { HttpLoaderFactory } from 'app/app.module';
import { HttpInterceptor } from 'app/services/config/HttpInterceptor';

import { TeamEditorComponent } from './team-editor.component';
import { TournamentEditorComponent } from '../../tournament-editor/tournament-editor.component';

import { ErrorHandlerService } from 'app/services/config/ErrorHandler.service';
import { TeamsService, TournamentService, ClubService, UserService, DivisionService, DisciplineService } from 'app/services/api';
import { MediaService } from 'app/services/media.service';
import { TeamsServiceStub } from 'app/services/api/teams/teams.service.stub';
import { TournamentServiceStub, dummyTournament } from 'app/services/api/tournament/tournament.service.stub';
import { ClubServiceStub } from 'app/services/api/club/club.service.stub';
import { UserServiceStub } from 'app/services/api/user/user.service.stub';
import { DivisionServiceStub } from 'app/services/api/division/division.service.stub';
import { DisciplineServiceStub } from 'app/services/api/discipline/discipline.service.stub';

import { ITeam, ITournament, IClub, IUser, Role } from 'app/services/model';

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
 template  : `<app-team-editor [team]='selected' (teamChanged)='onChange($event)'></app-team-editor>`
})
class WrapperComponent {
  selected: ITeam = <ITeam>{
    id: 0, name: 'Haugesund-1', divisions: [], disciplines: [], club: club, tournament: <ITournament>{
      id: 0, createdBy: user, name: 'Landsturnstevnet 2017', description_no: 'Test tekst', description_en: 'Test text',
      location: 'Haugesund', schedule: [], disciplines: [], divisions: []
    },
  }
}
describe('TeamEditorComponent', () => {
  let component: TeamEditorComponent;
  let fixture: ComponentFixture<WrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpModule,
        SharedModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
      ],
      declarations: [ WrapperComponent, TeamEditorComponent ],
      providers: [
        MediaService,
        ErrorHandlerService,
        { provide: Http, useClass: HttpInterceptor },
        { provide: TournamentEditorComponent, useClass: DummyParent },
        { provide: TeamsService, useClass: TeamsServiceStub },
        { provide: TournamentService, useClass: TournamentServiceStub },
        { provide: ClubService, useClass: ClubServiceStub },
        { provide: UserService, useClass: UserServiceStub },
        { provide: DivisionService, useClass: DivisionServiceStub },
        { provide: DisciplineService, useClass: DisciplineServiceStub },
      ]
    })
    .overrideComponent(TeamEditorComponent, {
      set: {
        providers: [
          { provide: UserService, useClass: class DataStub {
              public getMe(): Observable<IUser> {
                return Observable.of(user);
              }
            }
          },
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
