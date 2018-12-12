import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of} from 'rxjs';

import * as moment from 'moment';

import { ITeamInDiscipline, IDiscipline, ITournament, ParticipationType } from 'app/model';
import { ScheduleService } from './schedule.service';
import { ConfigurationService } from '../configuration/configuration.service';

// Dummy data
import { defaultScoreGroups } from '../scoregroup/scoregroup.service.stub';
import { dummyTournament } from '../tournament/tournament.service.stub';
import { dummyTeam } from '../teams/teams.service.stub';

export function generateParticipants(amount: number): ITeamInDiscipline[] {
  return Array(amount).fill(0).map((s, i) => {
    return <ITeamInDiscipline>{
      id: i,
      sortNumber: i,
      startNumber: i,
      type: ParticipationType.Live,
      discipline: <IDiscipline>{
        name: 'Frittstående',
        scoreGroups: defaultScoreGroups
      },
      team: dummyTeam,
      tournament: dummyTournament,
      scores: []
    };
  });
}

@Injectable()
export class ScheduleServiceStub extends ScheduleService {
  participant: ITeamInDiscipline = generateParticipants(1)[0];
  schedule: ITeamInDiscipline[] = generateParticipants(10);
  constructor(http: HttpClient, configService: ConfigurationService) {
    super(http, configService);
  }

  all(): Observable<ITeamInDiscipline[]> {
    return of(this.schedule);
  }

  getByTournament(id: number): Observable<ITeamInDiscipline[]> {
    return of(this.schedule);
  }

  getById(id: number): Observable<ITeamInDiscipline> {
    return of(this.participant);
  }

  save(participant: ITeamInDiscipline) {
    return of(this.participant);
  }

  start(participant: ITeamInDiscipline) {
    return of(this.participant);
  }

  stop(participant: ITeamInDiscipline) {
    return of(this.participant);
  }

  publish(participant: ITeamInDiscipline) {
    return of(this.participant);
  }

  saveAll(participants: ITeamInDiscipline[]) {
    return of(this.schedule);
  }

  delete(participant: ITeamInDiscipline) {
    return of(null);
  }

  deleteAll(id: number) {
    return of(null);
  }
}
