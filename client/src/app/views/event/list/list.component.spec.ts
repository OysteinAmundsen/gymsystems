/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReplaySubject } from 'rxjs';

import { AppModuleTest } from 'app/app.module.spec';
import { EventModule } from '../event.module';
import { ListComponent } from './list.component';
import { EventComponent } from '../event.component';

import { ITournament } from 'app/model/ITournament';

import { dummyTournament } from 'app/services/api/tournament/tournament.service.stub';

export class DummyParent {
  tournamentSubject = new ReplaySubject<ITournament>(1);
  constructor() {
    this.tournamentSubject.next(dummyTournament);
  }
}
describe('views.event.list:ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModuleTest,
        EventModule,
      ],
      providers: [
        {provide: EventComponent, useClass: DummyParent}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
