import {Connection, EntityManager, MigrationInterface, QueryRunner} from 'typeorm';

export class ScheduleTrainingTime1504970861402 implements MigrationInterface {

  public async up(queryRunner: QueryRunner, connection: Connection, entityManager?: EntityManager): Promise<any> {
    await queryRunner.insert('configuration', {
      name: 'scheduleTrainingTime',
      value: '3'
    });
  }

  public async down(queryRunner: QueryRunner, connection: Connection, entityManager?: EntityManager): Promise<any> {
    await queryRunner.delete('configuration', { 'name': 'scheduleTrainingTime' });
  }
}
