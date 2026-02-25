/**
 * 토스 인앱광고 SDK 래퍼
 *
 * lib/toss.ts와 동일한 패턴 사용:
 * - webpackIgnore 동적 import
 * - IS_TOSS 환경 체크
 * - graceful fallback
 */

import { AD_GROUP_IDS, AD_COOLDOWN, type AdType } from './config';

const IS_TOSS = process.env.NEXT_PUBLIC_BUILD_TARGET === 'toss';

let adsInitialized = false;
let adsSdk: Record<string, unknown> | null = null;

/** 쿨다운 체크 (localStorage 기반) */
function isCooldownActive(type: 'interstitial' | 'rewarded'): boolean {
  if (typeof window === 'undefined') return true;
  const key = `ad-cooldown-${type}`;
  const last = localStorage.getItem(key);
  if (!last) return false;
  return Date.now() - parseInt(last, 10) < AD_COOLDOWN[type];
}

/** 쿨다운 기록 */
function setCooldown(type: 'interstitial' | 'rewarded'): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`ad-cooldown-${type}`, String(Date.now()));
}

/** SDK 동적 import */
async function getAdsSdk(): Promise<Record<string, unknown> | null> {
  if (adsSdk) return adsSdk;
  try {
    adsSdk = await import(/* webpackIgnore: true */ '@apps-in-toss/web-framework') as Record<string, unknown>;
    return adsSdk;
  } catch (err) {
    console.warn('[TossAds] SDK import failed:', err);
    return null;
  }
}

/** 광고 SDK 지원 여부 확인 */
export function isAdSupported(): boolean {
  return IS_TOSS && adsInitialized;
}

/** 광고 SDK 초기화 */
export async function initializeAds(): Promise<boolean> {
  if (!IS_TOSS) return false;
  if (adsInitialized) return true;

  try {
    const sdk = await getAdsSdk();
    if (!sdk) return false;

    const TossAds = sdk.TossAds as {
      initialize?: {
        isSupported?: () => boolean;
        (...args: unknown[]): Promise<void>;
      };
    } | undefined;

    if (!TossAds?.initialize) {
      console.warn('[TossAds] TossAds.initialize not found');
      return false;
    }

    if (TossAds.initialize.isSupported && !TossAds.initialize.isSupported()) {
      console.warn('[TossAds] TossAds.initialize not supported on this version');
      return false;
    }

    await TossAds.initialize();
    adsInitialized = true;
    return true;
  } catch (err) {
    console.warn('[TossAds] Initialization failed:', err);
    return false;
  }
}

/** 배너 광고 부착. destroy 함수를 반환. */
export async function attachBannerAd(
  target: HTMLElement,
  options?: { theme?: 'auto' | 'light' | 'dark'; variant?: 'card' | 'expanded' }
): Promise<(() => void) | null> {
  if (!IS_TOSS || !adsInitialized) return null;

  try {
    const sdk = await getAdsSdk();
    if (!sdk) return null;

    const TossAds = sdk.TossAds as {
      attachBanner?: {
        isSupported?: () => boolean;
        (params: unknown): { destroy: () => void };
      };
    } | undefined;

    if (!TossAds?.attachBanner) return null;
    if (TossAds.attachBanner.isSupported && !TossAds.attachBanner.isSupported()) return null;

    const banner = TossAds.attachBanner({
      adGroupId: AD_GROUP_IDS.banner,
      target,
      theme: options?.theme ?? 'auto',
      variant: options?.variant ?? 'card',
    });

    return () => banner.destroy();
  } catch (err) {
    console.warn('[TossAds] Banner attach failed:', err);
    return null;
  }
}

// --- Fullscreen ads (interstitial / rewarded) ---

type FullScreenAdType = 'interstitial' | 'rewarded';

interface FullScreenAdResult {
  isCompleted: boolean;
  isRewarded?: boolean;
}

/** 전면형/보상형 광고 사전 로드 */
export async function preloadFullScreenAd(type: FullScreenAdType): Promise<boolean> {
  if (!IS_TOSS || !adsInitialized) return false;
  if (isCooldownActive(type)) return false;

  try {
    const sdk = await getAdsSdk();
    if (!sdk) return false;

    const loadFn = sdk.loadFullScreenAd as {
      isSupported?: () => boolean;
      (params: unknown): Promise<unknown>;
    } | undefined;

    if (!loadFn) return false;
    if (loadFn.isSupported && !loadFn.isSupported()) return false;

    await loadFn({ adGroupId: AD_GROUP_IDS[type] });
    return true;
  } catch (err) {
    console.warn(`[TossAds] ${type} preload failed:`, err);
    return false;
  }
}

/** 전면형/보상형 광고 표시 */
async function showFullScreenAdInternal(type: FullScreenAdType): Promise<FullScreenAdResult> {
  if (!IS_TOSS || !adsInitialized) return { isCompleted: false };
  if (isCooldownActive(type)) return { isCompleted: false };

  try {
    const sdk = await getAdsSdk();
    if (!sdk) return { isCompleted: false };

    const showFn = sdk.showFullScreenAd as {
      isSupported?: () => boolean;
      (params: unknown): Promise<{ isCompleted: boolean; reward?: { unitType: string; unitAmount: number } }>;
    } | undefined;

    if (!showFn) return { isCompleted: false };
    if (showFn.isSupported && !showFn.isSupported()) return { isCompleted: false };

    const result = await showFn({ adGroupId: AD_GROUP_IDS[type] });
    setCooldown(type);

    return {
      isCompleted: result.isCompleted,
      isRewarded: type === 'rewarded' ? result.isCompleted && !!result.reward : undefined,
    };
  } catch (err) {
    console.warn(`[TossAds] ${type} show failed:`, err);
    return { isCompleted: false };
  }
}

// --- Public convenience functions ---

/** 전면형 광고 사전 로드 */
export async function preloadInterstitial(): Promise<boolean> {
  return preloadFullScreenAd('interstitial');
}

/** 전면형 광고 표시 */
export async function showInterstitial(): Promise<boolean> {
  const result = await showFullScreenAdInternal('interstitial');
  return result.isCompleted;
}

/** 보상형 광고 사전 로드 */
export async function preloadRewarded(): Promise<boolean> {
  return preloadFullScreenAd('rewarded');
}

/** 보상형 광고 표시 — rewarded: boolean, reward info 반환 */
export async function showRewarded(): Promise<{
  rewarded: boolean;
  unitType?: string;
  unitAmount?: number;
}> {
  if (!IS_TOSS || !adsInitialized) return { rewarded: false };
  if (isCooldownActive('rewarded')) return { rewarded: false };

  try {
    const sdk = await getAdsSdk();
    if (!sdk) return { rewarded: false };

    const showFn = sdk.showFullScreenAd as {
      isSupported?: () => boolean;
      (params: unknown): Promise<{ isCompleted: boolean; reward?: { unitType: string; unitAmount: number } }>;
    } | undefined;

    if (!showFn) return { rewarded: false };
    if (showFn.isSupported && !showFn.isSupported()) return { rewarded: false };

    const result = await showFn({ adGroupId: AD_GROUP_IDS.rewarded });
    setCooldown('rewarded');

    if (result.isCompleted && result.reward) {
      return {
        rewarded: true,
        unitType: result.reward.unitType,
        unitAmount: result.reward.unitAmount,
      };
    }
    return { rewarded: false };
  } catch (err) {
    console.warn('[TossAds] Rewarded show failed:', err);
    return { rewarded: false };
  }
}
