'use client';

import { isTossEnvironment, createTossShareLink, tossShare } from '@/lib/toss';

export interface ShareData {
  title: string;
  description: string;
  path?: string;
  imageUrl?: string;
}

export type ShareResult = 'shared' | 'copied' | 'failed' | 'cancelled';

/**
 * 결과 공유 통합 서비스
 * - 토스 환경: Toss native share
 * - 웹 환경: Web Share API → clipboard fallback
 */
export async function shareResult(data: ShareData): Promise<ShareResult> {
  const { title, description, path, imageUrl } = data;

  // 토스 환경: native share
  if (isTossEnvironment()) {
    try {
      const shareLink = await createTossShareLink(
        path || '/result',
        imageUrl
      );

      if (shareLink) {
        const success = await tossShare(`${title}\n${description}\n${shareLink}`);
        return success ? 'shared' : 'failed';
      }
    } catch {
      console.warn('[Share] Toss share failed, falling back');
    }
  }

  // 웹 환경: Web Share API
  const url = typeof window !== 'undefined'
    ? `${window.location.origin}${path || '/result'}`
    : '';

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title, text: description, url });
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
      await navigator.clipboard.writeText(`${title}\n${description}\n${url}`);
      return 'copied';
    } catch {
      // clipboard failed
    }
  }

  return 'failed';
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
        mobileWebUrl: data.profileUrl || 'https://saju-strength.vercel.app',
        webUrl: data.profileUrl || 'https://saju-strength.vercel.app',
      },
    },
    buttons: [
      {
        title: '나도 분석받기',
        link: {
          mobileWebUrl: 'https://saju-strength.vercel.app',
          webUrl: 'https://saju-strength.vercel.app',
        },
      },
    ],
  };
}
