import { SurveyQuestion } from '@/types/survey';
import { INNOVATION_QUESTIONS } from './innovation';
import { EXECUTION_QUESTIONS } from './execution';
import { INFLUENCE_QUESTIONS } from './influence';
import { COLLABORATION_QUESTIONS } from './collaboration';
import { RESILIENCE_QUESTIONS } from './resilience';

export { INNOVATION_QUESTIONS } from './innovation';
export { EXECUTION_QUESTIONS } from './execution';
export { INFLUENCE_QUESTIONS } from './influence';
export { COLLABORATION_QUESTIONS } from './collaboration';
export { RESILIENCE_QUESTIONS } from './resilience';

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  ...INNOVATION_QUESTIONS,
  ...EXECUTION_QUESTIONS,
  ...INFLUENCE_QUESTIONS,
  ...COLLABORATION_QUESTIONS,
  ...RESILIENCE_QUESTIONS,
];

/** @deprecated 하위 호환용 — 새 코드에서는 BASIC_QUESTIONS_PER_PAGE 사용 */
export const QUESTIONS_PER_PAGE = 6;
/** @deprecated 하위 호환용 — 새 코드에서는 BASIC_TOTAL_PAGES 사용 */
export const TOTAL_PAGES = 10;

export const BASIC_QUESTIONS: SurveyQuestion[] = SURVEY_QUESTIONS.filter(q => q.tier === 'basic');
export const PREMIUM_QUESTIONS: SurveyQuestion[] = SURVEY_QUESTIONS.filter(q => q.tier === 'premium');
export const BASIC_QUESTIONS_PER_PAGE = 6;
export const BASIC_TOTAL_PAGES = 5;
