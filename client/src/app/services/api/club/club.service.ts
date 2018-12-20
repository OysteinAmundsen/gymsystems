import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { IClub, IBelongsToClub, IGymnast, ITroop } from 'app/model';
import { Helper } from '../Helper';

@Injectable({ providedIn: 'root' })
export class ClubService {
  url = '/api/clubs';
  constructor(private http: HttpClient) { }

  /**
   *
   */
  findByName(name: string): Observable<IClub[]> {
    return this.http.get<IClub[]>(`${this.url}?name=${name}`);
  }
}
