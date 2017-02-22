import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { ApiService } from './ApiService';
import { IDiscipline } from './model/IDiscipline';

@Injectable()
export class DisciplineService extends ApiService {
  url: string = '/api/disciplines';

  _selectedDiscipline: IDiscipline;
  get selected(): IDiscipline { return this._selectedDiscipline; }
  set selected(discipline: IDiscipline) { this._selectedDiscipline = discipline; }

  constructor(private http: Http) {
    super();
  }

  all(): Observable<IDiscipline[]> {
    return this.http.get(this.url).map((res: Response) => res.json()).share().catch(this.handleError);
  }

  getByTournament(id: number): Observable<IDiscipline[]> {
    return this.http.get(`${this.url}/tournament/${id}`).map((res: Response) => res.json()).share().catch(this.handleError);
  }

  getById(id: number): Observable<IDiscipline> {
    return this.http.get(`${this.url}/${id}`).map((res: Response) => res.json()).catch(this.handleError);
  }

  save(discipline: IDiscipline) {
    const call = (discipline.id) ? this.http.put(`${this.url}/${discipline.id}`, discipline) : this.http.post(this.url, discipline);
    return call.map((res: Response) => res.json()).catch(this.handleError);
  }

  delete(discipline: IDiscipline) {
    return this.http.delete(`${this.url}/${discipline.id}`);
  }
}
