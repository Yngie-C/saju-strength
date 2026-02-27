"use client";

import { designTokens } from '@/lib/design-tokens';
import { resultTokens as resultStyles } from '@/lib/section-styles';

function SkeletonBlock({ h = "h-40" }: { h?: string }) {
  return (
    <div
      className={`rounded-2xl border animate-pulse ${h} ${designTokens.skeletonBlock}`}
    />
  );
}

export function ResultSkeleton() {
  return (
    <div className={resultStyles.page}>
      <div className={`${designTokens.resultContainer} space-y-8`}>
        <div className="text-center space-y-3">
          <div className={`inline-flex items-center gap-2 ${designTokens.skeletonAccent}`}>
            <span className="animate-spin text-xl">⟳</span>
            <span className="text-sm font-medium">교차 분석 중...</span>
          </div>
          <p className={resultStyles.caption}>
            사주 오행과 PSA 강점을 비교 분석하고 있습니다
          </p>
        </div>
        <SkeletonBlock h="h-56" />
        <SkeletonBlock h="h-40" />
        <SkeletonBlock h="h-48" />
        <SkeletonBlock h="h-32" />
      </div>
    </div>
  );
}
