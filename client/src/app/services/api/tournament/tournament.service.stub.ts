import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import * as moment from 'moment';

import { ITournament, IUser, IClub } from 'app/model';
import { TournamentService } from './tournament.service';
import { dummyVenue } from 'app/services/api/venue/venue.service.spec';

export const dummyTournament = <ITournament>{
  id: 1,
  createdBy: <IUser>{},
  club: <IClub>{},
  name: '',
  description_no: '',
  description_en: '',
  startDate: new Date().getTime(),
  endDate: moment().add(1, 'days').toDate().getTime(),
  venue: dummyVenue,
  schedule: [],
  disciplines: [],
  divisions: [],
  times: [{ day: 0, time: '12,13' }, { day: 1, time: '12,13' }]
};

@Injectable()
export class TournamentServiceStub extends TournamentService {
  previous: ITournament = dummyTournament;
  present: ITournament = dummyTournament;
  future: ITournament = dummyTournament;
  tournaments: ITournament[] = [
    this.previous, this.present, this.future
  ];

  selected = dummyTournament;
  selectedId = dummyTournament.id;
  constructor(http: HttpClient) {
    super(http);
  }

  all(): Observable<ITournament[]> {
    return of(this.tournaments);
  }
  getById(id: number): Observable<ITournament> {
    return of(this.present);
  }

  save(tournament: ITournament) {
    return of(this.present);
  }

  delete(tournament: ITournament) {
    return of(null);
  }
}
