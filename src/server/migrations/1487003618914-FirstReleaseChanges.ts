import { MigrationInterface, QueryRunner, Connection, EntityManager } from 'typeorm';
import { DivisionType } from '../model/Division';
import { Role } from '../model/User';
import * as bcrypt from 'bcrypt';

export class FirstReleaseChanges1487003618914 implements MigrationInterface {

  async up(queryRunner: QueryRunner): Promise<any> { // Next-gen Typeorm
      await queryRunner.insert('configuration', {
      name: 'defaultValues',
      value: JSON.stringify({
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
      })
    });
    await queryRunner.insert('configuration', {
      name: 'display',
      value: JSON.stringify({
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
      })
    });
    await queryRunner.insert('user', {
      name: 'admin', password: '$2a$08$1L59S.CUKs6Sq23eq8B4xup0QJZ31QLtdQyOyQsvlxf0PqfQeltw6', role: Role.Admin
    });
  }

  async down(queryRunner: QueryRunner): Promise<any> { // Next-gen Typeorm
    await queryRunner.delete('configuration', { 'name': 'defaultValues' });
    await queryRunner.delete('configuration', { 'name': 'display' });
    await queryRunner.delete('user', { 'name': 'admin' });
  }
}