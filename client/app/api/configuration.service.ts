import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { ApiService } from './ApiService';
import { IConfiguration } from './model/IConfiguration';

@Injectable()
export class ConfigurationService extends ApiService {
  url: string = '/api/configuration';

  constructor(private http: Http) {
    super();
  }

  all(): Observable<IConfiguration[]> {
    return this.http.get(this.url).map((res: Response) => res.json()).share().catch(this.handleError);
  }

  getByname(name: string): Observable<IConfiguration> {
    return this.http.get(`${this.url}/${name}`).map((res: Response) => res.json()).catch(this.handleError);
  }

  save(configuration: IConfiguration) {
    const call = (configuration.name) ? this.http.put(`${this.url}/${configuration.name}`, configuration) : this.http.post(this.url, configuration);
    return call.map((res: Response) => res.json()).catch(this.handleError);
  }

  delete(configuration: IConfiguration) {
    return this.http.delete(`${this.url}/${configuration.name}`);
  }
}
