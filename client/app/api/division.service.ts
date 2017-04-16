import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';

import { IDivision } from './model/IDivision';

@Injectable()
export class DivisionService {
  url: string = '/api/divisions';

  constructor(private http: Http) {  }

  all(): Observable<IDivision[]> {
    return this.http.get(this.url).map((res: Response) => res.json()).share();
  }

  getByTournament(id: number): Observable<IDivision[]> {
    return this.http.get(`${this.url}/tournament/${id}`).map((res: Response) => res.json()).share();
  }

  getById(id: number): Observable<IDivision> {
    return this.http.get(`${this.url}/${id}`).map((res: Response) => res.json()).share();
  }

  save(division: IDivision) {
    const call = (division.id) ? this.http.put(`${this.url}/${division.id}`, division) : this.http.post(this.url, division);
    return call.map((res: Response) => res.json());
  }

  saveAll(divisions: IDivision[]) {
    return this.http.post(this.url, divisions).map((res: Response) => res.json());
  }

  delete(division: IDivision) {
    return this.http.delete(`${this.url}/${division.id}`);
  }
}
