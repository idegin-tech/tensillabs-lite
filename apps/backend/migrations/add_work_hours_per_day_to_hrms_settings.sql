-- Add workHoursPerDay column to hrms_settings table
ALTER TABLE hrms_settings 
ADD COLUMN IF NOT EXISTS "workHoursPerDay" FLOAT DEFAULT 8;

-- Update existing records to have the default value
UPDATE hrms_settings 
SET "workHoursPerDay" = 8 
WHERE "workHoursPerDay" IS NULL;
