import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/of';

import * as moment from 'moment';

import { ITeamInDiscipline, IDiscipline, ITournament, ParticipationType } from 'app/services/model';
import { ScheduleService } from './schedule.service';
import { ConfigurationService } from '../configuration/configuration.service';

// Dummy data
import { scoreGroups } from '../scoregroup/scoregroup.service.stub';
import { dummyTournament } from '../tournament/tournament.service.stub';
import { dummyTeam } from '../teams/teams.service.stub';

function generateParticipants(amount: number): ITeamInDiscipline[] {
  return Array(amount).fill(0).map((s, i) => {
    return <ITeamInDiscipline>{
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
export class ScheduleServiceStub extends ScheduleService {
  participant: ITeamInDiscipline = generateParticipants(1)[0];
  schedule: ITeamInDiscipline[] = generateParticipants(10);
  constructor(http: Http, configService: ConfigurationService) {
    super(http, configService);
  }

  all(): Observable<ITeamInDiscipline[]> {
    return Observable.of(this.schedule);
  }

  getByTournament(id: number): Observable<ITeamInDiscipline[]> {
    return Observable.of(this.schedule);
  }

  getById(id: number): Observable<ITeamInDiscipline> {
    return Observable.of(this.participant);
  }

  save(participant: ITeamInDiscipline) {
    return Observable.of(this.participant);
  }

  start(participant: ITeamInDiscipline) {
    return Observable.of(this.participant);
  }

  stop(participant: ITeamInDiscipline) {
    return Observable.of(this.participant);
  }

  publish(participant: ITeamInDiscipline) {
    return Observable.of(this.participant);
  }

  saveAll(participants: ITeamInDiscipline[]) {
    return Observable.of(this.schedule);
  }

  delete(participant: ITeamInDiscipline) {
    return Observable.of(null);
  }

  deleteAll(id: number) {
    return Observable.of(null);
  }
}
