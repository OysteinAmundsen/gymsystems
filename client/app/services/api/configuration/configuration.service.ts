import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { IConfiguration } from 'app/model';

@Injectable()
export class ConfigurationService  {
  url = '/api/configuration';

  constructor(private http: HttpClient) {}

  all(): Observable<IConfiguration[]> {
    return this.http.get<IConfiguration[]>(this.url);
  }

  getByname(name: string): Observable<IConfiguration> {
    return this.http.get<IConfiguration>(`${this.url}/${name}`);
  }

  save(configuration: IConfiguration[]) {
    return this.http.post<IConfiguration[]>(this.url, configuration);
  }

  delete(configuration: IConfiguration) {
    return this.http.delete(`${this.url}/${configuration.name}`);
  }
}
