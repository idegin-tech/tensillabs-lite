import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function runMigration() {
  const client = new Client({
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    console.log('Adding mentionedMemberIds column...');
    await client.query(`
      ALTER TABLE comments 
      ADD COLUMN IF NOT EXISTS "mentionedMemberIds" text[] DEFAULT '{}';
    `);

    console.log('Creating index on mentionedMemberIds...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS "IDX_comments_mentionedMemberIds" ON comments ("mentionedMemberIds");
    `);

    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
