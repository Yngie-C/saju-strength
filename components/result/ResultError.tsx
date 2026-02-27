"use client";

import { designTokens } from '@/lib/design-tokens';
import { resultTokens as resultStyles } from '@/lib/section-styles';

interface ResultErrorProps {
  error: string;
}

export function ResultError({ error }: ResultErrorProps) {
  return (
    <div className={`${resultStyles.page} flex items-center justify-center px-4`}>
      <div className="text-center space-y-4 max-w-sm">
        <p className="text-4xl">⚠</p>
        <p className={resultStyles.bodyText}>{error}</p>
        <button
          onClick={() => (window.location.href = "/survey")}
          className={`mt-4 px-6 py-2.5 text-sm font-semibold ${designTokens.primaryButton}`}
        >
          처음부터 시작하기
        </button>
      </div>
    </div>
  );
}
