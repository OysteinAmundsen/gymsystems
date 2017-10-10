import { Connection, EntityManager, MigrationInterface, QueryRunner } from 'typeorm';

export class ScheduleExecutionTime1494843042816 implements MigrationInterface {

  async up(queryRunner: QueryRunner): Promise<any> { // Next-gen Typeorm
    await queryRunner.insert('configuration', {
      name: 'scheduleExecutionTime',
      value: '5'
    });
  }

  async down(queryRunner: QueryRunner): Promise<any> { // Next-gen Typeorm
    await queryRunner.delete('configuration', { 'name': 'scheduleExecutionTime' });
  }
}
