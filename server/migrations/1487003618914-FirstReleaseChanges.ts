import { MigrationInterface, QueryRunner, Connection, EntityManager } from "typeorm";
import { DivisionType } from '../model/Division';

export class FirstReleaseChanges1487003618914 implements MigrationInterface {

  async up(queryRunner: QueryRunner, connection: Connection, entityManager?: EntityManager): Promise<any> {
    await queryRunner.insert('configuration', {
      name: 'defaultValues',
      value: JSON.stringify({
        division: [
          { type: DivisionType.Gender, name: 'Kvinner' },
          { type: DivisionType.Gender, name: 'Herrer' },
          { type: DivisionType.Gender, name: 'Mix' },
          { type: DivisionType.Age, name: 'Rekrutt' },
          { type: DivisionType.Age, name: 'Junior' },
          { type: DivisionType.Age, name: 'Senior' }
        ],
        discipline: [
          { name: 'Trampett' }, { name: 'Tumbling' }, { name: 'Frittstående' }
        ],
        scoreGroup: [
          { name: 'Composition', type: 'C', operation: 1, judges: 2, max: 5, min: 0 },
          { name: 'Execution', type: 'E', operation: 1, judges: 4, max: 10, min: 0 },
          { name: 'Difficulty', type: 'D', operation: 1, judges: 2, max: 5, min: 0 },
          { name: 'Adjustments', type: 'HJ', operation: 2, judges: 1, max: 5, min: 0 }
        ],
      })
    });

  }

  async down(queryRunner: QueryRunner, connection: Connection, entityManager?: EntityManager): Promise<any> {
    await queryRunner.delete('configuration', { 'name': 'defaultValues' });
  }
}
