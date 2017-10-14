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
        { type: DivisionType.Gender, name: 'Kvinner',  sortOrder: 1 },
        { type: DivisionType.Gender, name: 'Herrer',   sortOrder: 2 },
        { type: DivisionType.Gender, name: 'Mix',      sortOrder: 0 },
        { type: DivisionType.Age,    name: 'Aspirant', sortOrder: 0, min: 8, max: 11 },
        { type: DivisionType.Age,    name: 'Rekrutt',  sortOrder: 1, min: 11, max: 13 },
        { type: DivisionType.Age,    name: 'Junior',   sortOrder: 2, min: 13, max: 17 },
        { type: DivisionType.Age,    name: 'Senior',   sortOrder: 3, min: 16, max: 99 }
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
    { name: 'display', value: {
      display1:
`{{~#list current len=1 ~}}
  {{~#size 3~}}
    <b>{{team.name}}</b>
  {{~/size~}}
  {{#center ~}}
    {{~#size 2 ~}}
      {{division}} {{discipline.name}}
    {{~/size ~}}
  {{~/center~}}
{{~/list~}}
{{#center ~}}
  -----------------------------
{{~/center~}}
{{#list next len=2 ~}}
  {{~#size 1~}}
    <b>{{team.name}}</b>
    {{division}} {{disciplineName}}
  {{~/size~}}
{{~/list}}`,
      display2:
`{{~#list published len=1 ~}}
  {{~#size 3 ~}}
    <b>{{team.name}}</b>
  {{~/size~}}
  {{~#center ~}}
    {{~#size 2 ~}}
      {{division}} {{disciplineName}}
    {{~/size~}}
  {{~/center~}}
  {{#center ~}}
    -----------------------------
  {{~/center~}}
  {{#center ~}}
    {{#size 5 ~}}
      {{#fix total len=3}}{{/fix}}
    {{~/size ~}}
  {{~/center}}
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
