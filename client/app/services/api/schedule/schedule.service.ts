import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';

import * as moment from 'moment';

import { Logger } from 'app/services';

import { ConfigurationService } from '../configuration/configuration.service';
import { ITeamInDiscipline, ITournament, ParticipationType, DivisionType } from 'app/services/model';
import { Helper } from '../Helper';

@Injectable()
export class ScheduleService {
  url = '/api/schedule';
  executionTime: number;
  trainingTime: number;


  constructor(private http: Http, private configService: ConfigurationService) {
    this.configService.getByname('scheduleExecutionTime').subscribe(exec => this.executionTime = +exec.value);
    this.configService.getByname('scheduleTrainingTime').subscribe(exec => this.trainingTime = +exec.value);
  }

  all(): Observable<ITeamInDiscipline[]> {
    return this.http.get(this.url).map((res: Response) => res.json()).share();
  }

  getByTournament(id: number): Observable<ITeamInDiscipline[]> {
    return this.http.get(`${this.url}/tournament/${id}`).share().map((res: Response) => res.json());
  }

  getById(id: number): Observable<ITeamInDiscipline> {
    return this.http.get(`${this.url}/${id}`).share().map((res: Response) => res.json());
  }

  save(participant: ITeamInDiscipline) {
    const call = (participant.id)
      ? this.http.put(`${this.url}/${participant.id}`, Helper.reduceLevels(participant))
      : this.http.post(this.url, Helper.reduceLevels(participant));
    return call.map((res: Response) => res.json());
  }

  start(participant: ITeamInDiscipline) {
    return this.http.post(`${this.url}/${participant.id}/start`, {}).map((res: Response) => res.json());
  }

  stop(participant: ITeamInDiscipline) {
    return this.http.post(`${this.url}/${participant.id}/stop`, {}).map((res: Response) => res.json());
  }

  publish(participant: ITeamInDiscipline) {
    return this.http.post(`${this.url}/${participant.id}/publish`, {}).map((res: Response) => res.json());
  }

  saveAll(participants: ITeamInDiscipline[]) {
    return this.http.post(this.url, Helper.reduceLevels(participants, 2)).map((res: Response) => res.json());
  }

  delete(participant: ITeamInDiscipline) {
    return this.http.delete(`${this.url}/${participant.id}`);
  }

  deleteAll(id: number) {
    return this.http.delete(`${this.url}/tournament/${id}`);
  }

  stringHash(participant: ITeamInDiscipline, toType?: ParticipationType): string {
    const ageDiv = participant.team.divisions.find(d => d.type === DivisionType.Age);
    const genderDiv = participant.team.divisions.find(d => d.type === DivisionType.Gender);
    return (participant.team.name
          + (genderDiv ? genderDiv.name : '') + ' ' + (ageDiv ? ageDiv.name : '')
          + participant.discipline.name
          + (toType ? toType : participant.type))
        .replace(' ', '_');
  }

  startTime(tournament: ITournament, participant: ITeamInDiscipline): string {
    const time: moment.Moment = (participant.calculatedStartTime)
      ? participant.calculatedStartTime
      : this.calculateStartTime(tournament, participant);

    if (time) { return time.format('HH:mm'); }
    return '<span class="warning">ERR</span>';
  }

  isNewDay(tournament: ITournament, schedule: ITeamInDiscipline[], participant: ITeamInDiscipline): boolean {
    const next = schedule.find(s => s.startNumber === participant.startNumber + 1);
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

  calculateStartTime(tournament: ITournament, participant: ITeamInDiscipline): moment.Moment {
    let time: moment.Moment;
    let day = 0;
    let participantsPast = 0;
    for (day = 0; day < tournament.times.length; day++) { // Calculate day
      const timesForDay = tournament.times.find(t => t.day === day);
      const timesMoment = moment(tournament.startDate).startOf('day').utc().add(day, 'days');
      const startHour   = timesMoment.clone().hour(+timesForDay.time.split(',')[0]);
      const endHour     = timesMoment.clone().hour(+timesForDay.time.split(',')[1]);
      time = startHour.clone().add(this.executionTime * (participant.startNumber - participantsPast), 'minutes');
      if (time.isBefore(endHour)) {
        return time.utc();
      }
      participantsPast += moment.duration(endHour.diff(startHour)).asMinutes() / this.executionTime;
    }
    Logger.error(`No timeslots left in tournament for participant with start number ${participant.startNumber}`);
    return null;
  }

  recalculateStartTime(tournament: ITournament, schedule: ITeamInDiscipline[], resetStart = true): ITeamInDiscipline[] {
    let startNo = 0;
    const live = schedule.filter(s => s.type === ParticipationType.Live);
    live.forEach(s => {
      if (resetStart) {
        s.startNumber = startNo++;
      }
      s.calculatedStartTime = this.calculateStartTime(tournament, s);
    });

    let time: moment.Moment;
    startNo = -1;
    let training = schedule.filter(s => s.type === ParticipationType.Training);
    training = training.reverse();
    const startDate = moment(tournament.startDate).startOf('day').utc();
    for (let day = 0; day < tournament.times.length; day ++) {
      const timesForDay = tournament.times.find(t => t.day === day);
      const timesMoment = startDate.clone().add(day, 'days');
      const startHour   = timesMoment.clone().hour(+timesForDay.time.split(',')[0]).subtract(10, 'minutes');
      const trainingDay = training.filter(t => {
        const livePerformance = schedule.find(l => this.stringHash(t, ParticipationType.Live) === this.stringHash(l));
        return livePerformance.calculatedStartTime.isSame(timesMoment, 'day');
      });
      trainingDay.forEach((s, idx) => {
        time = startHour.clone().subtract(this.trainingTime * (idx), 'minutes');
        if (resetStart) {
          s.startNumber = startNo--;
        }
        s.calculatedStartTime = time.utc();
      });
    }

    return training.concat(live).sort((a, b) => {
      // Interleave training and live performances for each day of the tournament.
      return a.calculatedStartTime.isBefore(b.calculatedStartTime) ? -1 : 1;
    });
  }
}

