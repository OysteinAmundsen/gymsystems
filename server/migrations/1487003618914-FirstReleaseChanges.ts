import { MigrationInterface, QueryRunner, Connection, EntityManager } from "typeorm";

export class FirstReleaseChanges1487003618914 implements MigrationInterface {

    async up(queryRunner: QueryRunner, connection: Connection, entityManager?: EntityManager): Promise<any> {
      await queryRunner.insert('discipline', { 'name': 'Frittstående' });
      await queryRunner.insert('discipline', { 'name': 'Tumbling' });
      await queryRunner.insert('discipline', { 'name': 'Trampett' });

      await queryRunner.insert('score_group', { 'name': 'Composition', 'type': 'C', 'judges': 2, 'max': 5, 'min': 0 });
      await queryRunner.insert('score_group', { 'name': 'Execution', 'type': 'E', 'judges': 4, 'max': 10, 'min': 0 });
      await queryRunner.insert('score_group', { 'name': 'Difficulty', 'type': 'D', 'judges': 2, 'max': 5, 'min': 0 });
      await queryRunner.insert('score_group', { 'name': 'Adjustments', 'type': 'HJ', 'judges': 1, 'max': 5, 'min': 0 });
    }

    async down(queryRunner: QueryRunner, connection: Connection, entityManager?: EntityManager): Promise<any> {
      await queryRunner.delete('discipline', { 'name': 'Frittstående' });
      await queryRunner.delete('discipline', { 'name': 'Tumbling' });
      await queryRunner.delete('discipline', { 'name': 'Trampett' });

      await queryRunner.delete('score_group', { 'name': 'Composition', 'type': 'C', 'judges': 2, 'max': 5, 'min': 0 });
      await queryRunner.delete('score_group', { 'name': 'Execution', 'type': 'E', 'judges': 4, 'max': 10, 'min': 0 });
      await queryRunner.delete('score_group', { 'name': 'Difficulty', 'type': 'D', 'judges': 2, 'max': 5, 'min': 0 });
      await queryRunner.delete('score_group', { 'name': 'Adjustments', 'type': 'HJ', 'judges': 1, 'max': 5, 'min': 0 });
    }
}
