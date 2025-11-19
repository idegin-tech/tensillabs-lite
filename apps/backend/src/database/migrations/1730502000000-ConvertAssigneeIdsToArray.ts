import { MigrationInterface, QueryRunner } from 'typeorm';

export class ConvertAssigneeIdsToArray1730502000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE tasks 
      ADD COLUMN assigneeIds_temp text[];
    `);

    await queryRunner.query(`
      UPDATE tasks 
      SET assigneeIds_temp = string_to_array("assigneeIds", ',')
      WHERE "assigneeIds" IS NOT NULL AND "assigneeIds" != '';
    `);

    await queryRunner.query(`
      UPDATE tasks 
      SET assigneeIds_temp = '{}'
      WHERE "assigneeIds" IS NULL OR "assigneeIds" = '';
    `);

    await queryRunner.query(`
      ALTER TABLE tasks DROP COLUMN "assigneeIds";
    `);

    await queryRunner.query(`
      ALTER TABLE tasks 
      RENAME COLUMN assigneeIds_temp TO "assigneeIds";
    `);

    await queryRunner.query(`
      ALTER TABLE tasks 
      ALTER COLUMN "assigneeIds" SET DEFAULT '{}';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE tasks 
      ADD COLUMN assigneeIds_temp text;
    `);

    await queryRunner.query(`
      UPDATE tasks 
      SET assigneeIds_temp = array_to_string("assigneeIds", ',')
      WHERE "assigneeIds" IS NOT NULL AND cardinality("assigneeIds") > 0;
    `);

    await queryRunner.query(`
      ALTER TABLE tasks DROP COLUMN "assigneeIds";
    `);

    await queryRunner.query(`
      ALTER TABLE tasks 
      RENAME COLUMN assigneeIds_temp TO "assigneeIds";
    `);
  }
}
