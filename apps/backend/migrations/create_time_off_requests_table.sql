CREATE TYPE time_off_type AS ENUM (
  'PERSONAL',
  'FAMILY_EMERGENCY',
  'MEDICAL_APPOINTMENT',
  'BEREAVEMENT',
  'RELIGIOUS_OBSERVANCE',
  'JURY_DUTY',
  'MILITARY_LEAVE',
  'OTHER'
);

CREATE TYPE time_off_status AS ENUM (
  'PENDING',
  'APPROVED',
  'REJECTED'
);

CREATE TABLE time_off_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES workspace_members(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  type time_off_type NOT NULL,
  status time_off_status NOT NULL DEFAULT 'PENDING',
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  reason TEXT,
  cover_by_id UUID REFERENCES workspace_members(id),
  approved_by_id UUID REFERENCES workspace_members(id),
  approved_at TIMESTAMP,
  rejected_by_id UUID REFERENCES workspace_members(id),
  rejected_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_time_off_requests_workspace_id ON time_off_requests(workspace_id);
CREATE INDEX idx_time_off_requests_member_id ON time_off_requests(member_id);
CREATE INDEX idx_time_off_requests_employee_id ON time_off_requests(employee_id);
CREATE INDEX idx_time_off_requests_status ON time_off_requests(status);
CREATE INDEX idx_time_off_requests_cover_by_id ON time_off_requests(cover_by_id);
