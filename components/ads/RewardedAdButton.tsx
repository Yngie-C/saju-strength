'use client';

import { useState, useEffect, useCallback } from 'react';
import { showRewarded, preloadRewarded, isAdSupported } from '@/lib/ads/toss-ads';
import { designTokens } from '@/lib/design-tokens';

const IS_TOSS = process.env.NEXT_PUBLIC_BUILD_TARGET === 'toss';

interface RewardedAdButtonProps {
  onRewardEarned: (reward: { unitType?: string; unitAmount?: number }) => void;
  buttonText?: string;
  rewardDescription?: string;
  className?: string;
}

export function RewardedAdButton({
  onRewardEarned,
  buttonText = '광고 보고 추가 인사이트 받기',
  rewardDescription = '30초 광고 시청 후 프리미엄 분석을 무료로 확인하세요',
  className,
}: RewardedAdButtonProps) {
  const [loading, setLoading] = useState(false);
  const [adReady, setAdReady] = useState(false);
  const [supported, setSupported] = useState(false);

  // 광고 사전 로드
  useEffect(() => {
    if (!IS_TOSS) return;

    const checkAndPreload = async () => {
      if (!isAdSupported()) return;
      setSupported(true);
      const loaded = await preloadRewarded();
      setAdReady(loaded);
    };

    checkAndPreload();
  }, []);

  const handleClick = useCallback(async () => {
    if (loading || !supported) return;

    setLoading(true);
    try {
      const result = await showRewarded();
      if (result.rewarded) {
        onRewardEarned({
          unitType: result.unitType,
          unitAmount: result.unitAmount,
        });
      }
      // 다음 광고 사전 로드
      const nextLoaded = await preloadRewarded();
      setAdReady(nextLoaded);
    } catch {
      // 광고 실패 시 무시
    } finally {
      setLoading(false);
    }
  }, [loading, supported, onRewardEarned]);

  // 웹 빌드 또는 SDK 미지원 시 숨김
  if (!IS_TOSS || !supported) return null;

  return (
    <div className={className} data-testid="rewarded-ad-button">
      <p className={`text-st10 mb-3 text-center ${designTokens.textMuted}`}>
        {rewardDescription}
      </p>
      <button
        onClick={handleClick}
        disabled={loading || !adReady}
        className={`w-full py-3.5 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-opacity ${designTokens.primaryButton}`}
      >
        {loading ? '광고 로딩 중...' : !adReady ? '광고 준비 중...' : buttonText}
      </button>
    </div>
  );
}
