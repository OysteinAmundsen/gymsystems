import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';

import { ApiService } from './ApiService';
import { ITournamentParticipant } from './model/ITournamentParticipant';

@Injectable()
export class ScheduleService extends ApiService {
  url: string = '/api/schedule';

  constructor(private http: Http) {
    super();
  }

  all(): Observable<ITournamentParticipant[]> {
    return this.http.get(this.url).map((res: Response) => res.json()).share().catch(this.handleError);
  }

  getByTournament(id: number): Observable<ITournamentParticipant[]> {
    return this.http.get(`${this.url}/tournament/${id}`).map((res: Response) => res.json()).share().catch(this.handleError);
  }

  getById(id: number): Observable<ITournamentParticipant> {
    return this.http.get(`${this.url}/${id}`).map((res: Response) => res.json()).share().catch(this.handleError);
  }

  save(participant: ITournamentParticipant) {
    const call = (participant.id) ? this.http.put(`${this.url}/${participant.id}`, participant) : this.http.post(this.url, participant);
    return call.map((res: Response) => res.json()).catch(this.handleError);
  }

  saveAll(participants: ITournamentParticipant[]) {
    return this.http.post(this.url, participants).map((res: Response) => res.json()).catch(this.handleError);
  }

  delete(participant: ITournamentParticipant) {
    return this.http.delete(`${this.url}/${participant.id}`);
  }

  deleteAll(participants: ITournamentParticipant[]) {
    return this.http.delete(`${this.url}/many`, { body: participants });
  }
}
