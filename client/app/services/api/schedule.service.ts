import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';

import { ITournamentParticipant } from '../model/ITournamentParticipant';

@Injectable()
export class ScheduleService {
  url: string = '/api/schedule';

  constructor(private http: Http) {  }

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

  saveAll(participants: ITournamentParticipant[]) {
    return this.http.post(this.url, participants).map((res: Response) => res.json());
  }

  delete(participant: ITournamentParticipant) {
    return this.http.delete(`${this.url}/${participant.id}`);
  }

  deleteAll(participants: ITournamentParticipant[]) {
    return this.http.delete(`${this.url}/many`, { body: participants });
  }
}
