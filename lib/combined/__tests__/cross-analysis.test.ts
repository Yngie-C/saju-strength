// ==========================================
// Cross-Analysis & parseGrowthGuide 유닛 테스트
// ==========================================

import { describe, it, expect } from 'vitest';
import { performCrossAnalysis } from '../cross-analysis';
import { parseGrowthGuide } from '../parse-growth-guide';
import { ElementRanks } from '@/types/saju';
import { CategoryScore, SurveyCategory } from '@/types/survey';

// ─────────────────────────────────────────
// 테스트 헬퍼
// ─────────────────────────────────────────

/**
 * 5개 오행에 대한 ElementRanks를 생성한다.
 * 지정하지 않은 오행은 기본값 3을 사용한다.
 */
function makeElementRanks(
  overrides: Partial<ElementRanks> = {}
): ElementRanks {
  return {
    wood: 3,
    fire: 3,
    earth: 3,
    metal: 3,
    water: 3,
    ...overrides,
  };
}

/**
 * 5개 카테고리에 대한 CategoryScore 배열을 생성한다.
 * rankMap: category -> rank (1~5), normalizedScore는 rank에 비례
 */
function makeCategoryScores(
  rankMap: Partial<Record<SurveyCategory, number>>
): CategoryScore[] {
  const defaults: Record<SurveyCategory, number> = {
    [SurveyCategory.INNOVATION]: 3,
    [SurveyCategory.INFLUENCE]: 3,
    [SurveyCategory.COLLABORATION]: 3,
    [SurveyCategory.EXECUTION]: 3,
    [SurveyCategory.RESILIENCE]: 3,
  };
  const merged = { ...defaults, ...rankMap };

  return (Object.entries(merged) as [SurveyCategory, number][]).map(
    ([category, rank]) => ({
      category,
      rawScore: 7 - rank, // 순위가 높을수록 rawScore도 높게
      normalizedScore: (5 - rank) * 20,
      rank,
    })
  );
}

// ─────────────────────────────────────────
// 1. classifyAxis 경계값 테스트
//    (performCrossAnalysis를 통해 간접 검증)
// ─────────────────────────────────────────

describe('classifyAxis — 4유형 판정', () => {
  it('오행 rank≤2, PSA rank≤2 → alignment 반환', () => {
    const elementRanks = makeElementRanks({ wood: 1 }); // wood rank=1 (강함)
    const categoryScores = makeCategoryScores({ [SurveyCategory.INNOVATION]: 2 }); // PSA rank=2 (강함)

    const axes = performCrossAnalysis(elementRanks, categoryScores);
    const woodAxis = axes.find(a => a.element === 'wood')!;

    expect(woodAxis.type).toBe('alignment');
  });

  it('오행 rank≤2, PSA rank>2 → potential 반환', () => {
    const elementRanks = makeElementRanks({ wood: 2 }); // wood rank=2 (강함)
    const categoryScores = makeCategoryScores({ [SurveyCategory.INNOVATION]: 3 }); // PSA rank=3 (약함)

    const axes = performCrossAnalysis(elementRanks, categoryScores);
    const woodAxis = axes.find(a => a.element === 'wood')!;

    expect(woodAxis.type).toBe('potential');
  });

  it('오행 rank>2, PSA rank≤2 → developed 반환', () => {
    const elementRanks = makeElementRanks({ wood: 3 }); // wood rank=3 (약함)
    const categoryScores = makeCategoryScores({ [SurveyCategory.INNOVATION]: 1 }); // PSA rank=1 (강함)

    const axes = performCrossAnalysis(elementRanks, categoryScores);
    const woodAxis = axes.find(a => a.element === 'wood')!;

    expect(woodAxis.type).toBe('developed');
  });

  it('오행 rank>2, PSA rank>2 → undeveloped 반환', () => {
    const elementRanks = makeElementRanks({ wood: 4 }); // wood rank=4 (약함)
    const categoryScores = makeCategoryScores({ [SurveyCategory.INNOVATION]: 4 }); // PSA rank=4 (약함)

    const axes = performCrossAnalysis(elementRanks, categoryScores);
    const woodAxis = axes.find(a => a.element === 'wood')!;

    expect(woodAxis.type).toBe('undeveloped');
  });

  it('오행 rank=2 (경계값) → 강함으로 판정 (alignment/potential)', () => {
    const elementRanks = makeElementRanks({ metal: 2 }); // rank=2, 경계값

    // PSA rank=2 → alignment
    const scoresAlignment = makeCategoryScores({ [SurveyCategory.EXECUTION]: 2 });
    const axesAlignment = performCrossAnalysis(elementRanks, scoresAlignment);
    expect(axesAlignment.find(a => a.element === 'metal')!.type).toBe('alignment');

    // PSA rank=3 → potential
    const scoresPotential = makeCategoryScores({ [SurveyCategory.EXECUTION]: 3 });
    const axesPotential = performCrossAnalysis(elementRanks, scoresPotential);
    expect(axesPotential.find(a => a.element === 'metal')!.type).toBe('potential');
  });

  it('오행 rank=3 (경계값+1) → 약함으로 판정 (developed/undeveloped)', () => {
    const elementRanks = makeElementRanks({ fire: 3 }); // rank=3, 약함

    // PSA rank=2 → developed
    const scoresDeveloped = makeCategoryScores({ [SurveyCategory.INFLUENCE]: 2 });
    const axesDeveloped = performCrossAnalysis(elementRanks, scoresDeveloped);
    expect(axesDeveloped.find(a => a.element === 'fire')!.type).toBe('developed');

    // PSA rank=3 → undeveloped
    const scoresUndeveloped = makeCategoryScores({ [SurveyCategory.INFLUENCE]: 3 });
    const axesUndeveloped = performCrossAnalysis(elementRanks, scoresUndeveloped);
    expect(axesUndeveloped.find(a => a.element === 'fire')!.type).toBe('undeveloped');
  });
});

// ─────────────────────────────────────────
// 2. performCrossAnalysis 전체 동작
// ─────────────────────────────────────────

describe('performCrossAnalysis', () => {
  it('항상 5개의 AxisAnalysis를 반환한다', () => {
    const axes = performCrossAnalysis(
      makeElementRanks(),
      makeCategoryScores({})
    );
    expect(axes).toHaveLength(5);
  });

  it('반환된 각 axis는 element, psaCategory, elementRank, psaRank, type, insight 필드를 가진다', () => {
    const axes = performCrossAnalysis(
      makeElementRanks(),
      makeCategoryScores({})
    );
    for (const axis of axes) {
      expect(axis).toHaveProperty('element');
      expect(axis).toHaveProperty('psaCategory');
      expect(axis).toHaveProperty('elementRank');
      expect(axis).toHaveProperty('psaRank');
      expect(axis).toHaveProperty('type');
      expect(axis).toHaveProperty('insight');
    }
  });

  it('오행-PSA 카테고리 매핑이 올바르다 (wood → innovation, fire → influence 등)', () => {
    const axes = performCrossAnalysis(
      makeElementRanks(),
      makeCategoryScores({})
    );
    const woodAxis = axes.find(a => a.element === 'wood')!;
    const fireAxis = axes.find(a => a.element === 'fire')!;
    const earthAxis = axes.find(a => a.element === 'earth')!;
    const metalAxis = axes.find(a => a.element === 'metal')!;
    const waterAxis = axes.find(a => a.element === 'water')!;

    expect(woodAxis.psaCategory).toBe(SurveyCategory.INNOVATION);
    expect(fireAxis.psaCategory).toBe(SurveyCategory.INFLUENCE);
    expect(earthAxis.psaCategory).toBe(SurveyCategory.COLLABORATION);
    expect(metalAxis.psaCategory).toBe(SurveyCategory.EXECUTION);
    expect(waterAxis.psaCategory).toBe(SurveyCategory.RESILIENCE);
  });

  it('CategoryScore에 해당 카테고리가 없으면 psaRank를 5(기본값)로 처리한다', () => {
    // innovation 카테고리를 categoryScores에서 제거
    const scoresWithoutInnovation = makeCategoryScores({}).filter(
      s => s.category !== SurveyCategory.INNOVATION
    );
    const elementRanks = makeElementRanks({ wood: 3 }); // wood rank=3 → 약함

    const axes = performCrossAnalysis(elementRanks, scoresWithoutInnovation);
    const woodAxis = axes.find(a => a.element === 'wood')!;

    // psaRank 기본값 5 → 약함, wood rank=3 → 약함 → undeveloped
    expect(woodAxis.psaRank).toBe(5);
    expect(woodAxis.type).toBe('undeveloped');
  });

  it('모든 오행이 rank 1~2이고 모든 PSA rank가 1~2이면 모두 alignment가 된다', () => {
    const elementRanks: ElementRanks = { wood: 1, fire: 2, earth: 1, metal: 2, water: 1 };
    const categoryScores = makeCategoryScores({
      [SurveyCategory.INNOVATION]: 1,
      [SurveyCategory.INFLUENCE]: 2,
      [SurveyCategory.COLLABORATION]: 1,
      [SurveyCategory.EXECUTION]: 2,
      [SurveyCategory.RESILIENCE]: 1,
    });

    const axes = performCrossAnalysis(elementRanks, categoryScores);
    expect(axes.every(a => a.type === 'alignment')).toBe(true);
  });

  it('모든 오행이 rank 3~5이고 모든 PSA rank가 3~5이면 모두 undeveloped가 된다', () => {
    const elementRanks: ElementRanks = { wood: 3, fire: 4, earth: 5, metal: 3, water: 4 };
    const categoryScores = makeCategoryScores({
      [SurveyCategory.INNOVATION]: 3,
      [SurveyCategory.INFLUENCE]: 4,
      [SurveyCategory.COLLABORATION]: 5,
      [SurveyCategory.EXECUTION]: 3,
      [SurveyCategory.RESILIENCE]: 4,
    });

    const axes = performCrossAnalysis(elementRanks, categoryScores);
    expect(axes.every(a => a.type === 'undeveloped')).toBe(true);
  });

  it('반환된 elementRank, psaRank 값이 입력 데이터와 일치한다', () => {
    const elementRanks = makeElementRanks({ water: 1 });
    const categoryScores = makeCategoryScores({ [SurveyCategory.RESILIENCE]: 2 });

    const axes = performCrossAnalysis(elementRanks, categoryScores);
    const waterAxis = axes.find(a => a.element === 'water')!;

    expect(waterAxis.elementRank).toBe(1);
    expect(waterAxis.psaRank).toBe(2);
  });

  it('insight 문자열이 정의된 template에 대해 비어있지 않다 (alignment 유형)', () => {
    const elementRanks = makeElementRanks({ wood: 1 });
    const categoryScores = makeCategoryScores({ [SurveyCategory.INNOVATION]: 1 });

    const axes = performCrossAnalysis(elementRanks, categoryScores);
    const woodAxis = axes.find(a => a.element === 'wood')!;

    expect(woodAxis.type).toBe('alignment');
    expect(woodAxis.insight.length).toBeGreaterThan(0);
  });

  it('동점 rank 처리: elementRank=2와 psaRank=2 모두 강함 경계값으로 alignment 반환', () => {
    const elementRanks = makeElementRanks({ earth: 2 });
    const categoryScores = makeCategoryScores({ [SurveyCategory.COLLABORATION]: 2 });

    const axes = performCrossAnalysis(elementRanks, categoryScores);
    expect(axes.find(a => a.element === 'earth')!.type).toBe('alignment');
  });
});

// ─────────────────────────────────────────
// 3. parseGrowthGuide 유닛 테스트
// ─────────────────────────────────────────

describe('parseGrowthGuide', () => {
  it('첫 번째 줄을 summary로 반환한다', () => {
    const raw = '성장 로드맵입니다.\n혁신 사고: 아이디어를 기록해보세요.';
    const result = parseGrowthGuide(raw);
    expect(result.summary).toBe('성장 로드맵입니다.');
  });

  it('"실천 방법:" 접두사가 있는 줄을 dailyPractice로 파싱한다', () => {
    const raw = '요약입니다.\n실천 방법: 매일 5분씩 기록하세요.';
    const result = parseGrowthGuide(raw);
    expect(result.dailyPractice).toBe('매일 5분씩 기록하세요.');
  });

  it('"실천 방법:" 접두사를 제거하고 값만 반환한다', () => {
    const raw = '요약\n실천 방법:   앞뒤 공백을 제거한다.  ';
    const result = parseGrowthGuide(raw);
    expect(result.dailyPractice).toBe('앞뒤 공백을 제거한다.');
  });

  it('"영역명:" 형식의 줄을 focusAreas로 파싱한다', () => {
    const raw = '요약\n혁신 사고: 창의적 도전을 시작하세요.\n대인 영향: 발표 기회를 찾으세요.';
    const result = parseGrowthGuide(raw);
    expect(result.focusAreas).toHaveLength(2);
    expect(result.focusAreas[0].area).toBe('혁신 사고');
    expect(result.focusAreas[0].advice).toBe('창의적 도전을 시작하세요.');
    expect(result.focusAreas[1].area).toBe('대인 영향');
    expect(result.focusAreas[1].advice).toBe('발표 기회를 찾으세요.');
  });

  it('"실천 방법:" 줄은 focusAreas에 포함되지 않는다', () => {
    const raw = '요약\n혁신 사고: 도전해보세요.\n실천 방법: 매일 기록하세요.';
    const result = parseGrowthGuide(raw);
    expect(result.focusAreas).toHaveLength(1);
    expect(result.dailyPractice).toBe('매일 기록하세요.');
  });

  it('빈 문자열 입력 시 summary가 빈 문자열이고 focusAreas가 빈 배열이다', () => {
    const result = parseGrowthGuide('');
    expect(result.summary).toBe('');
    expect(result.focusAreas).toHaveLength(0);
    expect(result.dailyPractice).toBe('');
  });

  it('단일 줄 입력 시 summary만 채워지고 focusAreas는 비어있다', () => {
    const result = parseGrowthGuide('단 하나의 줄만 있습니다.');
    expect(result.summary).toBe('단 하나의 줄만 있습니다.');
    expect(result.focusAreas).toHaveLength(0);
    expect(result.dailyPractice).toBe('');
  });

  it('콜론이 없는 중간 줄은 focusAreas에 포함되지 않는다', () => {
    const raw = '요약\n콜론없는줄\n혁신 사고: 도전하세요.';
    const result = parseGrowthGuide(raw);
    expect(result.focusAreas).toHaveLength(1);
    expect(result.focusAreas[0].area).toBe('혁신 사고');
  });

  it('여러 줄에 걸친 복합 입력을 올바르게 파싱한다', () => {
    const raw = [
      '甲木 유형인 당신의 성장 로드맵입니다.',
      '',
      '[잠재력] 혁신 사고: 창의적 프로젝트에 도전해보세요.',
      '[성장 기회] 대인 영향: 발표 기회를 만들어보세요.',
      '[핵심 강점] 철저 실행: 실행력을 더욱 강화하세요.',
      '',
      '실천 방법: 매일 아침 의도를 설정하고 저녁에 기록하세요.',
    ].join('\n');

    const result = parseGrowthGuide(raw);

    expect(result.summary).toBe('甲木 유형인 당신의 성장 로드맵입니다.');
    expect(result.focusAreas).toHaveLength(3);
    expect(result.focusAreas[0].area).toBe('[잠재력] 혁신 사고');
    expect(result.focusAreas[1].area).toBe('[성장 기회] 대인 영향');
    expect(result.focusAreas[2].area).toBe('[핵심 강점] 철저 실행');
    expect(result.dailyPractice).toBe('매일 아침 의도를 설정하고 저녁에 기록하세요.');
  });

  it('콜론이 여러 개 있는 경우 첫 번째 콜론을 기준으로 area/advice를 분리한다', () => {
    const raw = '요약\n영역: 조언: 추가 설명이 있습니다.';
    const result = parseGrowthGuide(raw);
    expect(result.focusAreas[0].area).toBe('영역');
    expect(result.focusAreas[0].advice).toBe('조언: 추가 설명이 있습니다.');
  });

  it('앞뒤 공백이 있는 줄도 정상 파싱된다', () => {
    const raw = '  요약입니다.  \n  혁신 사고:  조언입니다.  ';
    const result = parseGrowthGuide(raw);
    expect(result.summary).toBe('요약입니다.');
    expect(result.focusAreas[0].area).toBe('혁신 사고');
    expect(result.focusAreas[0].advice).toBe('조언입니다.');
  });
});
