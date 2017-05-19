import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

import { IClub } from '../model/IClub';
import { IBelongsToClub } from '../model/IBelongsToClub';

@Injectable()
export class ClubService {

  constructor(private http: Http) { }

  findByName(name: string): Observable<IClub[]> {
    return this.http.get(`/api/clubs?name=${name}`).map((res: Response) => res.json()).share();
  }

  getClub(name: string): Observable<IClub[]> {
    return this.findByName(name);
  }

  saveClub(name: string) {
    return this.http.post('/api/clubs/', { name: name}).map((res: Response) => res.json());
  }

  async validateClub(obj: IBelongsToClub) {
    let club;
    if (typeof obj.club === 'string') {
      let clubs = await this.findByName(obj.club).toPromise();
      if (clubs && clubs.length) {
        club = clubs[0];
      }
      else {
        club = await this.saveClub(obj.club).toPromise();
      }
    }
    return club;
  }
}
