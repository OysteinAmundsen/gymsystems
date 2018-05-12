import { User } from './../model/User';
import { Configuration } from './../model/Configuration';
import { MigrationInterface, QueryRunner, getConnection, Connection, EntityManager } from 'typeorm';
import { DivisionType } from '../model/Division';
import { Role } from '../model/User';
import * as bcrypt from 'bcryptjs';
import { Judge } from 'app/model';
export class FirstReleaseChanges1487003618914 implements MigrationInterface {

  async up(queryRunner: QueryRunner): Promise<any> { // Next-gen Typeorm
    const judge = await getConnection().createQueryBuilder().insert().into(Judge).values([{name: 'System'}]).execute();
    await getConnection().createQueryBuilder()
      .insert()
      .into(Configuration)
      .values([
        { name: 'defaultValues',
          value: JSON.stringify({
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
              { name: 'Composition', type: 'C',  operation: 1, judges: [judge], max: 5,  min: 0 },
              { name: 'Execution',   type: 'E',  operation: 1, judges: [judge], max: 10, min: 0 },
              { name: 'Difficulty',  type: 'D',  operation: 1, judges: [judge], max: 5,  min: 0 },
              { name: 'Adjustments', type: 'HJ', operation: 2, judges: [judge], max: 5,  min: 0 }
            ],
          })
        },
        { name: 'display',
          value: JSON.stringify({
            'display1' : '{{~#list current len=1 ~}}\n  {{#center ~}}\n    {{~#size 4~}}<em>{{team.name}}</em>{{~/size}}\n    {{#size 2~}}\n      {{division}} {{discipline.name}}\n    {{~/size}}\n  {{~/center~}}\n{{~/list~}}\n{{#if current.length}}{{#center ~}}\n  -----------------------------\n{{~/center~}}{{/if}}\n{{#list next len=2 ~}}\n  {{~#size 1~}}\n    <em>{{team.name}}</em>\n    {{division}} {{disciplineName}}\n  {{~/size~}}\n{{~/list}}',
            'display2' : '{{#list published len=1}}\n  {{#center}}\n    {{#size 3~}}<em>{{team.name}}</em>{{~/size}}\n    {{#size 2~}}\n      {{division}} {{discipline.name}}\n    {{~/size}}\n  {{~/center~}}\n  {{#if team}}{{#center ~}}\n  -----------------------------\n  {{~/center~}}{{/if}}\n  {{#center ~}}\n    {{#size 5~}}\n      <b>{{#fix total len=3}}{{/fix}}</b>\n    {{~/size}}\n  {{/center}}\n{{/list}}'
          })
        },
        {
          name: 'scheduleExecutionTime',
          value: '5'
        },
        {
          name: 'scheduleTrainingTime',
          value: '3'
        }])
      .execute();

    await getConnection().createQueryBuilder().insert().into(User).values([{
      name: 'admin', password: '$2a$08$1L59S.CUKs6Sq23eq8B4xup0QJZ31QLtdQyOyQsvlxf0PqfQeltw6', role: Role.Admin
    }]).execute();
  }

  async down(queryRunner: QueryRunner): Promise<any> { // Next-gen Typeorm
    await getConnection().createQueryBuilder().delete().from(Configuration).where({ 'name': 'defaultValues' }).execute();
    await getConnection().createQueryBuilder().delete().from(Configuration).where({ 'name': 'display' }).execute();
    await getConnection().createQueryBuilder().delete().from(Configuration).where({ 'name': 'scheduleExecutionTime' }).execute();
    await getConnection().createQueryBuilder().delete().from(Configuration).where({ 'name': 'scheduleTrainingTime' }).execute();
    await getConnection().createQueryBuilder().delete().from(Configuration).where({ 'name': 'ageLimits' }).execute();

    await getConnection().createQueryBuilder().delete().from(User).where({ 'name': 'admin' }).execute();
  }
}
