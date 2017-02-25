import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

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
    return this.http.get(`${this.url}/${id}`).map((res: Response) => res.json()).catch(this.handleError);
  }

  save(division: ITournamentParticipant) {
    const call = (division.id) ? this.http.put(`${this.url}/${division.id}`, division) : this.http.post(this.url, division);
    return call.map((res: Response) => res.json()).catch(this.handleError);
  }

  saveAll(divisions: ITournamentParticipant[]) {
    return this.http.post(this.url, divisions).map((res: Response) => res.json()).catch(this.handleError);
  }

  delete(division: ITournamentParticipant) {
    return this.http.delete(`${this.url}/${division.id}`);
  }
}
