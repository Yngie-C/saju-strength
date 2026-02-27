// ==========================================
// POST /api/survey/submit 라우트 테스트
// ==========================================

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─────────────────────────────────────────
// 모킹: Supabase
// ─────────────────────────────────────────
const mockUpsert = vi.fn().mockResolvedValue({ error: null });
const mockDelete = vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) });
const mockInsert = vi.fn().mockResolvedValue({ error: null });
const mockUpdate = vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) });

const mockFrom = vi.fn().mockReturnValue({
  upsert: mockUpsert,
  delete: mockDelete,
  insert: mockInsert,
  update: mockUpdate,
});

vi.mock('@/lib/supabase/server', () => ({
  getSupabaseAdmin: vi.fn(() => ({
    from: mockFrom,
  })),
}));

// ─────────────────────────────────────────
// 모킹: SurveyAnalyzerAgent
// ─────────────────────────────────────────
const mockAgentProcess = vi.fn();

vi.mock('@/agents/survey-analyzer', () => ({
  SurveyAnalyzerAgent: vi.fn().mockImplementation(() => ({
    process: mockAgentProcess,
  })),
}));

// ─────────────────────────────────────────
// 라우트 핸들러 임포트 (모킹 이후)
// ─────────────────────────────────────────
import { POST } from '../survey/submit/route';

// ─────────────────────────────────────────
// 테스트 헬퍼
// ─────────────────────────────────────────

const VALID_SESSION_ID = 'dev-test-session';

/** 유효한 30개 답변 배열을 생성한다 */
function makeAnswers(count: number = 30) {
  const categories = ['innovation', 'execution', 'influence', 'collaboration', 'resilience'];
  return Array.from({ length: count }, (_, i) => ({
    questionId: `q${i + 1}`,
    questionNumber: i + 1,
    category: categories[i % 5],
    score: 4,
  }));
}

/** Request 객체를 생성한다 */
function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/survey/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/** 잘못된 JSON을 가진 Request를 생성한다 */
function makeMalformedRequest(): Request {
  return new Request('http://localhost/api/survey/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{invalid json',
  });
}

/** 성공적인 BriefAnalysis 응답을 반환하도록 에이전트를 설정한다 */
function setupSuccessfulAgent() {
  mockAgentProcess.mockResolvedValue({
    success: true,
    data: {
      sessionId: VALID_SESSION_ID,
      categoryScores: [],
      totalScore: 75,
      persona: { type: 'ARCHITECT', title: '설계자' },
      topCategories: ['innovation', 'execution'],
      strengthsSummary: '테스트 요약',
      brandingKeywords: ['혁신', '실행', '협업'],
      radarData: [],
      analyzedAt: new Date(),
    },
  });
}

// ─────────────────────────────────────────
// 테스트 스위트
// ─────────────────────────────────────────

describe('POST /api/survey/submit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Supabase 체인 메서드 재설정
    mockDelete.mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) });
    mockUpdate.mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) });
    mockUpsert.mockResolvedValue({ error: null });
    mockInsert.mockResolvedValue({ error: null });
    mockFrom.mockReturnValue({
      upsert: mockUpsert,
      delete: mockDelete,
      insert: mockInsert,
      update: mockUpdate,
    });
  });

  // ─────────────────────────────────────
  // 1. 유효하지 않은 JSON
  // ─────────────────────────────────────

  describe('잘못된 요청 본문', () => {
    it('유효하지 않은 JSON 본문이면 400을 반환한다', async () => {
      const response = await POST(makeMalformedRequest());
      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json.error).toBeDefined();
    });
  });

  // ─────────────────────────────────────
  // 2. 필드 유효성 검사
  // ─────────────────────────────────────

  describe('필수 필드 검증', () => {
    it('sessionId가 없으면 400을 반환한다', async () => {
      const body = { answers: makeAnswers(30) };
      const response = await POST(makeRequest(body));
      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json.error).toBeDefined();
    });

    it('answers가 없으면 400을 반환한다', async () => {
      const body = { sessionId: VALID_SESSION_ID };
      const response = await POST(makeRequest(body));
      expect(response.status).toBe(400);
    });

    it('answers가 배열이 아니면 400을 반환한다', async () => {
      const body = { sessionId: VALID_SESSION_ID, answers: 'not-an-array' };
      const response = await POST(makeRequest(body));
      expect(response.status).toBe(400);
    });

    it('요청 본문이 null이면 400을 반환한다', async () => {
      const response = await POST(makeRequest(null));
      expect(response.status).toBe(400);
    });
  });

  // ─────────────────────────────────────
  // 3. 답변 개수 검증
  // ─────────────────────────────────────

  describe('답변 개수 검증', () => {
    it('answers가 29개이면 400을 반환한다', async () => {
      const body = { sessionId: VALID_SESSION_ID, answers: makeAnswers(29) };
      const response = await POST(makeRequest(body));
      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json.error).toContain('30개 또는 60개');
    });

    it('answers가 31개이면 400을 반환한다', async () => {
      const body = { sessionId: VALID_SESSION_ID, answers: makeAnswers(31) };
      const response = await POST(makeRequest(body));
      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json.error).toContain('30개 또는 60개');
    });

    it('answers가 0개이면 400을 반환한다', async () => {
      const body = { sessionId: VALID_SESSION_ID, answers: [] };
      const response = await POST(makeRequest(body));
      // 0개는 isValidSurveySubmitBody를 통과하지만 length 검사에서 걸림
      expect(response.status).toBe(400);
    });

    it('answers가 30개이면 유효성 검사를 통과한다', async () => {
      setupSuccessfulAgent();
      const body = { sessionId: VALID_SESSION_ID, answers: makeAnswers(30) };
      const response = await POST(makeRequest(body));
      // 200 또는 에이전트 처리 결과를 확인
      expect(response.status).not.toBe(400);
    });

    it('answers가 60개이면 유효성 검사를 통과한다', async () => {
      setupSuccessfulAgent();
      const body = { sessionId: VALID_SESSION_ID, answers: makeAnswers(60) };
      const response = await POST(makeRequest(body));
      expect(response.status).not.toBe(400);
    });
  });

  // ─────────────────────────────────────
  // 4. 성공 경로
  // ─────────────────────────────────────

  describe('성공 경로', () => {
    it('에이전트가 성공을 반환하면 200과 분석 데이터를 반환한다', async () => {
      setupSuccessfulAgent();
      const body = { sessionId: VALID_SESSION_ID, answers: makeAnswers(30) };
      const response = await POST(makeRequest(body));

      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json.sessionId).toBe(VALID_SESSION_ID);
      expect(json.totalScore).toBeDefined();
    });

    it('에이전트가 호출될 때 올바른 sessionId와 answers가 전달된다', async () => {
      setupSuccessfulAgent();
      const answers = makeAnswers(30);
      const body = { sessionId: VALID_SESSION_ID, answers };
      await POST(makeRequest(body));

      expect(mockAgentProcess).toHaveBeenCalledOnce();
      const callArgs = mockAgentProcess.mock.calls[0];
      expect(callArgs[0].sessionId).toBe(VALID_SESSION_ID);
      expect(callArgs[0].answers).toHaveLength(30);
    });

    it('completionTimeSeconds 필드가 있으면 에이전트에 전달된다', async () => {
      setupSuccessfulAgent();
      const body = {
        sessionId: VALID_SESSION_ID,
        answers: makeAnswers(30),
        completionTimeSeconds: 120,
      };
      await POST(makeRequest(body));
      expect(mockAgentProcess).toHaveBeenCalledOnce();
    });
  });

  // ─────────────────────────────────────
  // 5. 에이전트 실패 처리
  // ─────────────────────────────────────

  describe('에이전트 실패 처리', () => {
    it('에이전트가 실패를 반환하면 500을 반환한다', async () => {
      mockAgentProcess.mockResolvedValue({
        success: false,
        error: '분석 실패',
      });

      const body = { sessionId: VALID_SESSION_ID, answers: makeAnswers(30) };
      const response = await POST(makeRequest(body));

      expect(response.status).toBe(500);
      const json = await response.json();
      expect(json.error).toBeDefined();
    });

    it('에이전트가 예외를 던지면 500을 반환한다', async () => {
      mockAgentProcess.mockRejectedValue(new Error('예상치 못한 오류'));

      const body = { sessionId: VALID_SESSION_ID, answers: makeAnswers(30) };
      const response = await POST(makeRequest(body));

      expect(response.status).toBe(500);
    });
  });

  // ─────────────────────────────────────
  // 6. Supabase 오류 무시 (응답에 영향 없음)
  // ─────────────────────────────────────

  describe('Supabase 오류는 응답에 영향을 미치지 않는다', () => {
    it('Supabase upsert가 실패해도 200을 반환한다', async () => {
      setupSuccessfulAgent();
      mockUpsert.mockResolvedValue({ error: new Error('DB error') });

      const body = { sessionId: VALID_SESSION_ID, answers: makeAnswers(30) };
      const response = await POST(makeRequest(body));

      expect(response.status).toBe(200);
    });
  });
});
