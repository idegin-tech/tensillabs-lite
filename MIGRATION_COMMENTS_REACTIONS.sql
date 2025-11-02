-- Migration: Add reactions to comments and commentId to files
-- Date: 2025-11-02
-- Description: Add support for reactions on comments and link files to comments

-- Add reactions column to comments table
ALTER TABLE comments ADD COLUMN IF NOT EXISTS reactions JSONB DEFAULT '[]';

-- Add listId and spaceId to comments for better organization
ALTER TABLE comments ADD COLUMN IF NOT EXISTS "listId" UUID;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS "spaceId" UUID;

-- Add commentId and listId to files table for linking files to comments
ALTER TABLE files ADD COLUMN IF NOT EXISTS "commentId" UUID;
ALTER TABLE files ADD COLUMN IF NOT EXISTS "listId" UUID;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "IDX_files_commentId" ON files("commentId");
CREATE INDEX IF NOT EXISTS "IDX_files_listId" ON files("listId");
CREATE INDEX IF NOT EXISTS "IDX_comments_listId" ON comments("listId");
CREATE INDEX IF NOT EXISTS "IDX_comments_spaceId" ON comments("spaceId");

-- Add comments
COMMENT ON COLUMN comments.reactions IS 'JSONB array of reactions with structure: [{"emoji": "👍", "memberIds": ["uuid1", "uuid2"]}]';
COMMENT ON COLUMN files."commentId" IS 'Reference to comment if file is attached to a comment';
COMMENT ON COLUMN files."listId" IS 'Reference to list for better organization';
COMMENT ON COLUMN comments."listId" IS 'Reference to list for better organization';
COMMENT ON COLUMN comments."spaceId" IS 'Reference to space for better organization';
