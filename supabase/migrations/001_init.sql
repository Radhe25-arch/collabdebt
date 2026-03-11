-- CollabDebt — Complete Database Schema
-- Run this in Supabase SQL Editor

-- ── Enable UUID generation ─────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── WORKSPACES ─────────────────────────────────────────────────────────────
CREATE TABLE workspaces (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         text NOT NULL,
  owner_id     uuid NOT NULL,
  invite_code  text UNIQUE NOT NULL DEFAULT substr(md5(random()::text), 1, 8),
  plan         text NOT NULL DEFAULT 'free' CHECK (plan IN ('free','pro','team','enterprise')),
  created_at   timestamptz DEFAULT now()
);

-- ── USERS ──────────────────────────────────────────────────────────────────
CREATE TABLE users (
  id               uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email            text UNIQUE NOT NULL,
  name             text NOT NULL,
  username         text UNIQUE,
  bio              text CHECK (char_length(bio) <= 160),
  gender           text,
  user_code        text UNIQUE NOT NULL DEFAULT 'CD#' || lpad(floor(random() * 9999 + 1)::text, 4, '0'),
  plan             text NOT NULL DEFAULT 'free' CHECK (plan IN ('free','pro','team','enterprise')),
  role             text NOT NULL DEFAULT 'developer' CHECK (role IN ('developer','manager','viewer')),
  workspace_id     uuid REFERENCES workspaces(id),
  avatar_url       text,
  onboarding_done  boolean DEFAULT false,
  created_at       timestamptz DEFAULT now(),
  last_seen        timestamptz DEFAULT now()
);

-- ── REPOS ──────────────────────────────────────────────────────────────────
CREATE TABLE repos (
  id               uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id     uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name             text NOT NULL,
  provider         text NOT NULL CHECK (provider IN ('github','gitlab','bitbucket')),
  full_name        text NOT NULL,
  url              text NOT NULL,
  default_branch   text NOT NULL DEFAULT 'main',
  webhook_id       text,
  health_score     integer DEFAULT 100 CHECK (health_score BETWEEN 0 AND 100),
  last_scanned     timestamptz,
  access_token     text,
  created_at       timestamptz DEFAULT now()
);

-- ── DEBT ITEMS ─────────────────────────────────────────────────────────────
CREATE TABLE debt_items (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  repo_id      uuid NOT NULL REFERENCES repos(id) ON DELETE CASCADE,
  title        text NOT NULL,
  description  text NOT NULL DEFAULT '',
  file_path    text NOT NULL,
  line_start   integer NOT NULL DEFAULT 1,
  line_end     integer NOT NULL DEFAULT 1,
  type         text NOT NULL DEFAULT 'todo' CHECK (type IN ('todo','deprecated','complexity','duplicate','dead_code','security','performance')),
  severity     text NOT NULL CHECK (severity IN ('critical','high','medium','low')),
  status       text NOT NULL DEFAULT 'identified' CHECK (status IN ('identified','planned','in_progress','fixed')),
  cost_usd     numeric NOT NULL DEFAULT 0,
  fix_days     numeric NOT NULL DEFAULT 1,
  votes        integer NOT NULL DEFAULT 0,
  assigned_to  uuid REFERENCES users(id),
  pr_url       text,
  fixed_at     timestamptz,
  sprint_id    uuid,
  created_by   text NOT NULL DEFAULT 'scanner' CHECK (created_by IN ('scanner','manual')),
  created_at   timestamptz DEFAULT now()
);

-- ── SPRINTS ────────────────────────────────────────────────────────────────
CREATE TABLE sprints (
  id                 uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id       uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name               text NOT NULL,
  start_date         date NOT NULL,
  end_date           date NOT NULL,
  status             text NOT NULL DEFAULT 'planned' CHECK (status IN ('active','completed','planned')),
  ai_recommendation  text,
  created_at         timestamptz DEFAULT now()
);

-- Add sprint FK to debt_items
ALTER TABLE debt_items ADD CONSTRAINT debt_items_sprint_fk FOREIGN KEY (sprint_id) REFERENCES sprints(id);

-- ── COLLAB SESSIONS ────────────────────────────────────────────────────────
CREATE TABLE collab_sessions (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  token        text UNIQUE NOT NULL,
  host_id      uuid NOT NULL REFERENCES users(id),
  workspace_id uuid NOT NULL REFERENCES workspaces(id),
  repo_id      uuid REFERENCES repos(id),
  file_path    text NOT NULL DEFAULT 'untitled.ts',
  active       boolean DEFAULT true,
  participants uuid[] DEFAULT '{}',
  created_at   timestamptz DEFAULT now(),
  ended_at     timestamptz
);

-- ── MESSAGES ──────────────────────────────────────────────────────────────
CREATE TABLE messages (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id   uuid NOT NULL REFERENCES users(id),
  receiver_id uuid NOT NULL REFERENCES users(id),
  content     text NOT NULL,
  read_at     timestamptz,
  created_at  timestamptz DEFAULT now()
);

-- ── AI USAGE ──────────────────────────────────────────────────────────────
CREATE TABLE ai_usage (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      uuid NOT NULL REFERENCES users(id),
  date         date NOT NULL,
  minutes_used integer NOT NULL DEFAULT 0,
  tokens_used  integer NOT NULL DEFAULT 0,
  updated_at   timestamptz DEFAULT now(),
  UNIQUE (user_id, date)
);

-- ── PAYMENTS ──────────────────────────────────────────────────────────────
CREATE TABLE payments (
  id                  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             uuid NOT NULL REFERENCES users(id),
  plan                text NOT NULL,
  billing             text NOT NULL DEFAULT 'monthly' CHECK (billing IN ('monthly','yearly')),
  amount              numeric NOT NULL,
  currency            text NOT NULL DEFAULT 'INR',
  razorpay_order_id   text,
  razorpay_payment_id text,
  status              text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','success','failed')),
  created_at          timestamptz DEFAULT now()
);

-- ── CONNECTIONS ────────────────────────────────────────────────────────────
CREATE TABLE connections (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id uuid NOT NULL REFERENCES users(id),
  receiver_id  uuid NOT NULL REFERENCES users(id),
  status       text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','blocked')),
  created_at   timestamptz DEFAULT now(),
  UNIQUE (requester_id, receiver_id)
);

-- ── NOTIFICATIONS ──────────────────────────────────────────────────────────
CREATE TABLE notifications (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    uuid NOT NULL REFERENCES users(id),
  type       text NOT NULL CHECK (type IN ('debt_alert','payment','connection','sprint')),
  title      text NOT NULL,
  body       text NOT NULL,
  read       boolean DEFAULT false,
  link       text,
  created_at timestamptz DEFAULT now()
);

-- ── ROW LEVEL SECURITY ────────────────────────────────────────────────────
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE repos ENABLE ROW LEVEL SECURITY;
ALTER TABLE debt_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE collab_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users: can read their own row + workspace members
CREATE POLICY "users_select_own" ON users FOR SELECT USING (
  auth.uid() = id OR
  workspace_id IN (SELECT workspace_id FROM users WHERE id = auth.uid())
);
CREATE POLICY "users_update_own" ON users FOR UPDATE USING (auth.uid() = id);

-- Workspaces: members of workspace can read
CREATE POLICY "workspaces_select" ON workspaces FOR SELECT USING (
  id IN (SELECT workspace_id FROM users WHERE id = auth.uid())
);

-- Repos: workspace members can read
CREATE POLICY "repos_select" ON repos FOR SELECT USING (
  workspace_id IN (SELECT workspace_id FROM users WHERE id = auth.uid())
);

-- Debt items: workspace members can read
CREATE POLICY "debt_items_select" ON debt_items FOR SELECT USING (
  repo_id IN (SELECT id FROM repos WHERE workspace_id IN (
    SELECT workspace_id FROM users WHERE id = auth.uid()
  ))
);
CREATE POLICY "debt_items_insert" ON debt_items FOR INSERT WITH CHECK (
  repo_id IN (SELECT id FROM repos WHERE workspace_id IN (
    SELECT workspace_id FROM users WHERE id = auth.uid()
  ))
);
CREATE POLICY "debt_items_update" ON debt_items FOR UPDATE USING (
  repo_id IN (SELECT id FROM repos WHERE workspace_id IN (
    SELECT workspace_id FROM users WHERE id = auth.uid()
  ))
);

-- AI usage: own rows only
CREATE POLICY "ai_usage_select_own" ON ai_usage FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "ai_usage_insert_own" ON ai_usage FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "ai_usage_update_own" ON ai_usage FOR UPDATE USING (user_id = auth.uid());

-- Payments: own rows only
CREATE POLICY "payments_select_own" ON payments FOR SELECT USING (user_id = auth.uid());

-- Notifications: own rows only
CREATE POLICY "notifications_select_own" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "notifications_update_own" ON notifications FOR UPDATE USING (user_id = auth.uid());

-- Messages: sender or receiver
CREATE POLICY "messages_select" ON messages FOR SELECT USING (
  sender_id = auth.uid() OR receiver_id = auth.uid()
);
CREATE POLICY "messages_insert" ON messages FOR INSERT WITH CHECK (sender_id = auth.uid());

-- ── FUNCTIONS ─────────────────────────────────────────────────────────────
-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO users (id, email, name, user_code)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'CD#' || lpad(floor(random() * 9999 + 1)::text, 4, '0')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Increment AI usage
CREATE OR REPLACE FUNCTION increment_ai_usage(
  p_user_id uuid,
  p_date date,
  p_minutes integer,
  p_tokens integer
)
RETURNS void AS $$
BEGIN
  INSERT INTO ai_usage (user_id, date, minutes_used, tokens_used)
  VALUES (p_user_id, p_date, p_minutes, p_tokens)
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    minutes_used = ai_usage.minutes_used + p_minutes,
    tokens_used = ai_usage.tokens_used + p_tokens,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── INDEXES ────────────────────────────────────────────────────────────────
CREATE INDEX idx_debt_items_repo_id ON debt_items(repo_id);
CREATE INDEX idx_debt_items_status ON debt_items(status);
CREATE INDEX idx_debt_items_severity ON debt_items(severity);
CREATE INDEX idx_debt_items_sprint_id ON debt_items(sprint_id);
CREATE INDEX idx_repos_workspace_id ON repos(workspace_id);
CREATE INDEX idx_users_workspace_id ON users(workspace_id);
CREATE INDEX idx_users_user_code ON users(user_code);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);

-- ── REALTIME ──────────────────────────────────────────────────────────────
-- Enable realtime for live dashboard updates and collab sessions
ALTER PUBLICATION supabase_realtime ADD TABLE debt_items;
ALTER PUBLICATION supabase_realtime ADD TABLE collab_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
