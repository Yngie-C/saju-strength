'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { isTossEnvironment } from '@/lib/toss';
import { apiUrl } from '@/lib/config';

interface TossAuthState {
  userId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// W-5: 메모리 내 토큰 저장 (XSS 방어 — localStorage 대신 모듈 스코프 변수 사용)
let memoryTokens: {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
} | null = null;

const AUTH_SESSION_KEY = 'saju-toss-user';

export function useTossAuth() {
  const [state, setState] = useState<TossAuthState>({
    userId: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 자동 갱신 스케줄링
  const scheduleRefresh = useCallback((expiresIn: number) => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }
    // 만료 5분 전에 갱신 시도
    const refreshDelay = Math.max((expiresIn - 300) * 1000, 0);
    refreshTimerRef.current = setTimeout(() => {
      refreshAccessToken();
    }, refreshDelay);
  }, []);

  // refreshToken으로 accessToken 갱신
  const refreshAccessToken = useCallback(async () => {
    if (!memoryTokens?.refreshToken) return;

    try {
      const response = await fetch(apiUrl('/api/auth/toss-refresh'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: memoryTokens.refreshToken }),
      });

      if (!response.ok) {
        // refreshToken 만료 — 재로그인 필요
        memoryTokens = null;
        sessionStorage.removeItem(AUTH_SESSION_KEY);
        setState({
          userId: null,
          isAuthenticated: false,
          isLoading: false,
          error: '세션이 만료되었습니다. 다시 로그인해주세요.',
        });
        return;
      }

      const data = await response.json();
      memoryTokens = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: Date.now() + (data.expiresIn * 1000),
      };
      scheduleRefresh(data.expiresIn);
    } catch {
      console.warn('[useTossAuth] Token refresh failed');
    }
  }, [scheduleRefresh]);

  // 저장된 사용자 ID 복원 (토큰은 메모리에서만 관리)
  useEffect(() => {
    try {
      const savedUserId = sessionStorage.getItem(AUTH_SESSION_KEY);
      if (savedUserId && memoryTokens && memoryTokens.expiresAt > Date.now()) {
        setState({
          userId: savedUserId,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        const remainingSeconds = Math.floor((memoryTokens.expiresAt - Date.now()) / 1000);
        scheduleRefresh(remainingSeconds);
        return;
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

    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [scheduleRefresh]);

  // 토스 로그인 실행
  const login = useCallback(async () => {
    if (!isTossEnvironment()) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { appLogin } = await import(/* webpackIgnore: true */ '@apps-in-toss/web-framework');
      const { authorizationCode, referrer } = await appLogin();

      const response = await fetch(apiUrl('/api/auth/toss-token'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorizationCode, referrer }),
      });

      if (!response.ok) {
        throw new Error('인증 실패');
      }

      const data = await response.json();

      // W-5: 토큰은 메모리에만 저장 (XSS 방어)
      memoryTokens = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: Date.now() + (data.expiresIn * 1000),
      };

      // userId만 sessionStorage에 저장 (토큰 아님)
      sessionStorage.setItem(AUTH_SESSION_KEY, data.userId);

      // 자동 갱신 스케줄링
      scheduleRefresh(data.expiresIn);

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
  }, [scheduleRefresh]);

  const logout = useCallback(() => {
    memoryTokens = null;
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }
    setState({
      userId: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, []);

  // accessToken 접근자 (메모리에서만 읽기)
  const getAccessToken = useCallback(() => {
    return memoryTokens?.accessToken ?? null;
  }, []);

  return { ...state, login, logout, getAccessToken };
}
