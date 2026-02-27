import { useState, useEffect } from 'react';

const IS_TOSS = process.env.NEXT_PUBLIC_BUILD_TARGET === 'toss';

/**
 * Adaptive component loader — toss 빌드에서만 TDS SDK 컴포넌트를 동적 로드
 * @returns [isToss, LoadedComponent | null]
 */
export function useAdaptiveLoader<T>(loader: () => T): [boolean, T | null] {
  const [Component, setComponent] = useState<T | null>(null);
  useEffect(() => {
    if (IS_TOSS) {
      try {
        setComponent(() => loader());
      } catch { /* fallback to web */ }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [IS_TOSS, Component];
}
