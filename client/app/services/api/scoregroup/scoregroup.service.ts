import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { IScoreGroup } from 'app/model';
import { Helper } from '../Helper';

@Injectable()
export class ScoreGroupService {
  url = '/api/scoregroups';

  constructor(private http: HttpClient) {  }

  all(): Observable<IScoreGroup[]> {
    return this.http.get<IScoreGroup[]>(this.url);
  }

  getByDiscipline(id: number): Observable<IScoreGroup[]> {
    return this.http.get<IScoreGroup[]>(`${this.url}/discipline/${id}`);
  }

  getById(id: number): Observable<IScoreGroup> {
    return this.http.get<IScoreGroup>(`${this.url}/${id}`);
  }

  save(scoreGroup: IScoreGroup) {
    return (scoreGroup.id)
      ? this.http.put<IScoreGroup>(`${this.url}/${scoreGroup.id}`, Helper.reduceLevels(scoreGroup))
      : this.http.post<IScoreGroup>(this.url, Helper.reduceLevels(scoreGroup));
  }

  saveAll(scoreGroups: IScoreGroup[]) {
    return this.http.post<IScoreGroup[]>(this.url, Helper.reduceLevels(scoreGroups));
  }

  delete(scoreGroup: IScoreGroup) {
    return this.http.delete(`${this.url}/${scoreGroup.id}`);
  }
}
