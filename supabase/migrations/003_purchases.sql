-- ==========================================
-- 구매 이력 테이블 (IAP)
-- 앱인토스 인앱결제 기록
-- ==========================================

-- 1. 구매 테이블
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  purchase_token TEXT,
  status TEXT NOT NULL DEFAULT 'completed',
  amount INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'completed', 'refunded', 'failed'))
);

-- 인덱스
CREATE INDEX idx_purchases_session ON purchases(session_id);
CREATE INDEX idx_purchases_product ON purchases(product_id);
CREATE INDEX idx_purchases_session_product ON purchases(session_id, product_id);

-- RLS
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- RLS 정책: service_role 전용 (API 서버가 supabaseAdmin으로 접근)
CREATE POLICY "service_role_all" ON purchases
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
