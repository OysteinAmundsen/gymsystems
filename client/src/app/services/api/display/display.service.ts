import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DisplayService {

  constructor(private http: HttpClient) { }

  /**
   *
   */
  getAll(tournamentId: number, current?: number): Observable<any> {
    let params;
    if (current) {
      params = { params: { current: current } };
    }
    return this.http.get(`/api/display/${tournamentId}`, params);
  }

  /**
   *
   */
  getDisplay(tournamentId: number, displayId: number): Observable<any> {
    return this.http.get(`/api/display/${tournamentId}/${displayId}`, { responseType: 'text' });
  }
}
