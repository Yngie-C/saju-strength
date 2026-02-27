// ==========================================
// 서베이 스코어링 & 페르소나 매핑 단위 테스트
// ==========================================

import { describe, it, expect } from 'vitest';
import {
  SurveyCategory,
  SurveyAnswer,
  SurveyQuestion,
  calculateCategoryScore,
  normalizeScore,
  getPersonaByCategories,
  PersonaType,
} from '@/types/survey';
import { PersonaMap } from '@/types/persona-map';

// ─────────────────────────────────────────
// 헬퍼: 더미 답변 생성
// ─────────────────────────────────────────

function makeAnswer(
  questionId: string,
  questionNumber: number,
  category: SurveyCategory,
  score: number
): SurveyAnswer {
  return { questionId, questionNumber, category, score };
}

function makeQuestion(
  id: string,
  questionNumber: number,
  category: SurveyCategory,
  isReverseScored = false
): SurveyQuestion {
  return {
    id,
    questionNumber,
    category,
    questionText: `테스트 문항 ${questionNumber}`,
    version: 1,
    isReverseScored,
    tier: 'basic',
  };
}

// ─────────────────────────────────────────
// normalizeScore
// ─────────────────────────────────────────

describe('normalizeScore()', () => {
  it('최솟값 1 → 0점으로 변환된다', () => {
    expect(normalizeScore(1)).toBe(0);
  });

  it('최댓값 7 → 100점으로 변환된다', () => {
    expect(normalizeScore(7)).toBe(100);
  });

  it('중간값 4 → 50점으로 변환된다', () => {
    expect(normalizeScore(4)).toBeCloseTo(50, 5);
  });

  it('점수 2 → 약 16.67점으로 변환된다', () => {
    expect(normalizeScore(2)).toBeCloseTo(16.67, 1);
  });

  it('점수 6 → 약 83.33점으로 변환된다', () => {
    expect(normalizeScore(6)).toBeCloseTo(83.33, 1);
  });
});

// ─────────────────────────────────────────
// calculateCategoryScore
// ─────────────────────────────────────────

describe('calculateCategoryScore()', () => {
  it('해당 카테고리 답변이 없으면 0을 반환한다', () => {
    const answers = [
      makeAnswer('q1', 1, SurveyCategory.EXECUTION, 5),
    ];
    const questions = [
      makeQuestion('q1', 1, SurveyCategory.EXECUTION),
    ];
    const result = calculateCategoryScore(answers, SurveyCategory.INNOVATION, questions);
    expect(result).toBe(0);
  });

  it('역질문 없이 일반 문항들의 평균을 올바르게 계산한다', () => {
    // q1=4, q2=6 → 평균 5.0
    const answers = [
      makeAnswer('q1', 1, SurveyCategory.INNOVATION, 4),
      makeAnswer('q2', 2, SurveyCategory.INNOVATION, 6),
    ];
    const questions = [
      makeQuestion('q1', 1, SurveyCategory.INNOVATION, false),
      makeQuestion('q2', 2, SurveyCategory.INNOVATION, false),
    ];
    const result = calculateCategoryScore(answers, SurveyCategory.INNOVATION, questions);
    expect(result).toBe(5.0);
  });

  it('역질문(isReverseScored=true)은 8-score로 변환되어 평균에 반영된다', () => {
    // q7은 역질문: 원점수 7 → 변환 1
    // q1은 일반: 원점수 4 → 그대로 4
    // 평균 = (1 + 4) / 2 = 2.5
    const answers = [
      makeAnswer('q7', 7, SurveyCategory.INNOVATION, 7), // 역채점: 8-7=1
      makeAnswer('q1', 1, SurveyCategory.INNOVATION, 4), // 정방향
    ];
    const questions = [
      makeQuestion('q7', 7, SurveyCategory.INNOVATION, true),
      makeQuestion('q1', 1, SurveyCategory.INNOVATION, false),
    ];
    const result = calculateCategoryScore(answers, SurveyCategory.INNOVATION, questions);
    expect(result).toBe(2.5);
  });

  it('역질문 원점수 1은 7로 변환된다 (8-1=7)', () => {
    const answers = [
      makeAnswer('q7', 7, SurveyCategory.INNOVATION, 1), // 역채점: 8-1=7
    ];
    const questions = [
      makeQuestion('q7', 7, SurveyCategory.INNOVATION, true),
    ];
    const result = calculateCategoryScore(answers, SurveyCategory.INNOVATION, questions);
    expect(result).toBe(7);
  });

  it('질문 메타데이터에 없는 문항은 역채점 없이 원점수를 사용한다', () => {
    // 질문 메타데이터가 없으면 역채점 미적용
    const answers = [
      makeAnswer('q999', 999, SurveyCategory.INNOVATION, 3),
    ];
    const questions: SurveyQuestion[] = []; // 빈 메타데이터
    const result = calculateCategoryScore(answers, SurveyCategory.INNOVATION, questions);
    expect(result).toBe(3);
  });

  it('단일 문항은 해당 점수 그대로 평균이 된다', () => {
    const answers = [makeAnswer('q1', 1, SurveyCategory.EXECUTION, 6)];
    const questions = [makeQuestion('q1', 1, SurveyCategory.EXECUTION, false)];
    const result = calculateCategoryScore(answers, SurveyCategory.EXECUTION, questions);
    expect(result).toBe(6);
  });

  it('모든 문항이 역질문이고 모두 최고점(7)이면 평균 1이 된다', () => {
    // 역채점: 8-7=1 for all
    const answers = [
      makeAnswer('q7', 7, SurveyCategory.INNOVATION, 7),
      makeAnswer('q10', 10, SurveyCategory.INNOVATION, 7),
    ];
    const questions = [
      makeQuestion('q7', 7, SurveyCategory.INNOVATION, true),
      makeQuestion('q10', 10, SurveyCategory.INNOVATION, true),
    ];
    const result = calculateCategoryScore(answers, SurveyCategory.INNOVATION, questions);
    expect(result).toBe(1);
  });
});

// ─────────────────────────────────────────
// getPersonaByCategories
// ─────────────────────────────────────────

describe('getPersonaByCategories()', () => {
  it('카테고리가 1개이면 에러를 던진다', () => {
    expect(() =>
      getPersonaByCategories([SurveyCategory.INNOVATION])
    ).toThrow('Need at least 2 top categories for persona mapping');
  });

  it('INNOVATION + EXECUTION → ARCHITECT 페르소나를 반환한다', () => {
    const persona = getPersonaByCategories([
      SurveyCategory.INNOVATION,
      SurveyCategory.EXECUTION,
    ]);
    expect(persona.type).toBe(PersonaType.ARCHITECT);
    expect(persona.title).toBe('전략적 설계자');
  });

  it('INNOVATION + INFLUENCE → DISRUPTOR 페르소나를 반환한다', () => {
    const persona = getPersonaByCategories([
      SurveyCategory.INNOVATION,
      SurveyCategory.INFLUENCE,
    ]);
    expect(persona.type).toBe(PersonaType.DISRUPTOR);
  });

  it('INNOVATION + COLLABORATION → CREATIVE_CATALYST 페르소나를 반환한다', () => {
    const persona = getPersonaByCategories([
      SurveyCategory.INNOVATION,
      SurveyCategory.COLLABORATION,
    ]);
    expect(persona.type).toBe(PersonaType.CREATIVE_CATALYST);
  });

  it('INNOVATION + RESILIENCE → ADAPTIVE_PIONEER 페르소나를 반환한다', () => {
    const persona = getPersonaByCategories([
      SurveyCategory.INNOVATION,
      SurveyCategory.RESILIENCE,
    ]);
    expect(persona.type).toBe(PersonaType.ADAPTIVE_PIONEER);
  });

  it('EXECUTION + INFLUENCE → AUTHORITATIVE_LEADER 페르소나를 반환한다', () => {
    const persona = getPersonaByCategories([
      SurveyCategory.EXECUTION,
      SurveyCategory.INFLUENCE,
    ]);
    expect(persona.type).toBe(PersonaType.AUTHORITATIVE_LEADER);
  });

  it('EXECUTION + COLLABORATION → THE_ANCHOR 페르소나를 반환한다', () => {
    const persona = getPersonaByCategories([
      SurveyCategory.EXECUTION,
      SurveyCategory.COLLABORATION,
    ]);
    expect(persona.type).toBe(PersonaType.THE_ANCHOR);
  });

  it('EXECUTION + RESILIENCE → STEADY_ACHIEVER 페르소나를 반환한다', () => {
    const persona = getPersonaByCategories([
      SurveyCategory.EXECUTION,
      SurveyCategory.RESILIENCE,
    ]);
    expect(persona.type).toBe(PersonaType.STEADY_ACHIEVER);
  });

  it('INFLUENCE + COLLABORATION → INSPIRATIONAL_CONNECTOR 페르소나를 반환한다', () => {
    const persona = getPersonaByCategories([
      SurveyCategory.INFLUENCE,
      SurveyCategory.COLLABORATION,
    ]);
    expect(persona.type).toBe(PersonaType.INSPIRATIONAL_CONNECTOR);
  });

  it('INFLUENCE + RESILIENCE → RESILIENT_INFLUENCER 페르소나를 반환한다', () => {
    const persona = getPersonaByCategories([
      SurveyCategory.INFLUENCE,
      SurveyCategory.RESILIENCE,
    ]);
    expect(persona.type).toBe(PersonaType.RESILIENT_INFLUENCER);
  });

  it('COLLABORATION + RESILIENCE → SUPPORTIVE_BACKBONE 페르소나를 반환한다', () => {
    const persona = getPersonaByCategories([
      SurveyCategory.COLLABORATION,
      SurveyCategory.RESILIENCE,
    ]);
    expect(persona.type).toBe(PersonaType.SUPPORTIVE_BACKBONE);
  });

  it('순서가 뒤바뀐 조합(EXECUTION + INNOVATION)도 동일한 페르소나를 반환한다', () => {
    const forward = getPersonaByCategories([
      SurveyCategory.INNOVATION,
      SurveyCategory.EXECUTION,
    ]);
    const reversed = getPersonaByCategories([
      SurveyCategory.EXECUTION,
      SurveyCategory.INNOVATION,
    ]);
    expect(forward.type).toBe(reversed.type);
  });

  it('모든 10개 페르소나가 PersonaMap에 존재한다', () => {
    // PersonaMap은 10개 조합을 커버해야 한다
    const keys = Object.keys(PersonaMap);
    expect(keys).toHaveLength(10);
  });

  it('반환된 페르소나에는 brandingKeywords가 최소 3개 이상 있다', () => {
    const persona = getPersonaByCategories([
      SurveyCategory.INNOVATION,
      SurveyCategory.EXECUTION,
    ]);
    expect(persona.brandingKeywords.length).toBeGreaterThanOrEqual(3);
  });

  it('반환된 페르소나에는 strengths가 최소 1개 이상 있다', () => {
    const persona = getPersonaByCategories([
      SurveyCategory.COLLABORATION,
      SurveyCategory.RESILIENCE,
    ]);
    expect(persona.strengths.length).toBeGreaterThanOrEqual(1);
  });
});
