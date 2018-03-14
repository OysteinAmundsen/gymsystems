import { Injectable } from '@angular/core';
import { IJudge } from 'app/model/IJudge';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Helper } from 'app/services/api/Helper';

@Injectable()
export class JudgeService {
  url = '/api/judges';

  constructor(private http: HttpClient) {  }

  /**
   *
   */
  all(): Observable<IJudge[]> {
    return this.http.get<IJudge[]>(this.url);
  }

  /**
   *
   * @param judge
   */
  save(judge: IJudge): Observable<IJudge> {
    const val = Helper.reduceLevels(judge, 2);
    if (!judge.id) { delete judge.id; }
    return (judge.id)
      ? this.http.put<IJudge>(`${this.url}/${judge.id}`, val)
      : this.http.post<IJudge>(this.url, val);
  }
}
