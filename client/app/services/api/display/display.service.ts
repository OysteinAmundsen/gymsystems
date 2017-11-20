import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class DisplayService {

  constructor(private http: HttpClient) { }

  getAll(tournamentId: number): Observable<any> {
    return this.http.get(`/api/display/${tournamentId}`);
  }

  getDisplay(tournamentId: number, displayId: number): Observable<any> {
    return this.http.get(`/api/display/${tournamentId}/${displayId}`, {responseType: 'text'});
  }
}
