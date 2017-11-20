import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { IDiscipline } from 'app/model';
import { Helper } from '../Helper';

@Injectable()
export class DisciplineService {
  url = '/api/disciplines';

  constructor(private http: HttpClient) {  }

  all(): Observable<IDiscipline[]> {
    return this.http.get<IDiscipline[]>(this.url);
  }

  getByTournament(id: number): Observable<IDiscipline[]> {
    return this.http.get<IDiscipline[]>(`${this.url}/tournament/${id}`);
  }

  getById(id: number): Observable<IDiscipline> {
    return this.http.get<IDiscipline>(`${this.url}/${id}`);
  }

  save(discipline: IDiscipline) {
    return (discipline.id)
      ? this.http.put<IDiscipline>(`${this.url}/${discipline.id}`, Helper.reduceLevels(discipline))
      : this.http.post<IDiscipline>(this.url, Helper.reduceLevels(discipline));
  }

  saveAll(disciplines: IDiscipline[]) {
    return this.http.post<IDiscipline[]>(this.url, Helper.reduceLevels(disciplines));
  }

  delete(discipline: IDiscipline) {
    return this.http.delete(`${this.url}/${discipline.id}`);
  }
}
