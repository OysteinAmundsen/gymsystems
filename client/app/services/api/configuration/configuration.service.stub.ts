import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { IConfiguration, DivisionType } from 'app/model';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class ConfigurationServiceStub extends ConfigurationService {
  config: IConfiguration[] = [
    {name: 'defaultValues', value: {
      division: [
        { type: DivisionType.Gender, name: 'Kvinner', sortOrder: 1 },
        { type: DivisionType.Gender, name: 'Herrer',  sortOrder: 2 },
        { type: DivisionType.Gender, name: 'Mix',     sortOrder: 0 },
        { type: DivisionType.Age,    name: 'Rekrutt', sortOrder: 0 },
        { type: DivisionType.Age,    name: 'Junior',  sortOrder: 1 },
        { type: DivisionType.Age,    name: 'Senior',  sortOrder: 2 }
      ],
      discipline: [
        { name: 'Trampett', sortOrder: 1 }, { name: 'Tumbling', sortOrder: 2 }, { name: 'Frittstående', sortOrder: 0 }
      ],
      scoreGroup: [
        { name: 'Composition', type: 'C',  operation: 1, judges: 2, max: 5,  min: 0 },
        { name: 'Execution',   type: 'E',  operation: 1, judges: 4, max: 10, min: 0 },
        { name: 'Difficulty',  type: 'D',  operation: 1, judges: 2, max: 5,  min: 0 },
        { name: 'Adjustments', type: 'HJ', operation: 2, judges: 1, max: 5,  min: 0 }
      ],
    }},
    { name: 'scheduleExecutionTime', value: '5' },
    { name: 'scheduleTrainingTime', value: '3' },
    {
      name: 'ageLimits',
      value: {
        aspirant: {min: 8, max: 11},
        rekrutt: {min: 11, max: 13},
        junior: {min: 13, max: 17},
        senior: {min: 16, max: 99},
      }
    },
    {name: 'display', value: {
      display1: `<header>{{tournament.name}}</header>

{{#list next len=3}}
<div>{{team.name}}  {{division}} {{discipline.name}}</div>
{{/list}}`,
      display2: `{{#list published len=1}}
<div>{{team.name}}  {{division}}</div>
<div>{{discipline.name}}</div>
<br>
<div>{{total}}</div>
{{/list}}`
    }}
  ];
  constructor(http: HttpClient) {
    super(http);
  }

  all(): Observable<IConfiguration[]> {
    return Observable.of(this.config);
  }

  getByname(name: string): Observable<IConfiguration> {
    return Observable.of(this.config.find(c => c.name === name));
  }

  save(configuration: IConfiguration[]) {
    return Observable.of(null);
  }

  delete(configuration: IConfiguration) {
    return Observable.of(null);
  }
}
