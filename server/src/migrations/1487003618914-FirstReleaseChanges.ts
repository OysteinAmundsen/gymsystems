import { MigrationInterface, QueryRunner, getConnection } from 'typeorm';
import { Judge } from '../api/graph/judge/judge.model';
import { Configuration } from '../api/rest/administration/configuration.model';
import { DivisionType } from '../api/graph/division/division.model';
import { User, Role } from '../api/graph/user/user.model';

export class FirstReleaseChanges1487003618914 implements MigrationInterface {

  /**
   * Setting up defaults
   */
  async up(queryRunner: QueryRunner): Promise<any> {
    // Default judge
    const judgeRepo = getConnection().getRepository(Judge);
    let judge = await judgeRepo.createQueryBuilder('judge').where('judge.name = :name', { name: 'System' }).getOne();
    if (!judge) {
      judge = await judgeRepo.save(<Judge>{ name: 'System' });
    }

    // Configuration
    const configRepo = getConnection().getRepository(Configuration);
    await configRepo.save(<Configuration>{
      name: 'defaultValues',
      value: JSON.stringify({
        division: [
          { type: DivisionType.Gender, name: 'Kvinner', sortOrder: 1 },
          { type: DivisionType.Gender, name: 'Herrer', sortOrder: 2 },
          { type: DivisionType.Gender, name: 'Mix', sortOrder: 0 },
          { type: DivisionType.Age, name: 'Aspirant', sortOrder: 0, min: 8, max: 11 },
          { type: DivisionType.Age, name: 'Rekrutt', sortOrder: 1, min: 11, max: 13 },
          { type: DivisionType.Age, name: 'Junior', sortOrder: 2, min: 13, max: 17 },
          { type: DivisionType.Age, name: 'Senior', sortOrder: 3, min: 16, max: 99 }
        ],
        discipline: [
          { name: 'Trampett', sortOrder: 1 }, { name: 'Tumbling', sortOrder: 2 }, { name: 'Frittstående', sortOrder: 0 }
        ],
        scoreGroup: [
          { name: 'Composition', type: 'C', operation: 1, judges: [judge], max: 5, min: 0 },
          { name: 'Execution', type: 'E', operation: 1, judges: [judge], max: 10, min: 0 },
          { name: 'Difficulty', type: 'D', operation: 1, judges: [judge], max: 5, min: 0 },
          { name: 'Adjustments', type: 'HJ', operation: 2, judges: [judge], max: 5, min: 0 }
        ],
      })
    });
    await configRepo.save(<Configuration>{
      name: 'display',
      value: JSON.stringify({
        'display1': `{{~#list current len=1 ~}}
  {{#center ~}}
    {{~#size 4~}}<em>{{team.name}}</em>{{~/size}}
    {{#size 2~}}
      {{division}} {{discipline.name}}
    {{~/size}}
  {{~/center~}}
{{~/list~}}
{{#if current.length}}{{#center ~}}
  -----------------------------
{{~/center~}}{{/if}}
{{#list next len=2 ~}}
  {{~#size 1~}}
    <em>{{team.name}}</em>
    {{division}} {{disciplineName}}
  {{~/size~}}
{{~/list}}`,
        'display2': `{{#list published len=1}}
  {{#center}}
    {{#size 3~}}<em>{{team.name}}</em>{{~/size}}
    {{#size 2~}}
      {{division}} {{discipline.name}}
    {{~/size}}
  {{~/center~}}
  {{#if team}}{{#center ~}}
  -----------------------------
  {{~/center~}}{{/if}}
  {{#center ~}}
    {{#size 5~}}
      <b>{{#fix total len=3}}{{/fix}}</b>
    {{~/size}}
  {{/center}}
{{/list}}`
      })
    });
    await configRepo.save(<Configuration>{ name: 'scheduleExecutionTime', value: '5' });
    await configRepo.save(<Configuration>{ name: 'scheduleTrainingTime', value: '3' });

    // Admin user
    const userRepo = getConnection().getRepository(User);
    let admin = await userRepo.createQueryBuilder('user').where('user.name = :name', { name: 'admin' }).getOne();
    if (!admin) {
      admin = await userRepo.save(<User>{
        name: 'admin', password: '$2b$08$FJ9DlfLkqyQ1.IFS7f2XleMzIvM9KyAZDlbVuNSrkrbaoYnZrEDUy', role: Role.Admin
      });
    }
  }

  /**
   *
   */
  async down(queryRunner: QueryRunner): Promise<any> { // Next-gen Typeorm
    await getConnection().createQueryBuilder().delete().from(Configuration).where({ 'name': 'defaultValues' }).execute();
    await getConnection().createQueryBuilder().delete().from(Configuration).where({ 'name': 'display' }).execute();
    await getConnection().createQueryBuilder().delete().from(Configuration).where({ 'name': 'scheduleExecutionTime' }).execute();
    await getConnection().createQueryBuilder().delete().from(Configuration).where({ 'name': 'scheduleTrainingTime' }).execute();
    await getConnection().createQueryBuilder().delete().from(Configuration).where({ 'name': 'ageLimits' }).execute();

    await getConnection().createQueryBuilder().delete().from(User).where({ 'name': 'admin' }).execute();
  }
}
