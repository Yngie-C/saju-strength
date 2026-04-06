/**
 * 프리미엄 콘텐츠 점진 공개 스케줄
 * analyzedAt 대비 경과 시간으로 잠금/해제 판정
 */

export interface UnlockStatus {
  /** Day 0: 즉시 공개 */
  hiddenStrengths: boolean;
  blindSpots: boolean;
  /** Day 1: 1일 경과 */
  branding: boolean;
  /** Week 1~4: 7/14/21/28일 경과 */
  weeklyPlan: [boolean, boolean, boolean, boolean];
}

const DAY_MS = 24 * 60 * 60 * 1000;

const UNLOCK_DAYS = {
  hiddenStrengths: 0,
  blindSpots: 0,
  branding: 1,
  week1: 7,
  week2: 14,
  week3: 21,
  week4: 28,
} as const;

export function getUnlockStatus(analyzedAt: string): UnlockStatus {
  const elapsed = Date.now() - new Date(analyzedAt).getTime();

  return {
    hiddenStrengths: elapsed >= UNLOCK_DAYS.hiddenStrengths * DAY_MS,
    blindSpots: elapsed >= UNLOCK_DAYS.blindSpots * DAY_MS,
    branding: elapsed >= UNLOCK_DAYS.branding * DAY_MS,
    weeklyPlan: [
      elapsed >= UNLOCK_DAYS.week1 * DAY_MS,
      elapsed >= UNLOCK_DAYS.week2 * DAY_MS,
      elapsed >= UNLOCK_DAYS.week3 * DAY_MS,
      elapsed >= UNLOCK_DAYS.week4 * DAY_MS,
    ],
  };
}

export function getRemainingText(analyzedAt: string, targetDays: number): string {
  const elapsed = Date.now() - new Date(analyzedAt).getTime();
  const remaining = targetDays * DAY_MS - elapsed;
  if (remaining <= 0) return '';
  const days = Math.ceil(remaining / DAY_MS);
  return `${days}일 후 공개`;
}
