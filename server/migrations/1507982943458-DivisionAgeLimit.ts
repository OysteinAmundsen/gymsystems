import { MigrationInterface, QueryRunner } from 'typeorm';
import { DivisionType } from '../model/Division';

export class DivisionAgeLimit1507982943458 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.update('configuration', {
      value: JSON.stringify({
        division: [
          { type: DivisionType.Gender, name: 'Kvinner',  sortOrder: 1 },
          { type: DivisionType.Gender, name: 'Herrer',   sortOrder: 2 },
          { type: DivisionType.Gender, name: 'Mix',      sortOrder: 0 },
          { type: DivisionType.Age,    name: 'Aspirant', sortOrder: 0, min: 8, max: 11 },
          { type: DivisionType.Age,    name: 'Rekrutt',  sortOrder: 1, min: 11, max: 13 },
          { type: DivisionType.Age,    name: 'Junior',   sortOrder: 2, min: 13, max: 17 },
          { type: DivisionType.Age,    name: 'Senior',   sortOrder: 3, min: 16, max: 99 }
        ],
        discipline: [
          { name: 'Trampett', sortOrder: 1 }, { name: 'Tumbling', sortOrder: 2 }, { name: 'Frittstående', sortOrder: 0 }
        ],
        scoreGroup: [
          { name: 'Composition', type: 'C',  operation: 1, judges: 2, max: 5,  min: 0 },
          { name: 'Execution',   type: 'E',  operation: 1, judges: 4, max: 10, min: 0 },
          { name: 'Difficulty',  type: 'D',  operation: 1, judges: 2, max: 5,  min: 0 },
          { name: 'Adjustments', type: 'HJ', operation: 2, judges: 1, max: 5,  min: 0 }
        ],
      })}, {name: 'defaultValues'});
      await queryRunner.update('division', { min: 8, max: 11}, {name: 'Aspirant'});
      await queryRunner.update('division', { min: 11, max: 13}, {name: 'Rekrutt'});
      await queryRunner.update('division', { min: 13, max: 17}, {name: 'Junior'});
      await queryRunner.update('division', { min: 16, max: 99}, {name: 'Senior'});
      await queryRunner.delete('configuration', {name: 'ageLimits'});
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
  }
}
