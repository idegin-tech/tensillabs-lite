-- Add new columns to tasks table
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS "estimatedHours" FLOAT,
ADD COLUMN IF NOT EXISTS "actualHours" FLOAT,
ADD COLUMN IF NOT EXISTS "startedAt" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "statusChangedAt" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "dueDate" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "blockedReason" JSONB,
ADD COLUMN IF NOT EXISTS "blockedByTaskIds" TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS "tags" TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS "progress" FLOAT DEFAULT 0;

-- Add tags column to lists table
ALTER TABLE lists 
ADD COLUMN IF NOT EXISTS "tags" JSONB DEFAULT '[]';

-- Add index column to checklists table for ordering
ALTER TABLE checklists 
ADD COLUMN IF NOT EXISTS "index" INTEGER DEFAULT 0;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tasks_dueDate ON tasks("dueDate");
CREATE INDEX IF NOT EXISTS idx_tasks_startedAt ON tasks("startedAt");
CREATE INDEX IF NOT EXISTS idx_tasks_statusChangedAt ON tasks("statusChangedAt");
CREATE INDEX IF NOT EXISTS idx_tasks_tags ON tasks USING GIN("tags");
CREATE INDEX IF NOT EXISTS idx_tasks_blockedByTaskIds ON tasks USING GIN("blockedByTaskIds");

-- Update existing tasks to set statusChangedAt to updatedAt if null
UPDATE tasks 
SET "statusChangedAt" = "updatedAt" 
WHERE "statusChangedAt" IS NULL;

-- Update existing tasks to set dueDate from timeframe.end if available
UPDATE tasks 
SET "dueDate" = (timeframe->>'end')::timestamp 
WHERE timeframe IS NOT NULL 
AND timeframe->>'end' IS NOT NULL 
AND "dueDate" IS NULL;

-- Update existing tasks to set startedAt for in_progress tasks
UPDATE tasks 
SET "startedAt" = "updatedAt" 
WHERE status = 'in_progress' 
AND "startedAt" IS NULL;
