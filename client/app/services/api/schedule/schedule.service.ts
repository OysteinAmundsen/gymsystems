import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';

import * as moment from 'moment';

import { Logger } from 'app/services';

import { ConfigurationService } from 'app/services/api/configuration/configuration.service';
import { ITeamInDiscipline, ITournament } from 'app/services/model';
import { Helper } from '../Helper';

@Injectable()
export class ScheduleService {
  url = '/api/schedule';
  executionTime: number;


  constructor(private http: Http, private configService: ConfigurationService) {
    this.configService.getByname('scheduleExecutionTime').subscribe(exec => this.executionTime = +exec.value);
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
    return this.http.post(this.url, Helper.reduceLevels(participants)).map((res: Response) => res.json());
  }

  delete(participant: ITeamInDiscipline) {
    return this.http.delete(`${this.url}/${participant.id}`);
  }

  deleteAll(id: number) {
    return this.http.delete(`${this.url}/tournament/${id}`);
  }

  calculateStartTime(tournament: ITournament, participant: ITeamInDiscipline): moment.Moment {
    let time: moment.Moment;
    let day = 0;
    let participantsPast = 0;
    for (day = 0; day < tournament.times.length; day++) {
      const timesForDay = tournament.times.find(t => t.day === day);
      const timesMoment = moment(tournament.startDate).startOf('day').utc().add(day, 'days');
      const startHour   = timesMoment.clone().hour(+timesForDay.time.split(',')[0]);
      const endHour     = timesMoment.clone().hour(+timesForDay.time.split(',')[1]);
      time = startHour.clone().add(this.executionTime * (participant.startNumber - participantsPast), 'minutes');
      if (time.isBefore(endHour)) {
        return time;
      }
      participantsPast += moment.duration(endHour.diff(startHour)).asMinutes() / this.executionTime;
    }
    Logger.error(`No timeslots left in tournament for participant with start number ${participant.startNumber}`);
    return null;
  }
}
