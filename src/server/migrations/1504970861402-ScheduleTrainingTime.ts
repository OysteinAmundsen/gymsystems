import {Connection, EntityManager, MigrationInterface, QueryRunner, getConnection} from 'typeorm';
import { Configuration } from '../model/Configuration';

export class ScheduleTrainingTime1504970861402 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Configuration)
      .values([{
        name: 'scheduleTrainingTime',
        value: '3'
      }])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await getConnection().createQueryBuilder().delete().from(Configuration).where({ 'name': 'scheduleTrainingTime' }).execute();
  }
}
