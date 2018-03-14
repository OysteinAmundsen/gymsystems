import {MigrationInterface, QueryRunner} from 'typeorm';
import { DivisionType } from '../model/Division';

export class DefaultJudge1521031270029 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      const judge = await queryRunner.insert('judge', {
        name: 'System'
      });
      const defaultValuesObj = await queryRunner.query(`select value from configuration where name = 'defaultValues'`);
      const defaultValues = JSON.parse(defaultValuesObj[0].value);
      defaultValues.scoreGroup = [
        { name: 'Composition', type: 'C',  operation: 1, judges: [judge], max: 5,  min: 0 },
        { name: 'Execution',   type: 'E',  operation: 1, judges: [judge], max: 10, min: 0 },
        { name: 'Difficulty',  type: 'D',  operation: 1, judges: [judge], max: 5,  min: 0 },
        { name: 'Adjustments', type: 'HJ', operation: 2, judges: [judge], max: 5,  min: 0 }
      ];

      await queryRunner.update('configuration', {
        value: JSON.stringify(defaultValues)
      }, {name: 'defaultValues'});
     }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.delete('judge', { 'name': '' });
    }

}
