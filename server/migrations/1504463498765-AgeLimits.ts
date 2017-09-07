import { Connection, EntityManager, MigrationInterface, QueryRunner } from 'typeorm';

export class AgeLimits1504463498765 implements MigrationInterface {

  public async up(queryRunner: QueryRunner, connection: Connection, entityManager?: EntityManager): Promise<any> {
    await queryRunner.insert('configuration', {
      name: 'ageLimits',
      value: JSON.stringify({
        aspirant: { min: 8, max: 11 },
        rekrutt: { min: 11, max: 13 },
        junior: { min: 13, max: 17 },
        senior: { min: 16, max: 99 },
      })
    });
  }

  public async down(queryRunner: QueryRunner, connection: Connection, entityManager?: EntityManager): Promise<any> {
    await queryRunner.delete('configuration', { 'name': 'ageLimits' });
  }

}
