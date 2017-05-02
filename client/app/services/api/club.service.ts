import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

import { IClub } from '../model/IClub';

@Injectable()
export class ClubService {

  constructor(private http: Http) { }

  findByName(name: string): Observable<IClub[]> {
    return this.http.get(`/api/clubs/?name=${name}`).map((res: Response) => res.json()).share();
  }

  saveClub(name: string) {
    return this.http.post('/api/clubs/', { name: name}).map((res: Response) => res.json());
  }
}
