import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function runMigration() {
  const client = new Client({
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    console.log('Dropping temporary column if exists...');
    await client.query(`
      ALTER TABLE tasks DROP COLUMN IF EXISTS assigneeIds_temp;
    `);

    console.log('Creating temporary column...');
    await client.query(`
      ALTER TABLE tasks 
      ADD COLUMN assigneeIds_temp text[];
    `);

    console.log('Converting and setting data...');
    await client.query(`
      UPDATE tasks 
      SET assigneeIds_temp = CASE 
        WHEN "assigneeIds" IS NULL OR "assigneeIds" = '' THEN ARRAY[]::text[]
        ELSE string_to_array("assigneeIds", ',')
      END;
    `);

    console.log('Dropping old column...');
    await client.query(`
      ALTER TABLE tasks DROP COLUMN IF EXISTS "assigneeIds";
    `);

    console.log('Renaming column...');
    await client.query(`
      ALTER TABLE tasks 
      RENAME COLUMN assigneeIds_temp TO "assigneeIds";
    `);

    console.log('Setting default value...');
    await client.query(`
      ALTER TABLE tasks 
      ALTER COLUMN "assigneeIds" SET DEFAULT '{}';
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
