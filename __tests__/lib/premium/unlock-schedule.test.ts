import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getUnlockStatus, getRemainingText } from '@/lib/premium/unlock-schedule';

const DAY_MS = 24 * 60 * 60 * 1000;
const BASE_TIME = new Date('2024-01-01T00:00:00.000Z').getTime();
const BASE_ISO = new Date(BASE_TIME).toISOString();

describe('unlock-schedule', () => {
  beforeEach(() => {
    vi.spyOn(Date, 'now').mockReturnValue(BASE_TIME);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getUnlockStatus', () => {
    it('Day 0 (즉시): hiddenStrengths, blindSpots는 true, branding과 weeklyPlan은 false', () => {
      const status = getUnlockStatus(BASE_ISO);
      expect(status.hiddenStrengths).toBe(true);
      expect(status.blindSpots).toBe(true);
      expect(status.branding).toBe(false);
      expect(status.weeklyPlan).toEqual([false, false, false, false]);
    });

    it('Day 1 (24시간 후): branding=true', () => {
      vi.spyOn(Date, 'now').mockReturnValue(BASE_TIME + 1 * DAY_MS);
      const status = getUnlockStatus(BASE_ISO);
      expect(status.branding).toBe(true);
      expect(status.weeklyPlan).toEqual([false, false, false, false]);
    });

    it('Day 3 (72시간 후): branding 여전히 true, weeklyPlan 모두 false', () => {
      vi.spyOn(Date, 'now').mockReturnValue(BASE_TIME + 3 * DAY_MS);
      const status = getUnlockStatus(BASE_ISO);
      expect(status.branding).toBe(true);
      expect(status.weeklyPlan).toEqual([false, false, false, false]);
    });

    it('Week 1 (7일 후): weeklyPlan[0]=true', () => {
      vi.spyOn(Date, 'now').mockReturnValue(BASE_TIME + 7 * DAY_MS);
      const status = getUnlockStatus(BASE_ISO);
      expect(status.weeklyPlan).toEqual([true, false, false, false]);
    });

    it('Week 2 (14일 후): weeklyPlan[1]=true', () => {
      vi.spyOn(Date, 'now').mockReturnValue(BASE_TIME + 14 * DAY_MS);
      const status = getUnlockStatus(BASE_ISO);
      expect(status.weeklyPlan).toEqual([true, true, false, false]);
    });

    it('Week 3 (21일 후): weeklyPlan[2]=true', () => {
      vi.spyOn(Date, 'now').mockReturnValue(BASE_TIME + 21 * DAY_MS);
      const status = getUnlockStatus(BASE_ISO);
      expect(status.weeklyPlan).toEqual([true, true, true, false]);
    });

    it('Week 4 (28일 후): weeklyPlan[3]=true, 모든 항목 true', () => {
      vi.spyOn(Date, 'now').mockReturnValue(BASE_TIME + 28 * DAY_MS);
      const status = getUnlockStatus(BASE_ISO);
      expect(status.hiddenStrengths).toBe(true);
      expect(status.blindSpots).toBe(true);
      expect(status.branding).toBe(true);
      expect(status.weeklyPlan).toEqual([true, true, true, true]);
    });

    it('경계값: 23시간 59분 → branding 아직 false', () => {
      vi.spyOn(Date, 'now').mockReturnValue(BASE_TIME + 23 * 60 * 60 * 1000 + 59 * 60 * 1000);
      const status = getUnlockStatus(BASE_ISO);
      expect(status.branding).toBe(false);
    });
  });

  describe('getRemainingText', () => {
    it('잠금 해제 전: "N일 후 공개" 텍스트 반환', () => {
      // Day 0 기준, branding은 1일 후 공개
      vi.spyOn(Date, 'now').mockReturnValue(BASE_TIME);
      const text = getRemainingText(BASE_ISO, 1);
      expect(text).toBe('1일 후 공개');
    });

    it('6일 경과 후 7일 타겟: "1일 후 공개" 반환', () => {
      vi.spyOn(Date, 'now').mockReturnValue(BASE_TIME + 6 * DAY_MS);
      const text = getRemainingText(BASE_ISO, 7);
      expect(text).toBe('1일 후 공개');
    });

    it('이미 해제된 경우: 빈 문자열 반환', () => {
      vi.spyOn(Date, 'now').mockReturnValue(BASE_TIME + 2 * DAY_MS);
      const text = getRemainingText(BASE_ISO, 1);
      expect(text).toBe('');
    });

    it('정확히 targetDays 경과 시: 빈 문자열 반환', () => {
      vi.spyOn(Date, 'now').mockReturnValue(BASE_TIME + 7 * DAY_MS);
      const text = getRemainingText(BASE_ISO, 7);
      expect(text).toBe('');
    });
  });
});
