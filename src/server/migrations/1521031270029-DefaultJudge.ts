import {MigrationInterface, QueryRunner, getConnection} from 'typeorm';
import { DivisionType } from '../model/Division';
import { Judge } from '../model/Judge';
import { Configuration } from '../model/Configuration';

export class DefaultJudge1521031270029 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      const query = getConnection().createQueryBuilder();
      const judge = await query.insert().into(Judge).values([{name: 'System'}]).execute();
      const defaultValuesObj = await queryRunner.query(`select value from configuration where name = 'defaultValues'`);
      const defaultValues = JSON.parse(defaultValuesObj[0].value);
      defaultValues.scoreGroup = [
        { name: 'Composition', type: 'C',  operation: 1, judges: [judge], max: 5,  min: 0 },
        { name: 'Execution',   type: 'E',  operation: 1, judges: [judge], max: 10, min: 0 },
        { name: 'Difficulty',  type: 'D',  operation: 1, judges: [judge], max: 5,  min: 0 },
        { name: 'Adjustments', type: 'HJ', operation: 2, judges: [judge], max: 5,  min: 0 }
      ];

      await query.update(Configuration).set({value: JSON.stringify(defaultValues)}).where({name: 'defaultValues'}).execute();
     }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await getConnection().createQueryBuilder().delete().from(Judge).where({ 'name': '' }).execute();
    }

}
