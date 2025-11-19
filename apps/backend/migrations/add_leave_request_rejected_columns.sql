-- Add acceptedById, acceptedAt, rejectedById, rejectedAt columns to leave_requests table
-- and rename approvedById/approvedAt to acceptedById/acceptedAt for consistency

-- Rename existing columns
ALTER TABLE leave_requests 
  RENAME COLUMN "approvedById" TO "acceptedById";

ALTER TABLE leave_requests 
  RENAME COLUMN "approvedAt" TO "acceptedAt";

-- Add new rejected columns
ALTER TABLE leave_requests 
  ADD COLUMN IF NOT EXISTS "rejectedById" uuid;

ALTER TABLE leave_requests 
  ADD COLUMN IF NOT EXISTS "rejectedAt" timestamp;

-- Add foreign key constraint for rejectedById
ALTER TABLE leave_requests 
  ADD CONSTRAINT "FK_leave_requests_rejectedBy" 
  FOREIGN KEY ("rejectedById") 
  REFERENCES workspace_members(id) 
  ON DELETE SET NULL;

-- Update the foreign key name for acceptedById (if it exists with old name)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'FK_leave_requests_approvedBy'
  ) THEN
    ALTER TABLE leave_requests 
      DROP CONSTRAINT "FK_leave_requests_approvedBy";
    
    ALTER TABLE leave_requests 
      ADD CONSTRAINT "FK_leave_requests_acceptedBy" 
      FOREIGN KEY ("acceptedById") 
      REFERENCES workspace_members(id) 
      ON DELETE SET NULL;
  END IF;
END $$;
