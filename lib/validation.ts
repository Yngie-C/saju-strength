/**
 * API 입력값 검증을 위한 TypeScript 타입 가드 함수 모음
 * Zod 등 외부 의존성 없이 순수 타입 가드 패턴으로 구현
 */

// ---------------------------------------------------------------------------
// 범용 헬퍼
// ---------------------------------------------------------------------------

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/** UUID v4 형식 (xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx) 또는 dev- 접두사 허용 */
export function isValidSessionId(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const devPattern = /^dev-.+/;
  return uuidPattern.test(value) || devPattern.test(value);
}

export function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

export function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

export function hasRequiredFields<T extends Record<string, unknown>>(
  body: unknown,
  fields: string[]
): body is T {
  if (typeof body !== 'object' || body === null) return false;
  return fields.every((field) => field in (body as Record<string, unknown>));
}

// ---------------------------------------------------------------------------
// 이메일 검증
// ---------------------------------------------------------------------------

export function isValidEmail(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// ---------------------------------------------------------------------------
// 라우트별 타입 가드
// ---------------------------------------------------------------------------

// POST /api/auth/toss-token
export interface TossTokenBody {
  authorizationCode: string;
  referrer?: string;
}

export function isValidTossTokenBody(body: unknown): body is TossTokenBody {
  if (typeof body !== 'object' || body === null) return false;
  const b = body as Record<string, unknown>;
  return isNonEmptyString(b.authorizationCode);
}

// POST /api/auth/toss-refresh
export interface TossRefreshBody {
  refreshToken: string;
}

export function isValidTossRefreshBody(body: unknown): body is TossRefreshBody {
  if (typeof body !== 'object' || body === null) return false;
  const b = body as Record<string, unknown>;
  return isNonEmptyString(b.refreshToken);
}

// POST /api/auth/toss-disconnect
export interface TossDisconnectBody {
  userKey: string;
  referrer?: string;
}

export function isValidTossDisconnectBody(body: unknown): body is TossDisconnectBody {
  if (typeof body !== 'object' || body === null) return false;
  const b = body as Record<string, unknown>;
  return isNonEmptyString(b.userKey);
}

// POST /api/saju/calculate
export interface SajuCalculateBody {
  year: number;
  month: number;
  day: number;
  hour?: number | null;
  gender: 'male' | 'female';
  isLunar?: boolean;
  sessionId?: string;
}

export function isValidSajuCalculateBody(body: unknown): body is SajuCalculateBody {
  if (typeof body !== 'object' || body === null) return false;
  const b = body as Record<string, unknown>;
  if (!isNonNegativeInteger(b.year) || (b.year as number) < 1900 || (b.year as number) > 2050) return false;
  if (!isNonNegativeInteger(b.month) || (b.month as number) < 1 || (b.month as number) > 12) return false;
  if (!isNonNegativeInteger(b.day) || (b.day as number) < 1 || (b.day as number) > 31) return false;
  if (b.gender !== 'male' && b.gender !== 'female') return false;
  // hour is optional (null or 0-23)
  if (b.hour !== undefined && b.hour !== null) {
    if (typeof b.hour !== 'number' || !Number.isInteger(b.hour) || (b.hour as number) < 0 || (b.hour as number) > 23) return false;
  }
  return true;
}

// POST /api/survey/submit — answers 배열의 각 항목 타입
export interface SurveyAnswerItem {
  questionId: string;
  questionNumber: number;
  category: string;
  score: number;
}

export interface SurveySubmitBody {
  sessionId: string;
  answers: SurveyAnswerItem[];
  completionTimeSeconds?: number;
}

function isValidSurveyAnswerItem(item: unknown): item is SurveyAnswerItem {
  if (typeof item !== 'object' || item === null) return false;
  const a = item as Record<string, unknown>;
  if (!isNonNegativeInteger(a.questionNumber)) return false;
  if (!isNonEmptyString(a.category)) return false;
  if (typeof a.score !== 'number' || !Number.isFinite(a.score)) return false;
  return true;
}

export function isValidSurveySubmitBody(body: unknown): body is SurveySubmitBody {
  if (typeof body !== 'object' || body === null) return false;
  const b = body as Record<string, unknown>;
  if (!isNonEmptyString(b.sessionId)) return false;
  if (!Array.isArray(b.answers)) return false;
  if (!b.answers.every(isValidSurveyAnswerItem)) return false;
  if (b.completionTimeSeconds !== undefined && !isNonNegativeInteger(b.completionTimeSeconds)) return false;
  return true;
}

// POST /api/combined/analyze
export interface CombinedAnalyzeBody {
  sessionId: string;
  sajuResult: Record<string, unknown>;
  psaResult: Record<string, unknown>;
}

export function isValidCombinedAnalyzeBody(body: unknown): body is CombinedAnalyzeBody {
  if (typeof body !== 'object' || body === null) return false;
  const b = body as Record<string, unknown>;
  if (!isNonEmptyString(b.sessionId)) return false;
  if (typeof b.sajuResult !== 'object' || b.sajuResult === null) return false;
  if (typeof b.psaResult !== 'object' || b.psaResult === null) return false;
  return true;
}

// POST /api/profile/save
export interface ProfileSaveBody {
  sessionId: string;
  email?: string;
  sajuResult?: unknown;
  psaResult?: unknown;
  combinedResult?: unknown;
}

export function isValidProfileSaveBody(body: unknown): body is ProfileSaveBody {
  if (typeof body !== 'object' || body === null) return false;
  const b = body as Record<string, unknown>;
  return isNonEmptyString(b.sessionId);
}

// POST /api/state/save
export interface StateSaveBody {
  sessionId: string;
  key: string;
  data: unknown;
}

export function isValidStateSaveBody(body: unknown): body is StateSaveBody {
  if (typeof body !== 'object' || body === null) return false;
  const b = body as Record<string, unknown>;
  if (!isNonEmptyString(b.sessionId)) return false;
  if (!isNonEmptyString(b.key)) return false;
  if (!('data' in b)) return false;
  return true;
}

// POST /api/waitlist/join
export interface WaitlistJoinBody {
  email: string;
  phone?: string;
  sessionId?: string;
}

export function isValidWaitlistJoinBody(body: unknown): body is WaitlistJoinBody {
  if (typeof body !== 'object' || body === null) return false;
  const b = body as Record<string, unknown>;
  return isValidEmail(b.email);
}
