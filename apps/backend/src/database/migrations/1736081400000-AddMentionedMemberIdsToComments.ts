import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMentionedMemberIdsToComments1736081400000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE comments 
      ADD COLUMN "mentionedMemberIds" text[] DEFAULT '{}';
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_comments_mentionedMemberIds" ON comments ("mentionedMemberIds");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "IDX_comments_mentionedMemberIds";
    `);

    await queryRunner.query(`
      ALTER TABLE comments DROP COLUMN "mentionedMemberIds";
    `);
  }
}
