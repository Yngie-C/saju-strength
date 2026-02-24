'use client';

import React from 'react';

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

let TDSBottomCTA: any = null;
if (IS_TOSS) {
  try {
    TDSBottomCTA = require(/* webpackIgnore: true */ '@toss/tds-mobile').BottomCTA;
  } catch {
    // Fallback to web version
  }
}

export function AdaptiveBottomCTA({
  children,
  onClick,
  disabled,
  className = '',
  topAccessory,
}: AdaptiveBottomCTAProps) {
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
    // TDS unavailable — fallback plain button
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white safe-area-pb">
        {topAccessory && <div className="px-4 py-2 border-t">{topAccessory}</div>}
        <div className="px-4 py-3">
          <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full py-4 rounded-2xl font-bold text-white text-base transition-all ${
              disabled ? 'bg-gray-300' : 'bg-blue-500 active:bg-blue-600'
            } ${className}`}
          >
            {children}
          </button>
        </div>
      </div>
    );
  }

  // Web: gradient CTA button
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-white/10 px-4 py-4">
      {topAccessory && <div className="max-w-2xl mx-auto mb-3">{topAccessory}</div>}
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onClick}
          disabled={disabled}
          className={`w-full py-3.5 rounded-xl font-bold text-white transition-all duration-200
            bg-gradient-to-r from-indigo-600 to-purple-600
            disabled:opacity-40 disabled:cursor-not-allowed
            hover:from-indigo-500 hover:to-purple-500
            active:scale-[0.98] ${className}`}
        >
          {children}
        </button>
      </div>
    </div>
  );
}
