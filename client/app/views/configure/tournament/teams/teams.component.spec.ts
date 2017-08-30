/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import { HttpModule, Http } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app/app.module';

import { SharedModule } from 'app/shared/shared.module';

import { TeamsComponent } from './teams.component';
import { TeamEditorComponent } from './team-editor/team-editor.component';
import { TournamentEditorComponent } from '../tournament-editor/tournament-editor.component';

import { TournamentService, UserService, TeamsService } from 'app/services/api';
import { TeamsServiceStub } from 'app/services/api/teams/teams.service.stub';
import { UserServiceStub } from 'app/services/api/user/user.service.stub';
import { TournamentServiceStub, dummyTournament } from 'app/services/api/tournament/tournament.service.stub';

import { IClub, IUser, Role, ITournament } from 'app/services/model';

class DummyParent {
  tournamentSubject = new ReplaySubject<ITournament>(1);
  constructor() {
    this.tournamentSubject.next(dummyTournament);
  }
}
describe('views.configure.tournament:TeamsComponent', () => {
  let component: TeamsComponent;
  let fixture: ComponentFixture<TeamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        SharedModule,
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
      declarations: [
        TeamsComponent,
        TeamEditorComponent
      ],
      providers: [
        {provide: TournamentEditorComponent, useClass: DummyParent},
        {provide: TeamsService, useClass: TeamsServiceStub},
        {provide: UserService, useClass: UserServiceStub}
      ]
    })
    .overrideComponent(TeamsComponent, {
      set: {
        providers: [
          { provide: UserService, useClass: class DataStub {
              public getMe(): Observable<IUser> {
                return Observable.of(<IUser>{
                  id: 0, name: '', email: '', role: Role.Admin, club: <IClub>{ id: 0, name: '' }
                });
              }
            }
          },
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
