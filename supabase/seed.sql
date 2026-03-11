-- CollabDebt — Seed Data for Development/Testing
-- Run AFTER the migration

-- ── Test workspace ─────────────────────────────────────────────────────────
INSERT INTO workspaces (id, name, owner_id, plan)
VALUES ('00000000-0000-0000-0000-000000000001', 'Acme Corp', '00000000-0000-0000-0000-000000000010', 'team')
ON CONFLICT DO NOTHING;

-- ── Test repos ─────────────────────────────────────────────────────────────
INSERT INTO repos (id, workspace_id, name, provider, full_name, url, health_score, last_scanned)
VALUES
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'api-server', 'github', 'acme/api-server', 'https://github.com/acme/api-server', 42, now() - interval '30 minutes'),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000001', 'frontend-app', 'github', 'acme/frontend-app', 'https://github.com/acme/frontend-app', 71, now() - interval '2 hours'),
  ('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000001', 'payments-service', 'gitlab', 'acme/payments-service', 'https://gitlab.com/acme/payments-service', 28, now() - interval '5 hours')
ON CONFLICT DO NOTHING;

-- ── Test sprint ────────────────────────────────────────────────────────────
INSERT INTO sprints (id, workspace_id, name, start_date, end_date, status)
VALUES ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000001', 'Sprint 14', current_date - 7, current_date + 7, 'active')
ON CONFLICT DO NOTHING;

-- ── Test debt items ────────────────────────────────────────────────────────
INSERT INTO debt_items (repo_id, title, description, file_path, line_start, line_end, type, severity, status, cost_usd, fix_days, votes, created_by)
VALUES
  ('00000000-0000-0000-0000-000000000101', 'Token expiry race condition not handled',
   'The auth token refresh logic has a race condition that can cause users to be logged out unexpectedly during high-traffic periods.',
   'src/auth/token.service.ts', 47, 89, 'security', 'critical', 'identified', 4200, 2, 14, 'scanner'),

  ('00000000-0000-0000-0000-000000000101', 'N+1 query in user dashboard endpoint',
   'The dashboard endpoint fires one DB query per activity record, causing 40-60 queries per request.',
   'src/api/users/dashboard.ts', 123, 145, 'performance', 'high', 'planned', 1800, 1, 9, 'scanner'),

  ('00000000-0000-0000-0000-000000000103', 'Duplicate payment validation logic',
   'Payment validation is duplicated in checkout.ts and cart.ts with subtle differences.',
   'src/payments/checkout.ts', 23, 67, 'duplicate', 'high', 'in_progress', 2400, 3, 7, 'scanner'),

  ('00000000-0000-0000-0000-000000000102', 'Deprecated react-query v3 usage',
   'The app uses react-query v3 APIs that are deprecated in v5.',
   'src/hooks/useUserData.ts', 1, 15, 'deprecated', 'medium', 'identified', 600, 2, 5, 'scanner'),

  ('00000000-0000-0000-0000-000000000101', 'Dead code: unused analytics module',
   'The entire src/analytics/ module (847 lines) is unreachable — no imports found.',
   'src/analytics/tracker.ts', 1, 847, 'dead_code', 'low', 'planned', 150, 0.5, 3, 'scanner')
ON CONFLICT DO NOTHING;
