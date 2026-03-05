import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const originalEnv = process.env;

describe('analytics', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  describe('trackScreen', () => {
    it('웹 환경에서 no-op (IS_TOSS=false)', async () => {
      process.env.NEXT_PUBLIC_BUILD_TARGET = 'web';
      const { trackScreen } = await import('@/lib/analytics');
      // 예외 없이 resolve되어야 함
      await expect(trackScreen('result')).resolves.toBeUndefined();
    });

    it('토스 환경에서 SDK import 실패 시 예외 없이 종료', async () => {
      process.env.NEXT_PUBLIC_BUILD_TARGET = 'toss';
      const { trackScreen } = await import('@/lib/analytics');
      // webpackIgnore import가 테스트 환경에서 실패해도 graceful fallback
      await expect(trackScreen('result')).resolves.toBeUndefined();
    });
  });

  describe('trackClick', () => {
    it('웹 환경에서 no-op (IS_TOSS=false)', async () => {
      process.env.NEXT_PUBLIC_BUILD_TARGET = 'web';
      const { trackClick } = await import('@/lib/analytics');
      await expect(trackClick('survey', 'next')).resolves.toBeUndefined();
    });

    it('웹 환경에서 label 포함 시 no-op', async () => {
      process.env.NEXT_PUBLIC_BUILD_TARGET = 'web';
      const { trackClick } = await import('@/lib/analytics');
      await expect(trackClick('result', 'view', 'wood')).resolves.toBeUndefined();
    });

    it('토스 환경에서 SDK import 실패 시 예외 없이 종료', async () => {
      process.env.NEXT_PUBLIC_BUILD_TARGET = 'toss';
      const { trackClick } = await import('@/lib/analytics');
      await expect(trackClick('cta', 'share')).resolves.toBeUndefined();
    });
  });

  describe('trackImpression', () => {
    it('웹 환경에서 no-op (IS_TOSS=false)', async () => {
      process.env.NEXT_PUBLIC_BUILD_TARGET = 'web';
      const { trackImpression } = await import('@/lib/analytics');
      await expect(trackImpression('banner')).resolves.toBeUndefined();
    });

    it('웹 환경에서 label 포함 시 no-op', async () => {
      process.env.NEXT_PUBLIC_BUILD_TARGET = 'web';
      const { trackImpression } = await import('@/lib/analytics');
      await expect(trackImpression('result_section', 'strength_list')).resolves.toBeUndefined();
    });

    it('토스 환경에서 SDK import 실패 시 예외 없이 종료', async () => {
      process.env.NEXT_PUBLIC_BUILD_TARGET = 'toss';
      const { trackImpression } = await import('@/lib/analytics');
      await expect(trackImpression('banner', 'wood_card')).resolves.toBeUndefined();
    });
  });

  describe('이벤트 네이밍 패턴 검증', () => {
    it('category_action 형태 조합 가능', () => {
      // 네이밍 규칙 문서화 테스트: label 없으면 category_action
      const category = 'survey';
      const action = 'next';
      const logName = `${category}_${action}`;
      expect(logName).toBe('survey_next');
    });

    it('category_action_label 형태 조합 가능', () => {
      // 네이밍 규칙 문서화 테스트: label 있으면 category_action_label
      const category = 'result';
      const action = 'view';
      const label = 'wood';
      const logName = `${category}_${action}_${label}`;
      expect(logName).toBe('result_view_wood');
    });

    it('impression category_label 형태 조합 가능', () => {
      const category = 'result_section';
      const label = 'strength_list';
      const logName = `${category}_${label}`;
      expect(logName).toBe('result_section_strength_list');
    });
  });
});
