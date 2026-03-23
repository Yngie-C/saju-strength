'use client';

import { isTossEnvironment, tossShareInternal, tossShare } from '@/lib/toss';
import { WEB_ORIGIN } from '@/lib/config';

export interface ShareData {
  title: string;
  description: string;
  path?: string;
  imageUrl?: string;
}

export type ShareResult = 'shared' | 'copied' | 'failed' | 'cancelled';

/**
 * 외부 공유 (네이티브 공유 시트 → Web Share API → clipboard)
 * - 토스 환경: tossShare() + 웹 URL (누구나 접근 가능)
 * - 웹 환경: Web Share API → clipboard fallback
 */
export async function shareResult(data: ShareData): Promise<ShareResult> {
  const { title, description, path } = data;
  const webUrl = `${WEB_ORIGIN}${path || '/result'}`;
  const message = `${title}\n${description}\n${webUrl}`;

  // 토스 환경: native share sheet + 웹 URL
  if (isTossEnvironment()) {
    try {
      const success = await tossShare(message);
      return success ? 'shared' : 'failed';
    } catch {
      console.warn('[Share] Toss share failed, falling back');
    }
  }

  // 웹 환경: Web Share API
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title, text: description, url: webUrl });
      return 'shared';
    } catch (error) {
      // User cancelled or share failed
      if (error instanceof Error && error.name === 'AbortError') {
        return 'cancelled';
      }
    }
  }

  // Fallback: clipboard
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(message);
      return 'copied';
    } catch {
      // clipboard failed
    }
  }

  return 'failed';
}

/**
 * 토스 내부 공유 (intoss:// 스킴 URL — 토스 사용자끼리 미니앱 직접 열기)
 */
export async function shareToToss(data: ShareData): Promise<ShareResult> {
  const { title, description, path } = data;
  const schemeUrl = `intoss://saju-strength${path || '/result'}`;
  const displayText = `${title}\n${description}`;

  try {
    const success = await tossShareInternal(schemeUrl, displayText);
    return success ? 'shared' : 'failed';
  } catch {
    console.warn('[Share] Toss internal share failed');
    return 'failed';
  }
}

/**
 * 카카오톡 공유 카드 데이터 생성 (향후 카카오 SDK 연동용)
 */
export function buildKakaoShareCard(data: {
  personaTitle: string;
  personaTagline: string;
  dominantElement: string;
  profileUrl?: string;
}) {
  return {
    objectType: 'feed',
    content: {
      title: `나의 사주강점: ${data.personaTitle}`,
      description: data.personaTagline,
      imageUrl: '', // TODO: OG image generation
      link: {
        mobileWebUrl: data.profileUrl || WEB_ORIGIN,
        webUrl: data.profileUrl || WEB_ORIGIN,
      },
    },
    buttons: [
      {
        title: '나도 분석받기',
        link: {
          mobileWebUrl: WEB_ORIGIN,
          webUrl: WEB_ORIGIN,
        },
      },
    ],
  };
}
