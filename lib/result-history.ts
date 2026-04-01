'use client';

const STORAGE_KEY = 'saju-result-history';
const MAX_ENTRIES = 10;

export interface ResultHistoryEntry {
  id: string;
  name: string | null;
  birthDate: string;       // "1990-03-15"
  birthTime: string | null; // "14:30" or null
  gender: 'male' | 'female';
  personaType: string;
  personaTitle: string;
  personaTagline: string;
  dominantElement: string;
  dayMasterName: string;
  topCategories: [string, number][];
  savedAt: string;          // ISO string
}

function readHistory(): ResultHistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ResultHistoryEntry[];
  } catch {
    return [];
  }
}

function writeHistory(entries: ResultHistoryEntry[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // localStorage full or unavailable
  }
}

/** 결과 저장 (같은 생년월일+시간이면 갱신, 아니면 추가) */
export function saveResultToHistory(entry: Omit<ResultHistoryEntry, 'id' | 'savedAt'>): ResultHistoryEntry {
  const history = readHistory();
  const id = `${entry.birthDate}-${entry.birthTime ?? 'unknown'}-${Date.now()}`;
  const saved: ResultHistoryEntry = { ...entry, id, savedAt: new Date().toISOString() };

  // 같은 생년월일+시간+이름이면 기존 항목 갱신
  const existingIndex = history.findIndex(
    (h) => h.birthDate === entry.birthDate && h.birthTime === entry.birthTime && h.name === entry.name
  );

  if (existingIndex >= 0) {
    history[existingIndex] = saved;
  } else {
    history.unshift(saved);
  }

  // 최대 개수 제한
  const trimmed = history.slice(0, MAX_ENTRIES);
  writeHistory(trimmed);
  return saved;
}

/** 전체 히스토리 조회 (최신순) */
export function getResultHistory(): ResultHistoryEntry[] {
  return readHistory();
}

/** 특정 결과 조회 */
export function getResultById(id: string): ResultHistoryEntry | null {
  return readHistory().find((h) => h.id === id) ?? null;
}

/** 특정 결과 삭제 */
export function deleteResultFromHistory(id: string): void {
  const history = readHistory().filter((h) => h.id !== id);
  writeHistory(history);
}

/** 전체 히스토리 삭제 */
export function clearResultHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
