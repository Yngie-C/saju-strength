// ==========================================
// POST /api/saju/calculate 라우트 테스트
// ==========================================

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─────────────────────────────────────────
// 모킹: Supabase
// ─────────────────────────────────────────
const mockUpsert = vi.fn().mockResolvedValue({ error: null });
const mockInsert = vi.fn().mockResolvedValue({ error: null });

const mockFrom = vi.fn().mockReturnValue({
  upsert: mockUpsert,
  insert: mockInsert,
});

vi.mock('@/lib/supabase/server', () => ({
  getSupabaseAdmin: vi.fn(() => ({
    from: mockFrom,
  })),
}));

// ─────────────────────────────────────────
// 모킹: SajuAnalyzerAgent
// ─────────────────────────────────────────
const mockAgentProcess = vi.fn();

vi.mock('@/agents/saju-analyzer', () => ({
  SajuAnalyzerAgent: vi.fn().mockImplementation(() => ({
    process: mockAgentProcess,
  })),
}));

// ─────────────────────────────────────────
// 라우트 핸들러 임포트 (모킹 이후)
// ─────────────────────────────────────────
import { POST } from '../saju/calculate/route';

// ─────────────────────────────────────────
// 테스트 헬퍼
// ─────────────────────────────────────────

const VALID_BODY = {
  year: 1990,
  month: 5,
  day: 15,
  gender: 'male' as const,
  sessionId: 'dev-test-saju',
};

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/saju/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function makeMalformedRequest(): Request {
  return new Request('http://localhost/api/saju/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{malformed',
  });
}

/** 성공적인 SajuAnalysis 응답을 반환하도록 에이전트를 설정한다 */
function setupSuccessfulAgent() {
  mockAgentProcess.mockResolvedValue({
    success: true,
    data: {
      sessionId: 'dev-test-saju',
      fourPillars: {
        year: { stem: '庚', branch: '午', stemElement: 'metal', branchElement: 'fire', stemYinYang: 'yang' },
        month: { stem: '辛', branch: '巳', stemElement: 'metal', branchElement: 'fire', stemYinYang: 'yin' },
        day: { stem: '壬', branch: '子', stemElement: 'water', branchElement: 'water', stemYinYang: 'yang' },
        hour: null,
      },
      dayMaster: {
        stem: '壬',
        element: 'water',
        yinYang: 'yang',
        name: '탐험가',
        nameEn: 'Explorer',
        keywords: ['유연', '탐구'],
        description: '물처럼 흐르는 탐험가',
        strengths: ['적응력'],
        weaknesses: ['산만함'],
        image: '넓은 바다',
      },
      elementDistribution: { wood: 1, fire: 2, earth: 1, metal: 2, water: 3 },
      elementRanks: { wood: 4, fire: 2, earth: 5, metal: 3, water: 1 },
      dominantElement: 'water',
      weakestElement: 'earth',
      birthHourKnown: false,
      analyzedAt: new Date('2024-01-01T00:00:00Z'),
    },
  });
}

// ─────────────────────────────────────────
// 테스트 스위트
// ─────────────────────────────────────────

describe('POST /api/saju/calculate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFrom.mockReturnValue({
      upsert: mockUpsert,
      insert: mockInsert,
    });
    mockUpsert.mockResolvedValue({ error: null });
    mockInsert.mockResolvedValue({ error: null });
  });

  // ─────────────────────────────────────
  // 1. 잘못된 JSON
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
  // 2. 필수 필드 누락
  // ─────────────────────────────────────

  describe('필수 필드 누락', () => {
    it('year가 없으면 400을 반환한다', async () => {
      const { year: _, ...body } = VALID_BODY;
      const response = await POST(makeRequest(body));
      expect(response.status).toBe(400);
    });

    it('month가 없으면 400을 반환한다', async () => {
      const { month: _, ...body } = VALID_BODY;
      const response = await POST(makeRequest(body));
      expect(response.status).toBe(400);
    });

    it('day가 없으면 400을 반환한다', async () => {
      const { day: _, ...body } = VALID_BODY;
      const response = await POST(makeRequest(body));
      expect(response.status).toBe(400);
    });

    it('gender가 없으면 400을 반환한다', async () => {
      const { gender: _, ...body } = VALID_BODY;
      const response = await POST(makeRequest(body));
      expect(response.status).toBe(400);
    });

    it('요청 본문이 빈 객체이면 400을 반환한다', async () => {
      const response = await POST(makeRequest({}));
      expect(response.status).toBe(400);
    });
  });

  // ─────────────────────────────────────
  // 3. year 범위 검증
  // ─────────────────────────────────────

  describe('year 범위 검증 (1900~2050)', () => {
    it('year=1899이면 400을 반환한다', async () => {
      const response = await POST(makeRequest({ ...VALID_BODY, year: 1899 }));
      expect(response.status).toBe(400);
    });

    it('year=2051이면 400을 반환한다', async () => {
      const response = await POST(makeRequest({ ...VALID_BODY, year: 2051 }));
      expect(response.status).toBe(400);
    });

    it('year=1900이면 유효성 검사를 통과한다', async () => {
      setupSuccessfulAgent();
      const response = await POST(makeRequest({ ...VALID_BODY, year: 1900 }));
      expect(response.status).not.toBe(400);
    });

    it('year=2050이면 유효성 검사를 통과한다', async () => {
      setupSuccessfulAgent();
      const response = await POST(makeRequest({ ...VALID_BODY, year: 2050 }));
      expect(response.status).not.toBe(400);
    });

    it('year가 문자열이면 400을 반환한다', async () => {
      const response = await POST(makeRequest({ ...VALID_BODY, year: '1990' }));
      expect(response.status).toBe(400);
    });

    it('year가 소수이면 400을 반환한다', async () => {
      const response = await POST(makeRequest({ ...VALID_BODY, year: 1990.5 }));
      expect(response.status).toBe(400);
    });
  });

  // ─────────────────────────────────────
  // 4. month 범위 검증
  // ─────────────────────────────────────

  describe('month 범위 검증 (1~12)', () => {
    it('month=0이면 400을 반환한다', async () => {
      const response = await POST(makeRequest({ ...VALID_BODY, month: 0 }));
      expect(response.status).toBe(400);
    });

    it('month=13이면 400을 반환한다', async () => {
      const response = await POST(makeRequest({ ...VALID_BODY, month: 13 }));
      expect(response.status).toBe(400);
    });

    it('month=1이면 유효성 검사를 통과한다', async () => {
      setupSuccessfulAgent();
      const response = await POST(makeRequest({ ...VALID_BODY, month: 1 }));
      expect(response.status).not.toBe(400);
    });

    it('month=12이면 유효성 검사를 통과한다', async () => {
      setupSuccessfulAgent();
      const response = await POST(makeRequest({ ...VALID_BODY, month: 12 }));
      expect(response.status).not.toBe(400);
    });
  });

  // ─────────────────────────────────────
  // 5. day 범위 검증
  // ─────────────────────────────────────

  describe('day 범위 검증 (1~31)', () => {
    it('day=0이면 400을 반환한다', async () => {
      const response = await POST(makeRequest({ ...VALID_BODY, day: 0 }));
      expect(response.status).toBe(400);
    });

    it('day=32이면 400을 반환한다', async () => {
      const response = await POST(makeRequest({ ...VALID_BODY, day: 32 }));
      expect(response.status).toBe(400);
    });

    it('day=1이면 유효성 검사를 통과한다', async () => {
      setupSuccessfulAgent();
      const response = await POST(makeRequest({ ...VALID_BODY, day: 1 }));
      expect(response.status).not.toBe(400);
    });

    it('day=31이면 유효성 검사를 통과한다', async () => {
      setupSuccessfulAgent();
      const response = await POST(makeRequest({ ...VALID_BODY, day: 31 }));
      expect(response.status).not.toBe(400);
    });
  });

  // ─────────────────────────────────────
  // 6. gender 검증
  // ─────────────────────────────────────

  describe('gender 검증', () => {
    it('gender="other"이면 400을 반환한다', async () => {
      const response = await POST(makeRequest({ ...VALID_BODY, gender: 'other' }));
      expect(response.status).toBe(400);
    });

    it('gender=""이면 400을 반환한다', async () => {
      const response = await POST(makeRequest({ ...VALID_BODY, gender: '' }));
      expect(response.status).toBe(400);
    });

    it('gender=123이면 400을 반환한다', async () => {
      const response = await POST(makeRequest({ ...VALID_BODY, gender: 123 }));
      expect(response.status).toBe(400);
    });

    it('gender="male"이면 유효성 검사를 통과한다', async () => {
      setupSuccessfulAgent();
      const response = await POST(makeRequest({ ...VALID_BODY, gender: 'male' }));
      expect(response.status).not.toBe(400);
    });

    it('gender="female"이면 유효성 검사를 통과한다', async () => {
      setupSuccessfulAgent();
      const response = await POST(makeRequest({ ...VALID_BODY, gender: 'female' }));
      expect(response.status).not.toBe(400);
    });
  });

  // ─────────────────────────────────────
  // 7. hour 옵셔널 필드 검증
  // ─────────────────────────────────────

  describe('hour 옵셔널 필드 검증 (0~23)', () => {
    it('hour가 없어도 유효성 검사를 통과한다', async () => {
      setupSuccessfulAgent();
      const { ...body } = VALID_BODY;
      const response = await POST(makeRequest(body));
      expect(response.status).not.toBe(400);
    });

    it('hour=null이면 유효성 검사를 통과한다', async () => {
      setupSuccessfulAgent();
      const response = await POST(makeRequest({ ...VALID_BODY, hour: null }));
      expect(response.status).not.toBe(400);
    });

    it('hour=0이면 유효성 검사를 통과한다', async () => {
      setupSuccessfulAgent();
      const response = await POST(makeRequest({ ...VALID_BODY, hour: 0 }));
      expect(response.status).not.toBe(400);
    });

    it('hour=23이면 유효성 검사를 통과한다', async () => {
      setupSuccessfulAgent();
      const response = await POST(makeRequest({ ...VALID_BODY, hour: 23 }));
      expect(response.status).not.toBe(400);
    });

    it('hour=24이면 400을 반환한다', async () => {
      const response = await POST(makeRequest({ ...VALID_BODY, hour: 24 }));
      expect(response.status).toBe(400);
    });

    it('hour=-1이면 400을 반환한다', async () => {
      const response = await POST(makeRequest({ ...VALID_BODY, hour: -1 }));
      expect(response.status).toBe(400);
    });
  });

  // ─────────────────────────────────────
  // 8. 성공 경로
  // ─────────────────────────────────────

  describe('성공 경로', () => {
    it('유효한 입력으로 200과 분석 데이터를 반환한다', async () => {
      setupSuccessfulAgent();
      const response = await POST(makeRequest(VALID_BODY));

      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json.data).toBeDefined();
      expect(json.data.sessionId).toBeDefined();
    });

    it('응답 데이터에 analyzedAt이 ISO 문자열로 포함된다', async () => {
      setupSuccessfulAgent();
      const response = await POST(makeRequest(VALID_BODY));
      const json = await response.json();

      expect(typeof json.data.analyzedAt).toBe('string');
      // ISO 8601 형식 확인
      expect(() => new Date(json.data.analyzedAt)).not.toThrow();
    });

    it('sessionId가 요청에 없으면 새 UUID를 생성하여 반환한다', async () => {
      setupSuccessfulAgent();
      const { sessionId: _, ...bodyWithoutSession } = VALID_BODY;
      const response = await POST(makeRequest(bodyWithoutSession));

      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json.data.sessionId).toBeDefined();
    });

    it('에이전트가 올바른 birth input으로 호출된다', async () => {
      setupSuccessfulAgent();
      const body = { ...VALID_BODY, hour: 10, isLunar: true };
      await POST(makeRequest(body));

      expect(mockAgentProcess).toHaveBeenCalledOnce();
      const input = mockAgentProcess.mock.calls[0][0];
      expect(input.year).toBe(VALID_BODY.year);
      expect(input.month).toBe(VALID_BODY.month);
      expect(input.day).toBe(VALID_BODY.day);
      expect(input.hour).toBe(10);
      expect(input.gender).toBe('male');
      expect(input.isLunar).toBe(true);
    });

    it('isLunar와 hour가 없으면 기본값(false, null)으로 에이전트가 호출된다', async () => {
      setupSuccessfulAgent();
      await POST(makeRequest(VALID_BODY));

      const input = mockAgentProcess.mock.calls[0][0];
      expect(input.hour).toBeNull();
      expect(input.isLunar).toBe(false);
    });
  });

  // ─────────────────────────────────────
  // 9. 에이전트 실패 처리
  // ─────────────────────────────────────

  describe('에이전트 실패 처리', () => {
    it('에이전트가 실패를 반환하면 500을 반환한다', async () => {
      mockAgentProcess.mockResolvedValue({
        success: false,
        error: '사주 계산 실패',
      });

      const response = await POST(makeRequest(VALID_BODY));
      expect(response.status).toBe(500);
      const json = await response.json();
      expect(json.error).toBeDefined();
    });

    it('에이전트가 예외를 던지면 500을 반환한다', async () => {
      mockAgentProcess.mockRejectedValue(new Error('예상치 못한 에러'));

      const response = await POST(makeRequest(VALID_BODY));
      expect(response.status).toBe(500);
    });
  });

  // ─────────────────────────────────────
  // 10. Supabase 오류는 응답에 영향 없음
  // ─────────────────────────────────────

  describe('Supabase 오류는 응답에 영향을 미치지 않는다', () => {
    it('Supabase insert가 실패해도 200을 반환한다', async () => {
      setupSuccessfulAgent();
      mockFrom.mockReturnValue({
        upsert: vi.fn().mockResolvedValue({ error: null }),
        insert: vi.fn().mockRejectedValue(new Error('DB insert error')),
      });

      const response = await POST(makeRequest(VALID_BODY));
      expect(response.status).toBe(200);
    });
  });
});
