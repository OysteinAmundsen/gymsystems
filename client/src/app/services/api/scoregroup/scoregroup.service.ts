import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';

import { IScoreGroup } from 'app/model';
import { Helper } from '../Helper';

@Injectable({ providedIn: 'root' })
export class ScoreGroupService {
  url = '/api/scoregroups';

  constructor(private http: HttpClient) {  }

  /**
   *
   */
  all(): Observable<IScoreGroup[]> {
    return this.http.get<IScoreGroup[]>(this.url);
  }

  /**
   *
   * @param id
   */
  getByDiscipline(id: number): Observable<IScoreGroup[]> {
    return this.http.get<IScoreGroup[]>(`${this.url}/discipline/${id}`);
  }

  /**
   *
   * @param id
   */
  getById(id: number): Observable<IScoreGroup> {
    return this.http.get<IScoreGroup>(`${this.url}/${id}`);
  }

  /**
   *
   * @param scoreGroup
   */
  save(scoreGroup: IScoreGroup) {
    const val = Helper.reduceLevels(scoreGroup, 3);
    return (scoreGroup.id)
      ? this.http.put<IScoreGroup>(`${this.url}/${scoreGroup.id}`, val)
      : this.http.post<IScoreGroup>(this.url, val);
  }

  /**
   *
   * @param scoreGroups
   */
  saveAll(scoreGroups: IScoreGroup[]) {
    return this.http.post<IScoreGroup[]>(this.url, Helper.reduceLevels(scoreGroups));
  }

  /**
   *
   * @param scoreGroup
   */
  delete(scoreGroup: IScoreGroup) {
    return this.http.delete(`${this.url}/${scoreGroup.id}`);
  }
}
