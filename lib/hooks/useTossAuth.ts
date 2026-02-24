'use client';

import { useState, useEffect, useCallback } from 'react';
import { isTossEnvironment } from '@/lib/toss';
import { apiUrl } from '@/lib/config';

interface TossAuthState {
  userId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const AUTH_STORAGE_KEY = 'saju-toss-auth';

export function useTossAuth() {
  const [state, setState] = useState<TossAuthState>({
    userId: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // 저장된 인증 정보 복원
  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.userId && parsed.expiresAt > Date.now()) {
          setState({
            userId: parsed.userId,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return;
        }
      }
    } catch {
      // ignore
    }

    // 토스 환경이 아니면 세션 기반 ID 사용
    if (!isTossEnvironment()) {
      const sessionId = sessionStorage.getItem('saju-session-id') ||
        `web-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setState({
        userId: sessionId,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return;
    }

    setState(prev => ({ ...prev, isLoading: false }));
  }, []);

  // 토스 로그인 실행
  const login = useCallback(async () => {
    if (!isTossEnvironment()) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // 동적 import - 토스 환경에서만 로드
      const { appLogin } = await import(/* webpackIgnore: true */ '@apps-in-toss/web-framework');
      const { authorizationCode, referrer } = await appLogin();

      // 서버에서 토큰 교환
      const response = await fetch(apiUrl('/api/auth/toss-token'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorizationCode, referrer }),
      });

      if (!response.ok) {
        throw new Error('인증 실패');
      }

      const data = await response.json();

      // 로컬 저장
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
        userId: data.userId,
        accessToken: data.accessToken,
        expiresAt: Date.now() + (data.expiresIn * 1000),
      }));

      setState({
        userId: data.userId,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState({
        userId: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : '로그인 실패',
      });
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setState({
      userId: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, []);

  return { ...state, login, logout };
}
