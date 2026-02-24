/**
 * Sentry 모니터링 초기화
 * @granite-js/plugin-sentry 기반, 앱인토스 환경 최적화
 */

const IS_TOSS = process.env.NEXT_PUBLIC_BUILD_TARGET === 'toss';

export async function initSentry(): Promise<void> {
  if (!IS_TOSS) return;
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;

  try {
    const { init } = await import('@granite-js/plugin-sentry');
    init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      enableNative: false,
      useClient: false,
      environment: process.env.NODE_ENV || 'production',
      tracesSampleRate: 0.1,
    });
  } catch (error) {
    console.warn('[Sentry] Initialization failed:', error);
  }
}
