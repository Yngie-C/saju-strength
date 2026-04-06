'use client';

import { useEffect, useState, useCallback } from 'react';
import { IS_TOSS, designTokens } from '@/lib/design-tokens';
import { useTossAuth } from '@/lib/hooks/useTossAuth';

interface LoginCTAProps {
  onLoginSuccess: () => void;
}

export function LoginCTA({ onLoginSuccess }: LoginCTAProps) {
  const { isAuthenticated, isLoading, error, login } = useTossAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  const [wasLoggedIn, setWasLoggedIn] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !wasLoggedIn && !isLoading) {
      setWasLoggedIn(true);
      setShowSuccess(true);
      onLoginSuccess();
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading, wasLoggedIn, onLoginSuccess]);

  const handleLogin = useCallback(async () => {
    await login();
  }, [login]);

  if (!IS_TOSS) return null;

  // 이미 로그인 완료 상태이고 success 표시 시간도 지났으면 숨김
  if (isAuthenticated && !showSuccess) return null;

  return (
    <div className="px-4 space-y-2">
      <p className="text-center text-sm text-tds-grey-500">
        로그인하면 새 콘텐츠가 공개될 때 알림을 받을 수 있어요
      </p>
      {showSuccess ? (
        <div className={`w-full py-3.5 font-semibold text-sm rounded-xl text-center ${designTokens.primaryButton}`}>
          저장 완료 ✓
        </div>
      ) : isLoading ? (
        <div className="w-full py-3.5 flex items-center justify-center rounded-xl bg-tds-blue-500">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className={`w-full py-3.5 font-semibold text-sm transition-opacity ${designTokens.primaryButton}`}
        >
          로그인하고 성장 플랜 알림 받기
        </button>
      )}
      {error && (
        <p className="text-center text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
