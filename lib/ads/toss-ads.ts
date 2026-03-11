/**
 * 토스 인앱광고 SDK 래퍼
 *
 * lib/toss.ts와 동일한 패턴 사용:
 * - webpackIgnore 동적 import
 * - IS_TOSS 환경 체크
 * - graceful fallback
 */

import { AD_GROUP_IDS, AD_COOLDOWN, type AdType } from './config';
import { IS_TOSS } from '@/lib/platform';

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
        (options?: { callbacks?: { onInitialized?: () => void; onInitializationFailed?: (error: Error) => void } }): void;
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

    await TossAds.initialize({});
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
        (adGroupId: string, target: HTMLElement, options?: Record<string, unknown>): { destroy: () => void };
      };
    } | undefined;

    if (!TossAds?.attachBanner) return null;
    if (TossAds.attachBanner.isSupported && !TossAds.attachBanner.isSupported()) return null;

    const banner = TossAds.attachBanner(
      AD_GROUP_IDS.banner,
      target,
      {
        theme: options?.theme ?? 'auto',
        variant: options?.variant ?? 'card',
      }
    );

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
      (args: { onEvent: (data: unknown) => void; onError: (error: Error) => void; options?: { adGroupId: string } }): () => void;
    } | undefined;

    if (!loadFn) return false;
    if (loadFn.isSupported && !loadFn.isSupported()) return false;

    return new Promise<boolean>((resolve) => {
      loadFn({
        options: { adGroupId: AD_GROUP_IDS[type] },
        onEvent: () => resolve(true),
        onError: () => resolve(false),
      });
    });
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
      (args: { onEvent: (data: { type: string; data?: { unitType: string; unitAmount: number } }) => void; onError: (error: Error) => void; options?: { adGroupId: string } }): () => void;
    } | undefined;

    if (!showFn) return { isCompleted: false };
    if (showFn.isSupported && !showFn.isSupported()) return { isCompleted: false };

    return new Promise<FullScreenAdResult>((resolve) => {
      showFn({
        options: { adGroupId: AD_GROUP_IDS[type] },
        onEvent: (event) => {
          if (event.type === 'dismissed') {
            setCooldown(type);
            resolve({ isCompleted: true });
          } else if (event.type === 'userEarnedReward' && type === 'rewarded') {
            setCooldown(type);
            resolve({
              isCompleted: true,
              isRewarded: true,
            });
          }
        },
        onError: () => resolve({ isCompleted: false }),
      });
    });
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
      (args: { onEvent: (data: { type: string; data?: { unitType: string; unitAmount: number } }) => void; onError: (error: Error) => void; options?: { adGroupId: string } }): () => void;
    } | undefined;

    if (!showFn) return { rewarded: false };
    if (showFn.isSupported && !showFn.isSupported()) return { rewarded: false };

    return new Promise((resolve) => {
      showFn({
        options: { adGroupId: AD_GROUP_IDS.rewarded },
        onEvent: (event) => {
          if (event.type === 'userEarnedReward' && event.data) {
            setCooldown('rewarded');
            resolve({
              rewarded: true,
              unitType: event.data.unitType,
              unitAmount: event.data.unitAmount,
            });
          } else if (event.type === 'dismissed') {
            setCooldown('rewarded');
            resolve({ rewarded: false });
          }
        },
        onError: () => resolve({ rewarded: false }),
      });
    });
  } catch (err) {
    console.warn('[TossAds] Rewarded show failed:', err);
    return { rewarded: false };
  }
}
