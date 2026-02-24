/**
 * 토스 앱인토스 SDK 유틸리티
 *
 * @apps-in-toss/web-framework 기반
 * 토스 환경에서는 실제 SDK 호출, 웹 환경에서는 폴백 동작
 */

/** 토스 환경 여부 감지 */
export function isTossEnvironment(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    navigator.userAgent.includes('TossApp') ||
    process.env.NEXT_PUBLIC_BUILD_TARGET === 'toss'
  );
}

/** 토스 앱 초기화 */
export async function initTossApp(): Promise<void> {
  if (!isTossEnvironment()) return;

  try {
    const { AppsInToss } = await import(/* webpackIgnore: true */ '@apps-in-toss/web-framework');
    AppsInToss.registerApp({ appName: 'saju-strength' });
  } catch (error) {
    console.warn('[Toss] App initialization failed:', error);
  }
}

/** 토스 로그인 (OAuth2 authorizationCode 반환) */
export async function tossLogin(): Promise<{
  authorizationCode: string;
  referrer: string;
} | null> {
  if (!isTossEnvironment()) return null;

  try {
    const { appLogin } = await import(/* webpackIgnore: true */ '@apps-in-toss/web-framework');
    return await appLogin();
  } catch (error) {
    console.warn('[Toss] Login failed:', error);
    return null;
  }
}

/** 토스 공유 링크 생성 */
export async function createTossShareLink(
  path: string,
  ogImageUrl?: string
): Promise<string | null> {
  if (!isTossEnvironment()) return null;

  try {
    const { getTossShareLink } = await import(/* webpackIgnore: true */ '@apps-in-toss/web-framework');
    return await getTossShareLink(
      `intoss://saju-strength${path}`,
      ogImageUrl
    );
  } catch (error) {
    console.warn('[Toss] Share link creation failed:', error);
    return null;
  }
}

/** 토스 네이티브 공유 */
export async function tossShare(message: string): Promise<boolean> {
  if (!isTossEnvironment()) return false;

  try {
    const { share } = await import(/* webpackIgnore: true */ '@apps-in-toss/web-framework');
    await share({ message });
    return true;
  } catch (error) {
    console.warn('[Toss] Share failed:', error);
    return false;
  }
}

/** 백 버튼 이벤트 리스너 등록 */
export function onBackButton(handler: () => void): () => void {
  if (!isTossEnvironment()) return () => {};

  let unsubscribe: (() => void) | null = null;

  import(/* webpackIgnore: true */ '@apps-in-toss/web-framework').then(({ graniteEvent }) => {
    const sub = graniteEvent.addEventListener('backEvent', {
      onEvent: handler,
      onError: (error: unknown) => console.warn('[Toss] Back event error:', error),
    });
    unsubscribe = sub;
  }).catch(() => {});

  return () => {
    if (unsubscribe) unsubscribe();
  };
}

/** 토스 IAP - 상품 목록 조회 */
export async function getTossProducts(): Promise<unknown[]> {
  if (!isTossEnvironment()) return [];

  try {
    const { getProductItemList } = await import(/* webpackIgnore: true */ '@apps-in-toss/web-framework');
    return await getProductItemList();
  } catch (error) {
    console.warn('[Toss] Product list failed:', error);
    return [];
  }
}

/** 토스 IAP - 구매 */
export async function purchaseTossProduct(productId: string): Promise<unknown | null> {
  if (!isTossEnvironment()) return null;

  try {
    const { createOneTimePurchaseOrder } = await import(/* webpackIgnore: true */ '@apps-in-toss/web-framework');
    return await createOneTimePurchaseOrder({ productId });
  } catch (error) {
    console.warn('[Toss] Purchase failed:', error);
    return null;
  }
}
