-- Migration: Remove permission column from workspace_members table
-- Date: 2025-11-16

BEGIN;

-- Drop the index on permission column
DROP INDEX IF EXISTS "IDX_workspace_members_permission";

-- Drop the permission column
ALTER TABLE workspace_members DROP COLUMN IF EXISTS permission;

COMMIT;
