-- Add leaveRequestId column to files table
ALTER TABLE files ADD COLUMN IF NOT EXISTS "leaveRequestId" uuid;

-- Create index on leaveRequestId
CREATE INDEX IF NOT EXISTS "IDX_files_leaveRequestId" ON files ("leaveRequestId");

-- Add comment
COMMENT ON COLUMN files."leaveRequestId" IS 'Reference to the leave request if this file is attached to a leave request';
