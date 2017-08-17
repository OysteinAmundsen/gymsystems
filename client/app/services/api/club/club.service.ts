import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

import { IClub, IBelongsToClub, IClubContestant } from 'app/services/model';

@Injectable()
export class ClubService {
  url = '/api/clubs';
  constructor(private http: Http) { }

  all(): Observable<IClub[]> {
    return this.http.get(this.url).map((res: Response) => res.json()).share();
  }

  findByName(name: string): Observable<IClub[]> {
    return this.http.get(`${this.url}?name=${name}`).map((res: Response) => res.json()).share();
  }

  getById(id: number): Observable<IClub> {
    return this.http.get(`${this.url}/${id}`).map((res: Response) => res.json()).share();
  }

  saveClub(club: IClub) {
    return (club.id ? this.http.put(`${this.url}/${club.id}`, club) : this.http.post(`${this.url}/`, club))
      .map((res: Response) => res.json());
  }

  deleteClub(club: IClub) {
    return this.http.delete(`${this.url}/${club.id}`).map((res: Response) => res.json());
  }

  getMembers(id: number): Observable<IClubContestant[]> {
    return this.http.get(`${this.url}/${id}/members`).map((res: Response) => res.json());
  }

  saveMember(member: IClubContestant) {
    return this.http.post(`${this.url}/${member.club.id}/members`, member).map((res: Response) => res.json());
  }

  deleteMember(member: IClubContestant): any {
    return this.http.delete(`${this.url}/${member.club.id}/members/${member.id}`).map((res: Response) => res.json());
  }

  // async validateClub(obj: IBelongsToClub) {
  //   let club;
  //   if (typeof obj.club === 'string') {
  //     const clubs = await this.findByName(obj.club).toPromise();
  //     if (clubs && clubs.length) {
  //       club = clubs[0];
  //     } else {
  //       club = await this.createClubFromName(obj.club).toPromise();
  //     }
  //   }
  //   return club;
  // }
}
