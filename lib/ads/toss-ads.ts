/**
 * 토스 인앱광고 SDK 래퍼
 *
 * book-of-changes 패턴 기반:
 * - @apps-in-toss/web-bridge에서 직접 import
 * - 전면형/보상형: loadFullScreenAd/showFullScreenAd (별도 초기화 불필요)
 * - 배너: TossAds.initialize()는 배너 부착 시 1회만 호출
 * - 각 광고 타입이 독립적으로 동작 (전역 게이트 없음)
 */

import { AD_GROUP_IDS, AD_COOLDOWN } from './config';
import { IS_TOSS } from '@/lib/platform';

// --- 쿨다운 ---

function isCooldownActive(type: 'interstitial' | 'rewarded'): boolean {
  if (typeof window === 'undefined') return true;
  const key = `ad-cooldown-${type}`;
  const last = localStorage.getItem(key);
  if (!last) return false;
  return Date.now() - parseInt(last, 10) < AD_COOLDOWN[type];
}

function setCooldown(type: 'interstitial' | 'rewarded'): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`ad-cooldown-${type}`, String(Date.now()));
}

// --- SDK 타입 ---

interface FullScreenAdLoader {
  (args: {
    onEvent: (data: { type: string; data?: { unitType: string; unitAmount: number } }) => void;
    onError: (err: unknown) => void;
    options?: { adGroupId: string };
  }): () => void;
  isSupported?: () => boolean;
}

interface TossAdsSDK {
  initialize: ((options?: {
    callbacks?: {
      onInitialized?: () => void;
      onInitializationFailed?: (error: Error) => void;
    };
  }) => void) & { isSupported?: () => boolean };
  attachBanner: ((
    adGroupId: string,
    target: string | HTMLElement,
    options?: Record<string, unknown>,
  ) => { destroy: () => void }) & { isSupported?: () => boolean };
}

// --- web-bridge 동적 import ---

async function getWebBridge(): Promise<Record<string, unknown> | null> {
  try {
    return await import('@apps-in-toss/web-bridge') as Record<string, unknown>;
  } catch {
    return null;
  }
}

// --- 광고 지원 여부 ---

/** 광고 SDK 지원 여부 확인 (비동기) */
export async function isAdSupported(): Promise<boolean> {
  if (!IS_TOSS) return false;
  try {
    const bridge = await getWebBridge();
    if (!bridge) return false;
    const { GoogleAdMob } = bridge as { GoogleAdMob?: { isSupported?: () => boolean } };
    if (!GoogleAdMob) return false;
    return typeof GoogleAdMob.isSupported === 'function' ? GoogleAdMob.isSupported() : true;
  } catch {
    return false;
  }
}

/**
 * 광고 SDK 초기화 완료 대기
 * web-bridge import 성공 = 사용 가능 (전역 initialize 불필요)
 */
export async function waitForAdsInit(): Promise<boolean> {
  return isAdSupported();
}

/** initializeAds — TDSProvider 호환용 (no-op에 가까움) */
export async function initializeAds(): Promise<boolean> {
  return isAdSupported();
}

// --- 전면형 광고 ---

/** 전면형 광고 사전 로드 */
export async function preloadInterstitial(): Promise<boolean> {
  if (!IS_TOSS) return false;
  if (isCooldownActive('interstitial')) return false;

  try {
    const bridge = await getWebBridge();
    if (!bridge) return false;

    const loader = bridge.loadFullScreenAd as FullScreenAdLoader | undefined;
    if (!loader) return false;
    if (typeof loader.isSupported === 'function' && !loader.isSupported()) return false;

    return new Promise<boolean>((resolve) => {
      loader({
        options: { adGroupId: AD_GROUP_IDS.interstitial },
        onEvent: (event) => {
          if (event.type === 'loaded') resolve(true);
        },
        onError: () => resolve(false),
      });
    });
  } catch {
    return false;
  }
}

/** 전면형 광고 표시. 닫힘/실패 시 onDone 콜백 호출. */
export async function showInterstitial(onDone?: () => void): Promise<boolean> {
  if (!IS_TOSS) { onDone?.(); return false; }
  if (isCooldownActive('interstitial')) { onDone?.(); return false; }

  try {
    const bridge = await getWebBridge();
    if (!bridge) { onDone?.(); return false; }

    const shower = bridge.showFullScreenAd as FullScreenAdLoader | undefined;
    if (!shower) { onDone?.(); return false; }
    if (typeof shower.isSupported === 'function' && !shower.isSupported()) { onDone?.(); return false; }

    let done = false;
    const finish = (completed: boolean) => {
      if (done) return;
      done = true;
      setCooldown('interstitial');
      onDone?.();
      return completed;
    };

    return new Promise<boolean>((resolve) => {
      shower({
        options: { adGroupId: AD_GROUP_IDS.interstitial },
        onEvent: (event) => {
          if (event.type === 'dismissed' || event.type === 'failedToShow') {
            finish(true);
            resolve(true);
          }
        },
        onError: () => {
          finish(false);
          resolve(false);
        },
      });

      // 안전망: 10초 후 강제 진행
      setTimeout(() => {
        finish(false);
        resolve(false);
      }, 10_000);
    });
  } catch {
    onDone?.();
    return false;
  }
}

// --- 보상형 광고 ---

/** 보상형 광고 사전 로드 */
export async function preloadRewarded(): Promise<boolean> {
  if (!IS_TOSS) return false;
  if (isCooldownActive('rewarded')) return false;

  try {
    const bridge = await getWebBridge();
    if (!bridge) return false;

    const loader = bridge.loadFullScreenAd as FullScreenAdLoader | undefined;
    if (!loader) return false;
    if (typeof loader.isSupported === 'function' && !loader.isSupported()) return false;

    return new Promise<boolean>((resolve) => {
      loader({
        options: { adGroupId: AD_GROUP_IDS.rewarded },
        onEvent: (event) => {
          if (event.type === 'loaded') resolve(true);
        },
        onError: () => resolve(false),
      });
    });
  } catch {
    return false;
  }
}

/** 보상형 광고 표시 — rewarded: boolean, reward info 반환 */
export async function showRewarded(): Promise<{
  rewarded: boolean;
  unitType?: string;
  unitAmount?: number;
}> {
  if (!IS_TOSS) return { rewarded: false };
  if (isCooldownActive('rewarded')) return { rewarded: false };

  try {
    const bridge = await getWebBridge();
    if (!bridge) return { rewarded: false };

    const shower = bridge.showFullScreenAd as FullScreenAdLoader | undefined;
    if (!shower) return { rewarded: false };
    if (typeof shower.isSupported === 'function' && !shower.isSupported()) return { rewarded: false };

    return new Promise((resolve) => {
      shower({
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

      // 안전망: 10초 후 강제 진행
      setTimeout(() => resolve({ rewarded: false }), 10_000);
    });
  } catch {
    return { rewarded: false };
  }
}

// --- 배너 광고 (TossAds) ---

let tossAdsInitialized = false;

/** 배너 광고 부착. destroy 함수를 반환. */
export async function attachBannerAd(
  target: HTMLElement,
  options?: { theme?: 'auto' | 'light' | 'dark'; variant?: 'card' | 'expanded' }
): Promise<(() => void) | null> {
  if (!IS_TOSS) return null;

  try {
    const bridge = await getWebBridge();
    if (!bridge) return null;

    const TossAds = bridge.TossAds as TossAdsSDK | undefined;
    if (!TossAds?.attachBanner) return null;
    if (typeof TossAds.attachBanner.isSupported === 'function' && !TossAds.attachBanner.isSupported()) return null;

    // 최초 1회 초기화 (배너 전용)
    if (!tossAdsInitialized) {
      TossAds.initialize({});
      tossAdsInitialized = true;
    }

    const banner = TossAds.attachBanner(
      AD_GROUP_IDS.banner,
      target,
      {
        theme: options?.theme ?? 'auto',
        variant: options?.variant ?? 'card',
      }
    );

    return () => banner.destroy();
  } catch {
    return null;
  }
}
