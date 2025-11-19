-- Add employeeId column as nullable first
ALTER TABLE "leave_requests" ADD COLUMN "employeeId" uuid;

-- Update existing records to set employeeId from memberId
-- This assumes each member has a corresponding employee record
UPDATE "leave_requests" lr
SET "employeeId" = e.id
FROM employees e
WHERE lr."memberId" = e."memberId";

-- Now make the column NOT NULL
ALTER TABLE "leave_requests" ALTER COLUMN "employeeId" SET NOT NULL;

-- Add foreign key constraint
ALTER TABLE "leave_requests" 
ADD CONSTRAINT "FK_leave_requests_employee" 
FOREIGN KEY ("employeeId") REFERENCES "employees"("id") 
ON DELETE CASCADE;
