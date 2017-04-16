import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';

import { IDiscipline } from './model/IDiscipline';

@Injectable()
export class DisciplineService {
  url: string = '/api/disciplines';

  constructor(private http: Http) {  }

  all(): Observable<IDiscipline[]> {
    return this.http.get(this.url).map((res: Response) => res.json()).share();
  }

  getByTournament(id: number): Observable<IDiscipline[]> {
    return this.http.get(`${this.url}/tournament/${id}`).map((res: Response) => res.json()).share();
  }

  getById(id: number): Observable<IDiscipline> {
    return this.http.get(`${this.url}/${id}`).map((res: Response) => res.json()).share();
  }

  save(discipline: IDiscipline) {
    const call = (discipline.id) ? this.http.put(`${this.url}/${discipline.id}`, discipline) : this.http.post(this.url, discipline);
    return call.map((res: Response) => res.json());
  }

  saveAll(disciplines: IDiscipline[]) {
    return this.http.post(this.url, disciplines).map((res: Response) => res.json());
  }

  delete(discipline: IDiscipline) {
    return this.http.delete(`${this.url}/${discipline.id}`);
  }
}
