import { Connection, EntityManager, MigrationInterface, QueryRunner } from "typeorm";

export class ScheduleExecutionTime1494843042816 implements MigrationInterface {

  public async up(queryRunner: QueryRunner, connection: Connection, entityManager?: EntityManager): Promise<any> {
    await queryRunner.insert('configuration', {
      name: 'scheduleExecutionTime',
      value: '5'
    });
  }

  public async down(queryRunner: QueryRunner, connection: Connection, entityManager?: EntityManager): Promise<any> {
    await queryRunner.delete('configuration', { 'name': 'scheduleExecutionTime' });
  }
}
