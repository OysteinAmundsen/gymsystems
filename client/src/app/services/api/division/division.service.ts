import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';

import { IDivision } from 'app/model';
import { Helper } from '../Helper';

@Injectable({ providedIn: 'root' })
export class DivisionService {
  url = '/api/divisions';

  constructor(private http: HttpClient) {  }

  /**
   *
   */
  all(): Observable<IDivision[]> {
    return this.http.get<IDivision[]>(this.url);
  }

  /**
   *
   */
  getByTournament(id: number): Observable<IDivision[]> {
    return this.http.get<IDivision[]>(`${this.url}/tournament/${id}`);
  }

  /**
   *
   * @param id
   */
  getById(id: number): Observable<IDivision> {
    return this.http.get<IDivision>(`${this.url}/${id}`);
  }

  /**
   *
   * @param division
   */
  save(division: IDivision) {
    return (division.id)
      ? this.http.put<IDivision>(`${this.url}/${division.id}`, Helper.reduceLevels(division))
      : this.http.post<IDivision>(this.url, Helper.reduceLevels(division));
  }

  /**
   *
   */
  saveAll(divisions: IDivision[]) {
    return this.http.post<IDivision[]>(this.url, Helper.reduceLevels(divisions));
  }

  /**
   *
   * @param division
   */
  delete(division: IDivision) {
    return this.http.delete(`${this.url}/${division.id}`);
  }
}
