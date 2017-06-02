import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/of';

import { ITournament } from '../model/ITournament';
import { IUser } from 'app/services/model/IUser';

export const dummyTournament = <ITournament>{
  id: 1,
  createdBy: <IUser>{},
  name: '',
  description_no: '',
  description_en: '',
  startDate: new Date(),
  endDate: new Date(),
  location: '',
  schedule: [],
  disciplines: [],
  divisions: [],
  times: [{day: new Date(), time: "12,18"}]
};

@Injectable()
export class TournamentServiceStub {
  previous: ITournament = <ITournament>{
    id: 0,
    createdBy: <IUser>{},
    name: '',
    description_no: '',
    description_en: '',
    startDate: new Date(),
    endDate: new Date(),
    location: '',
    schedule: [],
    disciplines: [],
    divisions: [],
    times: null
  };
  present: ITournament = dummyTournament;
  future: ITournament = <ITournament>{
    id: 2,
    createdBy: <IUser>{},
    name: '',
    description_no: '',
    description_en: '',
    startDate: new Date(),
    endDate: new Date(),
    location: '',
    schedule: [],
    disciplines: [],
    divisions: [],
    times: null
  };
  tournaments: ITournament[] = [
    this.previous, this.present, this.future
  ]

  selected = dummyTournament;
  selectedId = dummyTournament.id;
  constructor(private http: Http) {  }

  all(): Observable<ITournament[]> {
    return Observable.of(this.tournaments);
  }
  past(): Observable<ITournament[]> {
    return Observable.of([this.previous]);
  }
  current(): Observable<ITournament[]> {
    return Observable.of([this.present]);
  }
  upcoming(): Observable<ITournament[]> {
    return Observable.of([this.future]);
  }
  getById(id: number): Observable<ITournament> {
    return Observable.of(this.present);
  }

  save(tournament: ITournament) {
    return Observable.of(this.present);
  }

  delete(tournament: ITournament) {
    return Observable.of(null);
  }

  mapDate(tournament: ITournament) {
    return Observable.of(this.present);
  }
}
