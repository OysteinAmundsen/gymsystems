/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { AppModuleTest } from 'app/app.module.spec';
import { TournamentModule } from '../tournament.module';
import { TeamsComponent } from './teams.component';
import { TournamentEditorComponent } from '../tournament-editor/tournament-editor.component';

import { IClub, IUser, Role, ITournament } from 'app/model';

import { dummyTournament } from 'app/services/api/tournament/tournament.service.stub';


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
        AppModuleTest,
        TournamentModule,
      ],
      providers: [
        {provide: TournamentEditorComponent, useClass: DummyParent},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
