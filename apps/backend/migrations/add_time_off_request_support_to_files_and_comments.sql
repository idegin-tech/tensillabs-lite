ALTER TABLE files
ADD COLUMN time_off_request_id UUID REFERENCES time_off_requests(id);

CREATE INDEX idx_files_time_off_request_id ON files(time_off_request_id);

ALTER TABLE comments
ADD COLUMN time_off_request_id UUID;

CREATE INDEX idx_comments_time_off_request_id ON comments(time_off_request_id);
