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

const TOSS_MINION_URL = 'https://minion.toss.im/B4th4OxD';

/**
 * 외부 공유 (네이티브 공유 시트 → Web Share API → clipboard)
 * - 토스 환경: tossShare() + minion URL
 * - 웹 환경: Web Share API → clipboard fallback
 */
export async function shareResult(data: ShareData): Promise<ShareResult> {
  const { title, description, path } = data;

  // 토스 환경: native share sheet + minion URL
  if (isTossEnvironment()) {
    const message = `${title}\n${description}\n${TOSS_MINION_URL}`;
    try {
      const success = await tossShare(message);
      return success ? 'shared' : 'failed';
    } catch {
      console.warn('[Share] Toss share failed, falling back');
    }
  }

  const webUrl = `${WEB_ORIGIN}${path || '/result'}`;
  const message = `${title}\n${description}\n${webUrl}`;

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

  // Fallback: clipboard API
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(message);
      return 'copied';
    } catch {
      // clipboard API failed, try execCommand
    }
  }

  // Last resort: execCommand('copy') — WebView 호환
  if (typeof document !== 'undefined') {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = message;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (success) return 'copied';
    } catch {
      // execCommand also failed
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
