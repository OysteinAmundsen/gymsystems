import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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


  constructor(private http: HttpClient, private configService: ConfigurationService) {
    this.configService.getByname('scheduleExecutionTime').subscribe(exec => this.executionTime = +exec.value);
    this.configService.getByname('scheduleTrainingTime').subscribe(exec => this.trainingTime = +exec.value);
  }

  /**
   *
   */
  stop(participant: ITeamInDiscipline) {
    return this.http.post<ITeamInDiscipline>(`${this.url}/${participant.id}/stop`, {});
  }

  /**
   *
   */
  publish(participant: ITeamInDiscipline) {
    return this.http.post<ITeamInDiscipline>(`${this.url}/${participant.id}/publish`, {});
  }

  /**
   *
   */
  startTime(tournament: ITournament, participant: ITeamInDiscipline): string {
    const time: moment.Moment = (participant.calculatedStartTime)
      ? participant.calculatedStartTime
      : this.calculateStartTime(tournament, participant);

    if (time) { return time.format('HH:mm'); }
    return '<span class="warning">ERR</span>';
  }

  /**
   *
   */
  isNewDay(tournament: ITournament, schedule: ITeamInDiscipline[], participant: ITeamInDiscipline): boolean {
    const next = schedule.find(s => s.sortNumber === participant.sortNumber + 1);
    if (next) {
      const thisTime = (participant.calculatedStartTime
        ? participant.calculatedStartTime.clone()
        : this.calculateStartTime(tournament, participant));
      const nextTime = (next.calculatedStartTime
        ? next.calculatedStartTime.clone()
        : this.calculateStartTime(tournament, next));

      if (thisTime && nextTime) {
        const difference = moment.duration(nextTime.startOf('day').diff(thisTime.startOf('day'))).asDays();
        return (difference >= 1);
      }
    }
    return false;
  }

  /**
   *
   */
  calculateStartTime(tournament: ITournament, participant: ITeamInDiscipline): moment.Moment {
    let time: moment.Moment;
    let day = 0;
    let participantsPast = 0;
    for (day = 0; day < tournament.times.length; day++) { // Calculate day
      const timesForDay = tournament.times.find(t => t.day === day);
      const timesMoment = moment(tournament.startDate).startOf('day').utc().add(day, 'days');
      const startHour = timesMoment.clone().hour(+timesForDay.time.split(',')[0]);
      const endHour = timesMoment.clone().hour(+timesForDay.time.split(',')[1]);
      time = startHour.clone().add(this.executionTime * (participant.sortNumber - participantsPast), 'minutes');
      if (time.isBefore(endHour)) {
        return time.utc();
      }
      participantsPast += moment.duration(endHour.diff(startHour)).asMinutes() / this.executionTime;
    }
    Logger.error(`No timeslots left in tournament for participant with start number ${participant.startNumber}`);
    return null;
  }

  /**
   *
   */
  recalculateStartTime(tournament: ITournament, schedule: ITeamInDiscipline[], resetSort = true, resetStart = false): ITeamInDiscipline[] {
    let startNo = 0;
    const live = schedule.filter(s => s.type === ParticipationType.Live);
    live.forEach(s => {
      if (resetSort || !s.sortNumber) { s.sortNumber = startNo++; }
      if (resetStart || !s.startNumber) { s.startNumber = s.sortNumber; }
      s.calculatedStartTime = this.calculateStartTime(tournament, s);
    });

    let time: moment.Moment;
    startNo = -1;
    let training = schedule.filter(s => s.type === ParticipationType.Training);
    training = training.reverse();
    const startDate = moment(tournament.startDate).startOf('day').utc();
    for (let day = 0; day < tournament.times.length; day++) {
      const timesForDay = tournament.times.find(t => t.day === day);
      const timesMoment = startDate.clone().add(day, 'days');
      const startHour = timesMoment.clone().hour(+timesForDay.time.split(',')[0]).subtract(10, 'minutes');
      const trainingDay = training.filter(t => {
        const livePerformance = schedule.find(l => CommonService.stringHash(t, ParticipationType.Live) === CommonService.stringHash(l));
        if (livePerformance) {
          return livePerformance.calculatedStartTime.isSame(timesMoment, 'day');
        } else {
          return false;
        }
      });
      trainingDay.forEach((s, idx) => {
        time = startHour.clone().subtract(this.trainingTime * (idx), 'minutes');
        if (resetSort) { s.sortNumber = startNo--; }
        if (resetStart) { s.startNumber = s.sortNumber; }
        s.calculatedStartTime = time.utc();
      });
    }

    return training.concat(live).sort((a, b) => {
      // Interleave training and live performances for each day of the tournament.
      if (a.calculatedStartTime == null || b.calculatedStartTime == null) {
        return 0;
      }
      return a.calculatedStartTime.isBefore(b.calculatedStartTime) ? -1 : 1;
    });
  }
}

