import { MigrationInterface, QueryRunner, Connection, EntityManager } from 'typeorm';
import { DivisionType } from '../model/Division';

export class FirstReleaseChanges1487003618914 implements MigrationInterface {

  async up(queryRunner: QueryRunner, connection: Connection, entityManager?: EntityManager): Promise<any> {
    await queryRunner.insert('configuration', {
      name: 'defaultValues',
      value: JSON.stringify({
        division: [
          { type: DivisionType.Gender, name: 'Kvinner', sortOrder: 1 },
          { type: DivisionType.Gender, name: 'Herrer', sortOrder: 2 },
          { type: DivisionType.Gender, name: 'Mix', sortOrder: 0 },
          { type: DivisionType.Age, name: 'Rekrutt', sortOrder: 0 },
          { type: DivisionType.Age, name: 'Junior', sortOrder: 1 },
          { type: DivisionType.Age, name: 'Senior', sortOrder: 2 }
        ],
        discipline: [
          { name: 'Trampett', sortOrder: 1 }, { name: 'Tumbling', sortOrder: 2 }, { name: 'Frittstående', sortOrder: 0 }
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
