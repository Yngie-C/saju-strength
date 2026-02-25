/**
 * 설문 분석 비동기 처리 모듈
 *
 * 설문 완료 → 즉시 /birth-info 이동 → 백그라운드에서 분석 처리
 * 사주 입력 완료 시 분석 결과를 await하여 합류
 */
import { BriefAnalysis } from '@/types/survey';

let _pendingAnalysis: Promise<BriefAnalysis> | null = null;

/** 백그라운드 설문 분석 Promise 등록 */
export function setPendingAnalysis(promise: Promise<BriefAnalysis>): void {
  _pendingAnalysis = promise;
}

/** 백그라운드 설문 분석 결과 대기 (없으면 null 반환) */
export function getPendingAnalysis(): Promise<BriefAnalysis> | null {
  return _pendingAnalysis;
}

/** 완료 후 정리 */
export function clearPendingAnalysis(): void {
  _pendingAnalysis = null;
}
