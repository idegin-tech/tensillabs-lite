ALTER TABLE leave_requests
ADD COLUMN employee_id UUID REFERENCES employees(id);

CREATE INDEX idx_leave_requests_employee_id ON leave_requests(employee_id);

ALTER TABLE leave_requests
RENAME COLUMN accepted_by_id TO approved_by_id;

ALTER TABLE leave_requests
RENAME COLUMN accepted_at TO approved_at;

UPDATE leave_requests lr
SET employee_id = e.id
FROM employees e
WHERE lr.member_id = e.member_id AND lr.workspace_id = e.workspace_id;
