import { IScoreGroup } from './model/IScoreGroup';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ApiService } from './ApiService';

@Injectable()
export class ScoreService extends ApiService {
  url: string = '/api/scoregroups';

  constructor(private http: Http) {
    super();
  }

  all(): Observable<IScoreGroup[]> {
    return this.http.get(this.url).map((res: Response) => res.json()).catch(this.handleError);
  }

  getById(id: number): Observable<IScoreGroup> {
    return this.http.get(this.url + '/' + id).map((res: Response) => res.json()).catch(this.handleError);
  }

  save(scoreGroup: IScoreGroup) {
    let call = (scoreGroup.id) ? this.http.put(`${this.url}/${scoreGroup.id}`, scoreGroup) : this.http.post(this.url, scoreGroup);
    return call.map((res: Response) => res.json()).catch(this.handleError);
  }

  delete(scoreGroup: IScoreGroup) {
    return this.http.delete(`${this.url}/${scoreGroup.id}`);
  }
}
