"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BirthInfoForm } from "@/components/saju/BirthInfoForm";
import { apiUrl } from '@/lib/config';
import { getStateManager } from '@/lib/state-manager';
import Link from 'next/link';

const IS_TOSS = process.env.NEXT_PUBLIC_BUILD_TARGET === 'toss';

const styles = IS_TOSS ? {
  page: 'min-h-screen bg-white',
  container: 'px-6 py-6 pb-[calc(100px+env(safe-area-inset-bottom))]',
  title: 'text-t3 font-bold text-tds-grey-900',
  subtitle: 'text-st8 text-tds-grey-700',
  card: 'bg-white border border-tds-grey-200 rounded-xl p-6',
  stepActive: 'w-8 h-8 rounded-full bg-tds-blue-500 text-white flex items-center justify-center text-t7 font-bold',
  stepInactive: 'w-8 h-8 rounded-full border-2 border-tds-grey-300 text-tds-grey-500 flex items-center justify-center text-t7',
  stepLine: 'h-0.5 flex-1 bg-tds-grey-200',
  stepLineActive: 'h-0.5 flex-1 bg-tds-blue-500',
  stepLabel: 'text-st11 text-tds-blue-500 font-medium',
  stepLabelInactive: 'text-st11 text-tds-grey-500',
  error: 'text-st10 text-tds-red-500',
} : {
  page: 'min-h-screen bg-background',
  container: 'px-4 py-8 max-w-2xl mx-auto pb-32',
  title: 'text-2xl font-bold text-white',
  subtitle: 'text-sm text-white/70',
  card: 'bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl p-6',
  stepActive: 'w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold',
  stepInactive: 'w-8 h-8 rounded-full border-2 border-white/20 text-white/40 flex items-center justify-center text-xs',
  stepLine: 'h-0.5 flex-1 bg-white/10',
  stepLineActive: 'h-0.5 flex-1 bg-primary',
  stepLabel: 'text-xs text-primary font-medium',
  stepLabelInactive: 'text-xs text-white/40',
  error: 'text-sm text-red-400',
} as const;

export default function BirthInfoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasConsented, setHasConsented] = useState(false);

  async function handleSubmit(data: {
    year: number;
    month: number;
    day: number;
    hour: number | null;
    gender: "male" | "female";
    isLunar: boolean;
  }) {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(apiUrl("/api/saju/calculate"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "분석 중 오류가 발생했습니다.");
      }

      const json = await res.json();
      const result = json?.data ?? json;

      sessionStorage.setItem("sajuResult", JSON.stringify(result));
      sessionStorage.setItem("saju-session-id", result.sessionId);
      // Persist to DB for toss environment
      const sm = getStateManager();
      sm.setSessionId(result.sessionId);
      await sm.save('sajuResult', result);
      router.push("/saju-preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={`min-h-screen ${IS_TOSS ? 'bg-white' : 'bg-background'} flex flex-col items-center justify-center ${IS_TOSS ? 'px-6' : 'px-4'} py-12`}>
      {/* 단계 표시 */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 flex items-center gap-2"
      >
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center gap-2">
            <div
              className={
                step === 1
                  ? styles.stepActive
                  : styles.stepInactive
              }
            >
              {step}
            </div>
            {step < 4 && <div className={styles.stepLine} />}
          </div>
        ))}
      </motion.div>

      {/* 글래스 카드 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-md rounded-2xl border border-white/10 p-8"
        style={IS_TOSS ? undefined : {
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(16px)",
        }}
      >
        {/* 제목 */}
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold text-primary/80 tracking-widest uppercase mb-2">
            Step 1 / 4
          </p>
          <h1 className={styles.title}>생년월일 입력</h1>
          <p className={`mt-2 ${styles.subtitle}`}>
            정확한 사주 분석을 위해 생년월일시를 입력해주세요.
          </p>
        </div>

        {/* 개인정보 수집 동의 */}
        <div className="mb-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => setHasConsented(!hasConsented)}
              className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                hasConsented
                  ? 'bg-primary border-primary'
                  : 'border-white/30 hover:border-white/50'
              }`}
            >
              {hasConsented && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <div className="flex-1">
              <p className="text-sm text-white/80 leading-relaxed">
                <span className="font-medium text-white">개인정보 수집 및 이용에 동의합니다.</span>
              </p>
              <p className="mt-1.5 text-xs text-white/40 leading-relaxed">
                수집 항목: 생년월일시, 성별, 양음력 여부 · 수집 목적: 사주 분석 서비스 제공 · 보유 기간: 서비스 탈퇴 시까지
              </p>
              <Link
                href="/privacy-policy"
                className="mt-2 inline-block text-xs text-primary/70 hover:text-primary underline underline-offset-2"
              >
                개인정보 처리방침 전문 보기
              </Link>
            </div>
          </div>
        </div>

        {/* 폼 */}
        <BirthInfoForm onSubmit={handleSubmit} isLoading={isLoading || !hasConsented} />

        {/* 에러 메시지 */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-4 text-center ${styles.error}`}
          >
            {error}
          </motion.p>
        )}
      </motion.div>

      {/* 안내 문구 */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 text-xs text-white/30 text-center max-w-xs"
      >
        입력하신 정보는 사주 분석 서비스 제공 외 다른 목적으로 사용되지 않습니다.
      </motion.p>
    </main>
  );
}
