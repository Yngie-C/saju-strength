-- ==========================================
-- User State Table for Cross-Environment Persistence
-- Used by StateManager (lib/state-manager.ts)
-- Supports: survey progress, saju/psa results
-- ==========================================

-- 1. 사용자 상태 테이블
CREATE TABLE user_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  state_key TEXT NOT NULL,
  state_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_session_key UNIQUE(session_id, state_key)
);

-- 인덱스
CREATE INDEX idx_user_state_session ON user_state(session_id);
CREATE INDEX idx_user_state_key ON user_state(state_key);
CREATE INDEX idx_user_state_updated ON user_state(updated_at);

-- Auto-cleanup: TTL for old state (optional cronjob can delete rows older than 30 days)
-- DELETE FROM user_state WHERE updated_at < NOW() - INTERVAL '30 days';

-- RLS
ALTER TABLE user_state ENABLE ROW LEVEL SECURITY;

-- RLS 정책: service_role 전용 (API 서버가 supabaseAdmin으로 접근)
-- anon 정책 불필요 — 모든 접근은 서버 API 라우트 경유
CREATE POLICY "service_role_all" ON user_state
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
