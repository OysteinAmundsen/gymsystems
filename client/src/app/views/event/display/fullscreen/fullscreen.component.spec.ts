import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReplaySubject } from 'rxjs';

import { AppModuleTest } from 'app/app.module.spec';
import { EventModule } from '../../event.module';
import { FullscreenComponent } from './fullscreen.component';
import { EventComponent } from '../../event.component';

import { ITournament } from 'app/model';

import { dummyTournament } from 'app/services/api/tournament/tournament.service.stub';

class DummyParent {
  tournamentSubject = new ReplaySubject<ITournament>(1);
  constructor() {
    this.tournamentSubject.next(dummyTournament);
  }
}
describe('views.event.display:FullscreenComponent', () => {
  let component: FullscreenComponent;
  let fixture: ComponentFixture<FullscreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModuleTest,
        EventModule,
      ],
      providers: [
        { provide: EventComponent, useClass: DummyParent }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
