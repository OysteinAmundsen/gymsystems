import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/of';

import { ITournamentParticipant } from '../model/ITournamentParticipant';
import { IDiscipline } from '../model/IDiscipline';
import { ITeam } from '../model/ITeam';
import { ITournament } from '../model/ITournament';
import { IClub } from '../model/IClub';

@Injectable()
export class ScheduleServiceStub {
  participant: ITournamentParticipant = <ITournamentParticipant>{
    id: 0,
    startNumber: 0,
    discipline: <IDiscipline>{},
    team: <ITeam>{
      id: 0,
      name: '',
      divisions: [],
      disciplines: [],
      tournament: <ITournament>{},
      club: <IClub>{}
    },
    tournament: <ITournament>{},
    scores: []
  };
  schedule: ITournamentParticipant[] = [
    this.participant
  ]
  constructor(private http: Http) {  }

  all(): Observable<ITournamentParticipant[]> {
    return Observable.of(this.schedule);
  }

  getByTournament(id: number): Observable<ITournamentParticipant[]> {
    return Observable.of(this.schedule);
  }

  getById(id: number): Observable<ITournamentParticipant> {
    return Observable.of(this.participant);
  }

  save(participant: ITournamentParticipant) {
    return Observable.of(this.participant);
  }

  start(participant: ITournamentParticipant) {
    return Observable.of(this.participant);
  }

  stop(participant: ITournamentParticipant) {
    return Observable.of(this.participant);
  }

  publish(participant: ITournamentParticipant) {
    return Observable.of(this.participant);
  }

  saveAll(participants: ITournamentParticipant[]) {
    return Observable.of(this.schedule);
  }

  delete(participant: ITournamentParticipant) {
    return Observable.of(null);
  }

  deleteAll(participants: ITournamentParticipant[]) {
    return Observable.of(null);
  }
}
