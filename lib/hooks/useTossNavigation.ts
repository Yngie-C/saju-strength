'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { isTossEnvironment, onBackButton } from '@/lib/toss';

interface UseTossNavigationOptions {
  /** 뒤로가기 시 확인 메시지 (설정하면 확인 팝업 표시) */
  confirmMessage?: string;
  /** 뒤로가기 시 실행할 커스텀 핸들러 */
  onBack?: () => boolean | void; // return false to prevent navigation
}

export function useTossNavigation(options: UseTossNavigationOptions = {}) {
  const router = useRouter();
  const { confirmMessage, onBack } = options;

  useEffect(() => {
    if (!isTossEnvironment()) return;

    const unsubscribe = onBackButton(() => {
      if (onBack) {
        const shouldNavigate = onBack();
        if (shouldNavigate === false) return;
      }

      if (confirmMessage) {
        const confirmed = window.confirm(confirmMessage);
        if (!confirmed) return;
      }

      router.back();
    });

    return () => {
      unsubscribe();
    };
  }, [router, confirmMessage, onBack]);

  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  const navigateTo = useCallback((path: string) => {
    router.push(path);
  }, [router]);

  return { goBack, navigateTo, isToss: isTossEnvironment() };
}
