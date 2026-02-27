// ==========================================
// PSA Survey Type Definitions
// ==========================================

// PersonaType은 순환 참조 방지를 위해 persona-type.ts에서 직접 가져온다
export { PersonaType } from './persona-type';
import { PersonaType } from './persona-type';

import { PersonaMetadata, PersonaMap } from './persona-map';
export type { PersonaMetadata } from './persona-map';
export { PersonaMap } from './persona-map';

/**
 * Survey Categories (5 dimensions)
 */
export enum SurveyCategory {
  INNOVATION = 'innovation',      // 혁신 사고
  EXECUTION = 'execution',        // 철저 실행
  INFLUENCE = 'influence',        // 대인 영향
  COLLABORATION = 'collaboration', // 협업 공감
  RESILIENCE = 'resilience',      // 상황 회복
}

/**
 * Category Labels (Korean)
 */
export const CategoryLabels: Record<SurveyCategory, string> = {
  [SurveyCategory.INNOVATION]: '혁신 사고',
  [SurveyCategory.EXECUTION]: '철저 실행',
  [SurveyCategory.INFLUENCE]: '대인 영향',
  [SurveyCategory.COLLABORATION]: '협업 공감',
  [SurveyCategory.RESILIENCE]: '상황 회복',
};

/**
 * Category Descriptions (Korean)
 */
export const CategoryDescriptions: Record<SurveyCategory, string> = {
  [SurveyCategory.INNOVATION]: '어떤 가치를 창조하는가?',
  [SurveyCategory.EXECUTION]: '어떻게 결과를 만드는가?',
  [SurveyCategory.INFLUENCE]: '어떻게 브랜드를 전파하는가?',
  [SurveyCategory.COLLABORATION]: '어떤 관계를 구축하는가?',
  [SurveyCategory.RESILIENCE]: '위기에 어떻게 대응하는가?',
};

/**
 * Survey Question Interface
 */
export interface SurveyQuestion {
  id: string;
  questionNumber: number;
  category: SurveyCategory;
  questionText: string;
  questionHint?: string;
  version: number;
  isReverseScored?: boolean; // NEW: For reverse-scored questions
  tier?: 'basic' | 'premium'; // 문항 티어 (basic: 30문항, premium: 추가 30문항)
}

/**
 * User response to a single question
 */
export interface SurveyAnswer {
  questionId: string;
  questionNumber: number;
  category: SurveyCategory;
  score: number; // 1-7 Likert scale
}

/**
 * Complete survey response from user
 */
export interface SurveyResponse {
  sessionId: string;
  answers: SurveyAnswer[];
  completedAt: Date;
  completionTimeSeconds?: number;
}

/**
 * Category Score (normalized 0-100)
 */
export interface CategoryScore {
  category: SurveyCategory;
  rawScore: number;        // Average of 1-7 scores
  normalizedScore: number; // Converted to 0-100 scale
  rank: number;            // 1-5 ranking
}

// PersonaType은 위에서 persona-type.ts로부터 re-export됨

/**
 * Brief Analysis Output (from SurveyAnalyzerAgent)
 */
export interface BriefAnalysis {
  // Session info
  sessionId: string;

  // Scores
  categoryScores: CategoryScore[];
  totalScore: number; // Average across all categories (0-100)

  // Persona
  persona: PersonaMetadata;
  topCategories: SurveyCategory[]; // Top 2

  // Analysis
  strengthsSummary: string;      // 2-3 paragraphs
  brandingKeywords: string[];    // Top 3-5 keywords

  // Strength scenarios
  strengthsScenarios?: {
    title: string;              // Scenario title
    description: string;        // Specific description (100-150 chars)
  }[];

  // NEW: Strength-focused sections (replaces lowScoreCategories & shadowSides)
  strengthTips?: {
    strength: string;           // 강점명
    tip: string;                // 실무 활용 팁
    scenario: string;           // 적용 상황
  }[];

  brandingMessages?: {
    selfIntro: string;          // 한 줄 자기소개
    linkedinHeadline: string;   // LinkedIn 헤드라인
    elevatorPitch: string;      // 엘리베이터 피치
    hashtags: string[];         // 추천 해시태그
  };

  // Radar chart data
  radarData: {
    category: string;
    score: number;
  }[];

  // @deprecated - 하위 호환용, 새 코드에서는 사용하지 않음
  /** @deprecated Use strengthTips instead */
  lowScoreCategories?: {
    category: SurveyCategory;
    reframedLabel: string;
    reframedDescription: string;
  }[];

  /** @deprecated Use brandingMessages instead */
  shadowSides?: string;

  // NEW: Selected Soul Questions
  selectedSoulQuestions?: string[];  // Soul Question IDs

  // Metadata
  completionTimeSeconds?: number;
  analyzedAt: Date;
}

/**
 * Helper function to get persona by top categories
 */
export function getPersonaByCategories(
  topCategories: SurveyCategory[]
): PersonaMetadata {
  if (topCategories.length < 2) {
    throw new Error('Need at least 2 top categories for persona mapping');
  }

  const key = `${topCategories[0]}-${topCategories[1]}`;
  let persona = PersonaMap[key];

  // Try reverse order if direct mapping not found
  if (!persona) {
    const reverseKey = `${topCategories[1]}-${topCategories[0]}`;
    persona = PersonaMap[reverseKey];
  }

  if (!persona) {
    // Fallback: use first category as primary
    const fallbackKey = Object.keys(PersonaMap).find(k => k.startsWith(topCategories[0]));
    if (fallbackKey) {
      return PersonaMap[fallbackKey];
    }
    // Ultimate fallback
    return PersonaMap['innovation-execution'];
  }

  return persona;
}

/**
 * Helper function to normalize score from 1-7 to 0-100
 */
export function normalizeScore(rawScore: number): number {
  return ((rawScore - 1) / 6) * 100;
}

/**
 * Helper function to calculate category average
 * Applies reverse scoring for reverse-scored questions
 */
export function calculateCategoryScore(
  answers: SurveyAnswer[],
  category: SurveyCategory,
  questions: SurveyQuestion[] // NEW: Need question metadata for reverse scoring
): number {
  const categoryAnswers = answers.filter((a) => a.category === category);
  if (categoryAnswers.length === 0) return 0;

  // Apply reverse scoring before averaging
  const adjustedScores = categoryAnswers.map((answer) => {
    const question = questions.find((q) => q.id === answer.questionId);

    // Reverse score if question is marked as reverse-scored
    if (question?.isReverseScored) {
      return 8 - answer.score; // 7→1, 6→2, ..., 1→7
    }

    return answer.score; // Use original score
  });

  const sum = adjustedScores.reduce((acc, score) => acc + score, 0);
  return sum / adjustedScores.length;
}
