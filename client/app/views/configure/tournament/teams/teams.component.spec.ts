/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, ReplaySubject } from 'rxjs/Rx';

import { AppModule } from 'app/app.module';
import { TournamentModule } from '../tournament.module';
import { TeamsComponent } from './teams.component';
import { TournamentEditorComponent } from '../tournament-editor/tournament-editor.component';

import { TournamentService, UserService, TeamsService } from 'app/services/api';
import { IClub, IUser, Role, ITournament } from 'app/services/model';

import { TeamsServiceStub } from 'app/services/api/teams/teams.service.stub';
import { UserServiceStub } from 'app/services/api/user/user.service.stub';
import { TournamentServiceStub, dummyTournament } from 'app/services/api/tournament/tournament.service.stub';


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
        AppModule,
        TournamentModule,
        RouterTestingModule,
      ],
      providers: [
        {provide: TournamentEditorComponent, useClass: DummyParent},
        {provide: TeamsService, useClass: TeamsServiceStub},
        {provide: UserService, useClass: UserServiceStub}
      ]
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
