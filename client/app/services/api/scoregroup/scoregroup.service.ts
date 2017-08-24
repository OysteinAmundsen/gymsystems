import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';

import { IScoreGroup } from 'app/services/model';
import { Helper } from '../Helper';

@Injectable()
export class ScoreGroupService {
  url = '/api/scoregroups';

  constructor(private http: Http) {  }

  all(): Observable<IScoreGroup[]> {
    return this.http.get(this.url).map((res: Response) => res.json()).share();
  }

  getByDiscipline(id: number): Observable<IScoreGroup[]> {
    return this.http.get(`${this.url}/discipline/${id}`).map((res: Response) => res.json()).share();
  }

  getById(id: number): Observable<IScoreGroup> {
    return this.http.get(`${this.url}/${id}`).map((res: Response) => res.json()).share();
  }

  save(scoreGroup: IScoreGroup) {
    const call = (scoreGroup.id)
      ? this.http.put(`${this.url}/${scoreGroup.id}`, Helper.reduceLevels(scoreGroup))
      : this.http.post(this.url, Helper.reduceLevels(scoreGroup));
    return call.map((res: Response) => res.json());
  }

  saveAll(scoreGroups: IScoreGroup[]) {
    return this.http.post(this.url, Helper.reduceLevels(scoreGroups)).map((res: Response) => res.json());
  }

  delete(scoreGroup: IScoreGroup) {
    return this.http.delete(`${this.url}/${scoreGroup.id}`);
  }
}
