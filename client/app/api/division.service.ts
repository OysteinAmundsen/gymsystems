import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';

import { ApiService } from './ApiService';
import { IDivision } from './model/IDivision';

@Injectable()
export class DivisionService extends ApiService {
  url: string = '/api/divisions';

  constructor(private http: Http) {
    super();
  }

  all(): Observable<IDivision[]> {
    return this.http.get(this.url).map((res: Response) => res.json()).share().catch(this.handleError);
  }

  getByTournament(id: number): Observable<IDivision[]> {
    return this.http.get(`${this.url}/tournament/${id}`).map((res: Response) => res.json()).share().catch(this.handleError);
  }

  getById(id: number): Observable<IDivision> {
    return this.http.get(`${this.url}/${id}`).map((res: Response) => res.json()).share().catch(this.handleError);
  }

  save(division: IDivision) {
    const call = (division.id) ? this.http.put(`${this.url}/${division.id}`, division) : this.http.post(this.url, division);
    return call.map((res: Response) => res.json()).catch(this.handleError);
  }

  saveAll(divisions: IDivision[]) {
    return this.http.post(this.url, divisions).map((res: Response) => res.json()).catch(this.handleError);
  }

  delete(division: IDivision) {
    return this.http.delete(`${this.url}/${division.id}`);
  }
}
