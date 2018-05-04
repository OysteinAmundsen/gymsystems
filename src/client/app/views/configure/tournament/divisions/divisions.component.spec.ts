import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';

import { AppModuleTest } from 'app/app.module.spec';
import { DivisionsModule } from './divisions.module';
import { DivisionsComponent } from './divisions.component';
import { TournamentEditorComponent } from '../tournament-editor/tournament-editor.component';

import { ITournament } from 'app/model';
import { dummyTournament } from 'app/services/api/tournament/tournament.service.stub';

class DummyParent {
  tournamentSubject = new ReplaySubject<ITournament>(1);
  constructor() {
    this.tournamentSubject.next(dummyTournament);
  }
}
describe('views.configure.tournament:DivisionsComponent', () => {
  let component: DivisionsComponent;
  let fixture: ComponentFixture<DivisionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModuleTest,
        DivisionsModule,
      ],
      providers: [
        { provide: TournamentEditorComponent, useClass: DummyParent },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
