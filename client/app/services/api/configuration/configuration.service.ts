import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';

import { IConfiguration } from 'app/services/model';

@Injectable()
export class ConfigurationService  {
  url = '/api/configuration';

  constructor(private http: Http) {}

  all(): Observable<IConfiguration[]> {
    return this.http.get(this.url).map((res: Response) => res.json()).share();
  }

  getByname(name: string): Observable<IConfiguration> {
    return this.http.get(`${this.url}/${name}`).map((res: Response) => res.json()).share();
  }

  save(configuration: IConfiguration[]) {
    return this.http.post(this.url, configuration)
      .map((res: Response) => res.json());
  }

  delete(configuration: IConfiguration) {
    return this.http.delete(`${this.url}/${configuration.name}`);
  }
}
