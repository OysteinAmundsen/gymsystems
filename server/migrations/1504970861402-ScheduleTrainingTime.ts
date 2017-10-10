import {Connection, EntityManager, MigrationInterface, QueryRunner} from 'typeorm';

export class ScheduleTrainingTime1504970861402 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.insert('configuration', {
      name: 'scheduleTrainingTime',
      value: '3'
    });
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.delete('configuration', { 'name': 'scheduleTrainingTime' });
  }
}
