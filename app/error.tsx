'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { designTokens } from '@/lib/design-tokens';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <div className={`flex flex-col items-center justify-center ${designTokens.pageMinHeight} ${designTokens.pagePadding}`}>
      <div className={`w-full ${designTokens.maxWidth} mx-auto text-center`}>
        <p className={`text-4xl mb-4`}>⚠️</p>
        <h1 className={`text-xl font-bold mb-2 ${designTokens.textPrimary}`}>
          오류가 발생했습니다
        </h1>
        <p className={`text-sm mb-8 ${designTokens.textSecondary}`}>
          예상치 못한 문제가 발생했습니다. 다시 시도해 주세요.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className={`w-full py-3.5 text-sm font-semibold ${designTokens.primaryButton}`}
          >
            처음부터 시작하기
          </button>
          <button
            onClick={() => router.push('/')}
            className={`w-full py-3.5 text-sm font-semibold ${designTokens.secondaryButton}`}
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
