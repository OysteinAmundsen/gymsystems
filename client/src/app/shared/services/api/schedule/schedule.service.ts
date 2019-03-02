import { Injectable } from '@angular/core';

import * as moment from 'moment';

import { Logger } from 'app/shared/services';

import { ConfigurationService } from '../configuration/configuration.service';
import { ITeamInDiscipline, ITournament, ParticipationType } from 'app/model';
import { CommonService } from '../../common.service';

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  url = '/api/schedule';
  executionTime: number;
  trainingTime: number;


  constructor(private configService: ConfigurationService) {
    this.configService.getByname('scheduleExecutionTime').subscribe(exec => this.executionTime = +exec.value);
    this.configService.getByname('scheduleTrainingTime').subscribe(exec => this.trainingTime = +exec.value);
  }

  /**
   *
   */
  startTime(tournament: ITournament, participant: ITeamInDiscipline, schedule: ITeamInDiscipline[]): Date {
    // Check if we allready have a time to return
    if (participant.startTime) { return participant.startTime; }
    if (participant.calculatedStartTime) { return participant.calculatedStartTime.toDate(); }

    // Calculate start time for this participant
    const type = participant.type === ParticipationType.Training && tournament.times[0].train ? 'train' : 'time';
    const startTime = moment(tournament.startDate).hour(+tournament.times[0][type].split(',')[0]).minute(0);
    const idx = schedule.findIndex(s => s.id === participant.id);
    const lastTime = idx === 0 || schedule[idx - 1].type !== participant.type ? null : (schedule[idx - 1].startTime ? schedule[idx - 1].startTime : schedule[idx - 1].calculatedStartTime);
    const addTime = (participant.type === ParticipationType.Live ? this.executionTime : this.trainingTime);
    const nextTime = lastTime ? moment(lastTime).clone().add(addTime, 'minutes') : startTime;

    // Usually this is enough, but we have to check if this tournament spans more days and set time appropriately.
    if (tournament.times.length > 1) {
      const currentDay = this.getTournamentDay(tournament, nextTime);
      const endTime = moment(tournament.startDate).hour(+tournament.times[currentDay][type].split(',')[1]);
      if (nextTime.diff(endTime, 'minutes') > 0) {
        // We have exceeded the timeslots for this day. Move on to next day.
        nextTime.add(1, 'day').hour(+tournament.times[this.getTournamentDay(tournament, nextTime) + 1][type].split(',')[0]).minute(0);
      }
    }

    // Return calculated starttime
    participant.calculatedStartTime = nextTime;
    return participant.calculatedStartTime.toDate();
  }

  getTournamentDay(tournament: ITournament, nextTime: moment.Moment): number {
    if (tournament.times.length === 1) { return 0; }
    const startTime = moment(tournament.startDate).hour(+tournament.times[0].time.split(',')[0]);
    return nextTime.diff(startTime, 'days');
  }

  /**
   *
   */
  isNewDay(tournament: ITournament, participant: ITeamInDiscipline, schedule: ITeamInDiscipline[]): boolean {
    if (tournament.times.length > 1) {
      const nextTime = moment(this.startTime(tournament, participant, schedule));
      const currentDay = this.getTournamentDay(tournament, nextTime);
      const endTime = moment(tournament.startDate).hour(+tournament.times[currentDay].time.split(',')[1]);
      return nextTime.diff(endTime, 'minutes') > 0;
    }
    return false;
  }
}

