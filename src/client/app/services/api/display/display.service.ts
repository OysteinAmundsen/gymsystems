import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs/Observable';

@Injectable()
export class DisplayService {

  constructor(private http: HttpClient) { }

  /**
   *
   * @param tournamentId
   */
  getAll(tournamentId: number): Observable<any> {
    return this.http.get(`/api/display/${tournamentId}`);
  }

  /**
   *
   * @param tournamentId
   * @param displayId
   */
  getDisplay(tournamentId: number, displayId: number): Observable<any> {
    return this.http.get(`/api/display/${tournamentId}/${displayId}`, {responseType: 'text'});
  }
}
