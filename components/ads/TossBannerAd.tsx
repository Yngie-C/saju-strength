'use client';

import { useEffect, useRef, useState } from 'react';
import { attachBannerAd, isAdSupported } from '@/lib/ads/toss-ads';

const IS_TOSS = process.env.NEXT_PUBLIC_BUILD_TARGET === 'toss';

interface TossBannerAdProps {
  className?: string;
  theme?: 'auto' | 'light' | 'dark';
  variant?: 'card' | 'expanded';
  onAdRendered?: () => void;
  onNoFill?: () => void;
}

export function TossBannerAd({
  className,
  theme = 'auto',
  variant = 'card',
  onAdRendered,
  onNoFill,
}: TossBannerAdProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!IS_TOSS || !isAdSupported() || !containerRef.current) {
      onNoFill?.();
      return;
    }

    let destroyFn: (() => void) | null = null;

    attachBannerAd(containerRef.current, { theme, variant })
      .then((destroy) => {
        if (destroy) {
          destroyFn = destroy;
          setVisible(true);
          onAdRendered?.();
        } else {
          onNoFill?.();
        }
      })
      .catch(() => {
        onNoFill?.();
      });

    return () => {
      destroyFn?.();
    };
  }, [theme, variant, onAdRendered, onNoFill]);

  // 웹 빌드 또는 SDK 미지원 시 렌더링 안 함
  if (!IS_TOSS) return null;

  return (
    <div
      ref={containerRef}
      className={`${visible ? '' : 'hidden'} ${className ?? ''}`}
      data-testid="toss-banner-ad"
    />
  );
}
