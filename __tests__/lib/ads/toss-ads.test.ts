import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// 환경변수 모킹
const originalEnv = process.env;

describe('toss-ads', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    // localStorage 모킹
    const store: Record<string, string> = {};
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => { store[key] = value; },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => { Object.keys(store).forEach(k => delete store[k]); },
    });
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  describe('isAdSupported', () => {
    it('웹 환경에서 false 반환', async () => {
      process.env.NEXT_PUBLIC_BUILD_TARGET = 'web';
      const { isAdSupported } = await import('@/lib/ads/toss-ads');
      expect(isAdSupported()).toBe(false);
    });
  });

  describe('initializeAds', () => {
    it('웹 환경에서 false 반환 (no-op)', async () => {
      process.env.NEXT_PUBLIC_BUILD_TARGET = 'web';
      const { initializeAds } = await import('@/lib/ads/toss-ads');
      const result = await initializeAds();
      expect(result).toBe(false);
    });
  });

  describe('attachBannerAd', () => {
    it('웹 환경에서 null 반환 (no-op)', async () => {
      process.env.NEXT_PUBLIC_BUILD_TARGET = 'web';
      const { attachBannerAd } = await import('@/lib/ads/toss-ads');
      const el = {} as HTMLElement;
      const result = await attachBannerAd(el);
      expect(result).toBeNull();
    });
  });

  describe('preloadInterstitial', () => {
    it('웹 환경에서 false 반환 (no-op)', async () => {
      process.env.NEXT_PUBLIC_BUILD_TARGET = 'web';
      const { preloadInterstitial } = await import('@/lib/ads/toss-ads');
      const result = await preloadInterstitial();
      expect(result).toBe(false);
    });
  });

  describe('showInterstitial', () => {
    it('웹 환경에서 false 반환 (no-op)', async () => {
      process.env.NEXT_PUBLIC_BUILD_TARGET = 'web';
      const { showInterstitial } = await import('@/lib/ads/toss-ads');
      const result = await showInterstitial();
      expect(result).toBe(false);
    });
  });

  describe('preloadRewarded', () => {
    it('웹 환경에서 false 반환 (no-op)', async () => {
      process.env.NEXT_PUBLIC_BUILD_TARGET = 'web';
      const { preloadRewarded } = await import('@/lib/ads/toss-ads');
      const result = await preloadRewarded();
      expect(result).toBe(false);
    });
  });

  describe('showRewarded', () => {
    it('웹 환경에서 rewarded: false 반환 (no-op)', async () => {
      process.env.NEXT_PUBLIC_BUILD_TARGET = 'web';
      const { showRewarded } = await import('@/lib/ads/toss-ads');
      const result = await showRewarded();
      expect(result).toEqual({ rewarded: false });
    });
  });
});

describe('ads/config', () => {
  it('테스트 ID가 기본값으로 설정됨', async () => {
    const { AD_GROUP_IDS, AD_COOLDOWN } = await import('@/lib/ads/config');
    expect(AD_GROUP_IDS.banner).toBe('ait-ad-test-banner-id');
    expect(AD_GROUP_IDS.interstitial).toBe('ait-ad-test-interstitial-id');
    expect(AD_GROUP_IDS.rewarded).toBe('ait-ad-test-rewarded-id');
    expect(AD_COOLDOWN.interstitial).toBe(60_000);
    expect(AD_COOLDOWN.rewarded).toBe(30_000);
  });
});
