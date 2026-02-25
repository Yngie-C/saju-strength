/**
 * 토스 인앱광고 설정
 */

export const AD_GROUP_IDS = {
  banner: process.env.NEXT_PUBLIC_AD_BANNER_ID || 'ait-ad-test-banner-id',
  interstitial: process.env.NEXT_PUBLIC_AD_INTERSTITIAL_ID || 'ait-ad-test-interstitial-id',
  rewarded: process.env.NEXT_PUBLIC_AD_REWARDED_ID || 'ait-ad-test-rewarded-id',
} as const;

export const AD_COOLDOWN = {
  interstitial: 60_000,  // 전면형: 최소 60초 간격
  rewarded: 30_000,      // 보상형: 최소 30초 간격
} as const;

export type AdType = keyof typeof AD_GROUP_IDS;
