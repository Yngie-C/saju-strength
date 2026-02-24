'use client';

import React, { useState, useEffect } from 'react';

interface AdaptiveBottomCTAProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  /** 키보드 위에 고정 (토스 전용) */
  fixedAboveKeyboard?: boolean;
  /** 상단 액세서리 컴포넌트 */
  topAccessory?: React.ReactNode;
}

const IS_TOSS = process.env.NEXT_PUBLIC_BUILD_TARGET === 'toss';

export function AdaptiveBottomCTA({
  children,
  onClick,
  disabled,
  className = '',
  topAccessory,
}: AdaptiveBottomCTAProps) {
  const [TDSBottomCTA, setTDSBottomCTA] = useState<any>(null);

  useEffect(() => {
    if (IS_TOSS) {
      try {
        setTDSBottomCTA(() => require('@toss/tds-mobile').BottomCTA);
      } catch {
        // Fallback to web version
      }
    }
  }, []);

  if (IS_TOSS && TDSBottomCTA) {
    // TDS BottomCTA.Single — wraps a single action button
    return (
      <TDSBottomCTA>
        {topAccessory && <TDSBottomCTA.TopAccessory>{topAccessory}</TDSBottomCTA.TopAccessory>}
        <TDSBottomCTA.Single
          onClick={onClick}
          disabled={disabled}
          className={className}
        >
          {children}
        </TDSBottomCTA.Single>
      </TDSBottomCTA>
    );
  }

  if (IS_TOSS && !TDSBottomCTA) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white z-50">
        <div className="h-9 bg-gradient-to-b from-transparent to-white pointer-events-none -mt-9" />
        {topAccessory && <div className="px-5 py-2">{topAccessory}</div>}
        <div className="px-5 pb-[calc(12px+env(safe-area-inset-bottom))]">
          <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full py-4 rounded-[14px] font-bold text-white text-t5 transition-colors ${
              disabled
                ? 'bg-tds-grey-300 cursor-not-allowed'
                : 'bg-tds-blue-500 active:bg-tds-blue-600'
            } ${className}`}
          >
            {children}
          </button>
        </div>
      </div>
    );
  }

  // Web: primary CTA button
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-4 py-4">
      {topAccessory && <div className="max-w-2xl mx-auto mb-3">{topAccessory}</div>}
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onClick}
          disabled={disabled}
          className={`w-full py-3.5 rounded-[14px] font-bold text-primary-foreground transition-all duration-200
            bg-primary
            disabled:opacity-40 disabled:cursor-not-allowed
            hover:bg-primary/90
            active:scale-[0.98] ${className}`}
        >
          {children}
        </button>
      </div>
    </div>
  );
}
