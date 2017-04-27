import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';

@Injectable()
export class DisplayService {

  constructor(private http: Http) { }

  getAll(tournamentId: number) {
    return this.http.get(`/api/display/${tournamentId}`).map((res: Response) => res.json()).share();
  }

  getDisplay(tournamentId: number, displayId: number) {
    return this.http.get(`/api/display/${tournamentId}/${displayId}`).map((res: Response) => res.text()).share();
  }
}
