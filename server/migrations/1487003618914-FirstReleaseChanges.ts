import { MigrationInterface, QueryRunner, Connection, EntityManager } from "typeorm";

export class FirstReleaseChanges1487003618914 implements MigrationInterface {

  async up(queryRunner: QueryRunner, connection: Connection, entityManager?: EntityManager): Promise<any> {
    await queryRunner.insert('configuration', {
      name: 'defaultValues',
      value: JSON.stringify({
        scoreGroup: [
          { name: 'Composition', type: 'C', operation: 1, judges: 2, max: 5, min: 0 },
          { name: 'Execution', type: 'E', operation: 1, judges: 4, max: 10, min: 0 },
          { name: 'Difficulty', type: 'D', operation: 1, judges: 2, max: 5, min: 0 },
          { name: 'Adjustments', type: 'HJ', operation: 2, judges: 1, max: 5, min: 0 }
        ],
        division: [{ 'name': 'Kvinner' }, { 'name': 'Herrer' }, { 'name': 'Mix' }],
        ageClass: [{ 'name': 'Rekrutt' }, { 'name': 'Junior' }, { 'name': 'Senior' }]
      })
    });

  }

  async down(queryRunner: QueryRunner, connection: Connection, entityManager?: EntityManager): Promise<any> {
    await queryRunner.delete('configuration', { 'name': 'defaultValues' });
  }
}
