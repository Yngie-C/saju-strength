'use client';

import { apiUrl } from '@/lib/config';
import { isTossEnvironment } from '@/lib/toss';

// Storage keys
const KEYS = {
  SESSION_ID: 'saju-session-id',
  SAJU_RESULT: 'sajuResult',
  PSA_RESULT: 'psaResult',
  SURVEY_ANSWERS: 'saju-survey-answers',
  SURVEY_PAGE: 'saju-survey-page',
} as const;

type StateKey = 'sajuResult' | 'psaResult' | 'surveyAnswers' | 'surveyPage';

class StateManager {
  private useDB: boolean;

  constructor() {
    this.useDB = isTossEnvironment();
  }

  /** 현재 세션 ID 가져오기 (없으면 생성) */
  getSessionId(): string {
    if (typeof window === 'undefined') return '';
    let sessionId = sessionStorage.getItem(KEYS.SESSION_ID);
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(KEYS.SESSION_ID, sessionId);
    }
    return sessionId;
  }

  /** 세션 ID 설정 (API 응답에서 받은 ID 저장) */
  setSessionId(id: string): void {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(KEYS.SESSION_ID, id);
  }

  /** 데이터 저장 (sessionStorage + optional DB) */
  async save<T>(key: StateKey, data: T): Promise<void> {
    if (typeof window === 'undefined') return;

    const storageKey = this.getStorageKey(key);

    // Always save to sessionStorage as cache
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(data));
    } catch {
      // sessionStorage full or unavailable
    }

    // Also save to localStorage for survey answers (persist across sessions)
    if (key === 'surveyAnswers' || key === 'surveyPage') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(data));
      } catch {
        // ignore
      }
    }

    // DB persistence for toss environment
    if (this.useDB) {
      try {
        await fetch(apiUrl('/api/state/save'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: this.getSessionId(),
            key,
            data,
          }),
        });
      } catch {
        // DB save failed, sessionStorage still has the data
        console.warn('[StateManager] DB save failed for:', key);
      }
    }
  }

  /** 데이터 로드 (sessionStorage → localStorage → DB 순서) */
  async load<T>(key: StateKey): Promise<T | null> {
    if (typeof window === 'undefined') return null;

    const storageKey = this.getStorageKey(key);

    // 1. Try sessionStorage first (fastest)
    try {
      const cached = sessionStorage.getItem(storageKey);
      if (cached) return JSON.parse(cached) as T;
    } catch {
      // ignore
    }

    // 2. Try localStorage (for survey answers)
    if (key === 'surveyAnswers' || key === 'surveyPage') {
      try {
        const local = localStorage.getItem(storageKey);
        if (local) return JSON.parse(local) as T;
      } catch {
        // ignore
      }
    }

    // 3. Try DB (for toss environment or when sessionStorage lost)
    try {
      const sessionId = this.getSessionId();
      const response = await fetch(
        apiUrl(`/api/state/load?sessionId=${sessionId}&key=${key}`)
      );
      if (response.ok) {
        const result = await response.json();
        if (result.data) {
          // Re-cache in sessionStorage
          try {
            sessionStorage.setItem(storageKey, JSON.stringify(result.data));
          } catch {
            // ignore
          }
          return result.data as T;
        }
      }
    } catch {
      // DB load failed
    }

    return null;
  }

  /** 특정 키 삭제 */
  remove(key: StateKey): void {
    if (typeof window === 'undefined') return;
    const storageKey = this.getStorageKey(key);
    try {
      sessionStorage.removeItem(storageKey);
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  }

  /** 전체 상태 초기화 */
  clear(): void {
    if (typeof window === 'undefined') return;
    Object.values(KEYS).forEach(k => {
      try {
        sessionStorage.removeItem(k);
        localStorage.removeItem(k);
      } catch {
        // ignore
      }
    });
  }

  private getStorageKey(key: StateKey): string {
    switch (key) {
      case 'sajuResult': return KEYS.SAJU_RESULT;
      case 'psaResult': return KEYS.PSA_RESULT;
      case 'surveyAnswers': return KEYS.SURVEY_ANSWERS;
      case 'surveyPage': return KEYS.SURVEY_PAGE;
    }
  }
}

// Singleton
let _instance: StateManager | null = null;

export function getStateManager(): StateManager {
  if (!_instance) {
    _instance = new StateManager();
  }
  return _instance;
}

export { StateManager };
export type { StateKey };
