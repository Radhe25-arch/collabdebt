-- ── Tech Profile columns for CollabConnect™ ───────────────────────────────
-- Run this in Supabase SQL Editor after 001_init.sql

-- Add tech profile fields to users table
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS tech_roles        text[]    DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS experience_level  text      CHECK (experience_level IN ('student','junior','mid','senior','staff','founder')),
  ADD COLUMN IF NOT EXISTS skills            text[]    DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS collab_goals      text[]    DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS open_to_work      boolean   DEFAULT false,
  ADD COLUMN IF NOT EXISTS availability      text      CHECK (availability IN ('full_time','part_time','weekends','not_available')) DEFAULT 'not_available',
  ADD COLUMN IF NOT EXISTS github_url        text,
  ADD COLUMN IF NOT EXISTS portfolio_url     text,
  ADD COLUMN IF NOT EXISTS linkedin_url      text,
  ADD COLUMN IF NOT EXISTS hourly_rate       integer;  -- in USD, for freelancers

-- Index for fast filtering by tech role and experience
CREATE INDEX IF NOT EXISTS idx_users_tech_roles ON users USING gin(tech_roles);
CREATE INDEX IF NOT EXISTS idx_users_skills ON users USING gin(skills);
CREATE INDEX IF NOT EXISTS idx_users_collab_goals ON users USING gin(collab_goals);
CREATE INDEX IF NOT EXISTS idx_users_experience ON users(experience_level);
CREATE INDEX IF NOT EXISTS idx_users_plan ON users(plan);

-- ── connections table insert policy (was missing) ─────────────────────────
CREATE POLICY IF NOT EXISTS "connections_insert" ON connections
  FOR INSERT WITH CHECK (requester_id = auth.uid());

CREATE POLICY IF NOT EXISTS "connections_select" ON connections
  FOR SELECT USING (
    requester_id = auth.uid() OR receiver_id = auth.uid()
  );

CREATE POLICY IF NOT EXISTS "connections_update" ON connections
  FOR UPDATE USING (
    receiver_id = auth.uid()  -- only receiver can accept/block
  );

-- Allow users to read other users' tech profiles for CollabConnect
-- (extends the existing users_select_own policy to include tech profile data)
DROP POLICY IF EXISTS "users_select_collab" ON users;
CREATE POLICY "users_select_collab" ON users
  FOR SELECT
  USING (
    -- own row
    auth.uid() = id
    OR
    -- workspace members
    workspace_id IN (SELECT workspace_id FROM users WHERE id = auth.uid())
    OR
    -- premium users can browse all tech profiles
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
        AND u.plan IN ('pro','team','enterprise')
    )
  );

-- ── project_collabs table — for pairing devs on shared projects ───────────
CREATE TABLE IF NOT EXISTS project_collabs (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title          text NOT NULL,
  description    text,
  owner_id       uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tech_stack     text[] DEFAULT '{}',
  roles_needed   text[] DEFAULT '{}',
  status         text NOT NULL DEFAULT 'open'
                   CHECK (status IN ('open','in_progress','completed','closed')),
  max_members    integer DEFAULT 4,
  is_paid        boolean DEFAULT false,  -- paid collab sessions require premium
  created_at     timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS project_collab_members (
  project_id  uuid NOT NULL REFERENCES project_collabs(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role        text NOT NULL,
  joined_at   timestamptz DEFAULT now(),
  PRIMARY KEY (project_id, user_id)
);

ALTER TABLE project_collabs ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_collab_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "project_collabs_select" ON project_collabs FOR SELECT USING (true);  -- public browse
CREATE POLICY "project_collabs_insert" ON project_collabs FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "project_collabs_update" ON project_collabs FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "project_collab_members_select" ON project_collab_members FOR SELECT USING (true);
CREATE POLICY "project_collab_members_insert" ON project_collab_members
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Enable realtime for project collabs
ALTER PUBLICATION supabase_realtime ADD TABLE project_collabs;
ALTER PUBLICATION supabase_realtime ADD TABLE connections;
