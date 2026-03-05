/**
 * 토스 앱인토스 Analytics 래퍼
 *
 * - IS_TOSS 가드: 웹 환경에서는 모든 함수가 no-op
 * - webpackIgnore 동적 import: 토스 빌드에서만 런타임 로드
 * - PII 금지: 이름, 생년월일, 연락처 등 개인정보 포함 금지
 *
 * 네이밍 컨벤션: {category}_{action}_{label}
 * 예) result_view_wood, survey_click_next
 */

import { IS_TOSS } from '@/lib/platform';

// SDK 캐시
let analyticsSdk: { Analytics: AnalyticsSdk } | null = null;

interface AnalyticsSdk {
  screen: (params?: Record<string, string | number | boolean | null>) => Promise<void> | undefined;
  impression: (params?: Record<string, string | number | boolean | null>) => Promise<void> | undefined;
  click: (params?: Record<string, string | number | boolean | null>) => Promise<void> | undefined;
}

/** SDK 동적 import (토스 환경에서만 호출됨) */
async function getAnalyticsSdk(): Promise<AnalyticsSdk | null> {
  if (analyticsSdk) return analyticsSdk.Analytics;
  try {
    const mod = await import(/* webpackIgnore: true */ '@apps-in-toss/web-analytics') as { Analytics: AnalyticsSdk };
    analyticsSdk = mod;
    return mod.Analytics;
  } catch (err) {
    console.warn('[Analytics] SDK import 실패:', err);
    return null;
  }
}

/**
 * 화면 진입 이벤트 로깅
 *
 * @param name - 화면 이름 (예: 'result', 'survey', 'landing')
 * @param extra - 추가 파라미터 (PII 금지)
 */
export async function trackScreen(
  name: string,
  extra?: Record<string, string | number | boolean | null>
): Promise<void> {
  if (!IS_TOSS) return;
  try {
    const sdk = await getAnalyticsSdk();
    if (!sdk) return;
    await sdk.screen({ log_name: name, ...extra });
  } catch (err) {
    console.warn('[Analytics] screen 로깅 실패:', err);
  }
}

/**
 * 클릭 이벤트 로깅
 *
 * @param category - 카테고리 (예: 'survey', 'result', 'cta')
 * @param action   - 액션 (예: 'next', 'share', 'restart')
 * @param label    - 선택적 레이블 (예: 'wood', 'fire')
 * @param extra    - 추가 파라미터 (PII 금지)
 */
export async function trackClick(
  category: string,
  action: string,
  label?: string,
  extra?: Record<string, string | number | boolean | null>
): Promise<void> {
  if (!IS_TOSS) return;
  const logName = label ? `${category}_${action}_${label}` : `${category}_${action}`;
  try {
    const sdk = await getAnalyticsSdk();
    if (!sdk) return;
    await sdk.click({ log_name: logName, ...extra });
  } catch (err) {
    console.warn('[Analytics] click 로깅 실패:', err);
  }
}

/**
 * 노출 이벤트 로깅
 *
 * @param category - 카테고리 (예: 'banner', 'result_section')
 * @param label    - 선택적 레이블 (예: 'wood_card', 'strength_list')
 * @param extra    - 추가 파라미터 (PII 금지)
 */
export async function trackImpression(
  category: string,
  label?: string,
  extra?: Record<string, string | number | boolean | null>
): Promise<void> {
  if (!IS_TOSS) return;
  const logName = label ? `${category}_${label}` : category;
  try {
    const sdk = await getAnalyticsSdk();
    if (!sdk) return;
    await sdk.impression({ log_name: logName, ...extra });
  } catch (err) {
    console.warn('[Analytics] impression 로깅 실패:', err);
  }
}
