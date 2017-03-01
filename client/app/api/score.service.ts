import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';

import { ApiService } from './ApiService';
import { IScoreGroup } from './model/IScoreGroup';

@Injectable()
export class ScoreService extends ApiService {
  url: string = '/api/scoregroups';

  constructor(private http: Http) {
    super();
  }

  all(): Observable<IScoreGroup[]> {
    return this.http.get(this.url).map((res: Response) => res.json()).share().catch(this.handleError);
  }

  getByDiscipline(id: number): Observable<IScoreGroup[]> {
    return this.http.get(`${this.url}/discipline/${id}`).map((res: Response) => res.json()).share().catch(this.handleError);
  }

  getById(id: number): Observable<IScoreGroup> {
    return this.http.get(`${this.url}/${id}`).map((res: Response) => res.json()).share().catch(this.handleError);
  }

  save(scoreGroup: IScoreGroup) {
    let call = (scoreGroup.id) ? this.http.put(`${this.url}/${scoreGroup.id}`, scoreGroup) : this.http.post(this.url, scoreGroup);
    return call.map((res: Response) => res.json()).catch(this.handleError);
  }

  saveAll(scoreGroups: IScoreGroup[]) {
    return this.http.post(this.url, scoreGroups).map((res: Response) => res.json()).catch(this.handleError);
  }

  delete(scoreGroup: IScoreGroup) {
    return this.http.delete(`${this.url}/${scoreGroup.id}`);
  }
}
