-- ==========================================
-- Saju-Strength Database Schema (v2)
-- ==========================================

-- 1. 세션 테이블
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  status TEXT DEFAULT 'birth_input',
  survey_completed BOOLEAN DEFAULT false,
  combined_report_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 설문 질문
CREATE TABLE survey_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_number INTEGER NOT NULL,
  category TEXT NOT NULL,
  question_text TEXT NOT NULL,
  question_hint TEXT,
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  is_reverse_scored BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_category CHECK (category IN ('innovation', 'execution', 'influence', 'collaboration', 'resilience'))
);

-- 3. 설문 응답
CREATE TABLE survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  question_id UUID REFERENCES survey_questions(id),
  question_number INTEGER NOT NULL,
  category TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 7),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_session_question UNIQUE(session_id, question_id)
);

-- 4. 사주 분석 결과
CREATE TABLE saju_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  birth_year INTEGER NOT NULL,
  birth_month INTEGER NOT NULL,
  birth_day INTEGER NOT NULL,
  birth_hour INTEGER,
  gender TEXT NOT NULL,
  is_lunar BOOLEAN DEFAULT false,
  year_pillar_stem TEXT NOT NULL,
  year_pillar_branch TEXT NOT NULL,
  month_pillar_stem TEXT NOT NULL,
  month_pillar_branch TEXT NOT NULL,
  day_pillar_stem TEXT NOT NULL,
  day_pillar_branch TEXT NOT NULL,
  hour_pillar_stem TEXT,
  hour_pillar_branch TEXT,
  day_master TEXT NOT NULL,
  day_master_element TEXT NOT NULL,
  archetype TEXT NOT NULL,
  five_elements JSONB NOT NULL,
  element_ranks JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_session_saju UNIQUE(session_id)
);

-- 5. 통합 분석 리포트
CREATE TABLE combined_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  saju_analysis_id UUID REFERENCES saju_analyses(id),
  cross_analysis JSONB NOT NULL,
  growth_guide JSONB NOT NULL,
  persona_type TEXT NOT NULL,
  persona_title TEXT NOT NULL,
  psa_scores JSONB NOT NULL,
  top_categories TEXT[] NOT NULL,
  strengths_summary TEXT NOT NULL,
  branding_keywords TEXT[] NOT NULL,
  radar_data JSONB NOT NULL,
  strength_tips JSONB,
  branding_messages JSONB,
  total_score DECIMAL(5,2),
  completion_time_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_session_combined UNIQUE(session_id)
);

-- 6. 웹 프로필
CREATE TABLE web_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  profile_data JSONB,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. 대기자 명단
CREATE TABLE waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  phone TEXT,
  session_id UUID REFERENCES sessions(id),
  position INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_waitlist_email UNIQUE(email)
);

-- 인덱스
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_sessions_created_at ON sessions(created_at);
CREATE INDEX idx_sessions_email ON sessions(email) WHERE email IS NOT NULL;
CREATE INDEX idx_survey_responses_session ON survey_responses(session_id);
CREATE INDEX idx_saju_analyses_session ON saju_analyses(session_id);
CREATE INDEX idx_combined_reports_session ON combined_reports(session_id);
CREATE INDEX idx_waitlist_created ON waitlist(created_at);

-- RLS
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE saju_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE combined_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- RLS 정책 (보안 강화)
CREATE POLICY "public_read_questions" ON survey_questions FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_profiles" ON web_profiles FOR SELECT USING (is_public = true);
CREATE POLICY "anon_insert_sessions" ON sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_select_sessions" ON sessions FOR SELECT USING (true);
CREATE POLICY "anon_insert_responses" ON survey_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_select_responses" ON survey_responses FOR SELECT USING (true);
CREATE POLICY "anon_insert_saju" ON saju_analyses FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_select_saju" ON saju_analyses FOR SELECT USING (true);
CREATE POLICY "anon_insert_combined" ON combined_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_select_combined" ON combined_reports FOR SELECT USING (true);
CREATE POLICY "anon_insert_profiles" ON web_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_insert_waitlist" ON waitlist FOR INSERT WITH CHECK (true);
