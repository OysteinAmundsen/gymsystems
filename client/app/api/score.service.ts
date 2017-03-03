import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';

import { ApiService } from './ApiService';
import { ITournamentParticipantScore } from './model/ITournamentParticipantScore';

@Injectable()
export class ScoreService extends ApiService {
  url: string = '/api/score/participant';

  constructor(private http: Http) {
    super();
  }

  getByParticipant(participantId: number) {
    return this.http.get(`${this.url}/${participantId}`).map((res: Response) => res.json()).share().catch(this.handleError);
  }

  saveFromParticipant(participantId: number, scores: ITournamentParticipantScore[]) {
    return this.http.post(`${this.url}/${participantId}`, scores).map((res: Response) => res.json()).share().catch(this.handleError);
  }

  removeFromParticipant(participantId: number) {
    return this.http.delete(`${this.url}/${participantId}`).map((res: Response) => res.json()).share().catch(this.handleError);
  }
}
