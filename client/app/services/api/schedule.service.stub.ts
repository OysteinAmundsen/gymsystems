import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/of';

import * as moment from 'moment';

import { ITournamentParticipant } from '../model/ITournamentParticipant';
import { IDiscipline } from '../model/IDiscipline';
import { ITournament } from '../model/ITournament';
import { ScheduleService, ConfigurationService } from 'app/services/api';

// Dummy data
import { scoreGroups } from 'app/services/api/scoregroup.service.stub';
import { dummyTournament } from 'app/services/api/tournament.service.stub';
import { dummyTeam } from 'app/services/api/teams.service.stub';
import { ParticipationType } from 'app/services/model/ParticipationType';

function generateParticipants(amount: number): ITournamentParticipant[] {
  return Array(amount).fill(0).map((s, i) => {
    return <ITournamentParticipant>{
      id: i,
      startNumber: i,
      type: ParticipationType.Live,
      discipline: <IDiscipline>{
        scoreGroups: scoreGroups
      },
      team: dummyTeam,
      tournament: dummyTournament,
      scores: []
    }
  });
}

@Injectable()
export class ScheduleServiceStub {
  original: ScheduleService;
  participant: ITournamentParticipant = generateParticipants(1)[0];
  schedule: ITournamentParticipant[] = generateParticipants(10);
  constructor(private http: Http, private configService: ConfigurationService) {
    this.original = new ScheduleService(http, configService);
  }

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

  calculateStartTime(tournament: ITournament, participant: ITournamentParticipant): moment.Moment {
    return this.original.calculateStartTime(tournament, participant);
  }
}
