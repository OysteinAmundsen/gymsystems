import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';

import * as moment from 'moment';
const Moment: any = (<any>moment).default || moment;

import { ITournamentParticipant } from '../model/ITournamentParticipant';
import { ConfigurationService } from "app/services/api";
import { ITournament } from "app/services/model/ITournament";

@Injectable()
export class ScheduleService {
  url = '/api/schedule';
  executionTime: number;


  constructor(private http: Http, private configService: ConfigurationService) {
    this.configService.getByname('scheduleExecutionTime').subscribe(exec => this.executionTime = +exec.value);
  }

  all(): Observable<ITournamentParticipant[]> {
    return this.http.get(this.url).map((res: Response) => res.json()).share();
  }

  getByTournament(id: number): Observable<ITournamentParticipant[]> {
    return this.http.get(`${this.url}/tournament/${id}`).share().map((res: Response) => res.json());
  }

  getById(id: number): Observable<ITournamentParticipant> {
    return this.http.get(`${this.url}/${id}`).share().map((res: Response) => res.json());
  }

  save(participant: ITournamentParticipant) {
    const call = (participant.id) ? this.http.put(`${this.url}/${participant.id}`, participant) : this.http.post(this.url, participant);
    return call.map((res: Response) => res.json());
  }

  start(participant: ITournamentParticipant) {
    return this.http.post(`${this.url}/${participant.id}/start`, {}).map((res: Response) => res.json());
  }

  stop(participant: ITournamentParticipant) {
    return this.http.post(`${this.url}/${participant.id}/stop`, {}).map((res: Response) => res.json());
  }

  publish(participant: ITournamentParticipant) {
    return this.http.post(`${this.url}/${participant.id}/publish`, {}).map((res: Response) => res.json());
  }

  saveAll(participants: ITournamentParticipant[]) {
    return this.http.post(this.url, participants).map((res: Response) => res.json());
  }

  delete(participant: ITournamentParticipant) {
    return this.http.delete(`${this.url}/${participant.id}`);
  }

  deleteAll(id: number) {
    return this.http.delete(`${this.url}/tournament/${id}`);
  }

  calculateStartTime(tournament: ITournament, participant: ITournamentParticipant): moment.Moment {
    let time: moment.Moment;
    let day = 0;
    let participantsPast = 0;
    for (let day = 0; day < tournament.times.length; day++) {
      let timesForDay = tournament.times[day];
      let startHour   = moment(timesForDay.day).hour(+timesForDay.time.split(',')[0]);
      let endHour     = moment(timesForDay.day).hour(+timesForDay.time.split(',')[1]);
      time = startHour.clone().add(this.executionTime * (participant.startNumber - participantsPast), 'minutes');
      if (time.isBefore(endHour)) {
        return time;
      }
      participantsPast += moment.duration(endHour.diff(startHour)).asMinutes() / this.executionTime;
    }
    console.error(`No timeslots left in tournament for participant with start number ${participant.startNumber}`);
    return null;
  }
}
