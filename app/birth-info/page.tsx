"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BirthInfoForm } from "@/components/saju/BirthInfoForm";

export default function BirthInfoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const res = await fetch("/api/saju/calculate", {
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
      router.push("/saju-preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
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
                  ? "w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-white"
                  : "w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-sm font-medium text-white/30"
              }
            >
              {step}
            </div>
            {step < 4 && <div className="w-8 h-px bg-white/15" />}
          </div>
        ))}
      </motion.div>

      {/* 글래스 카드 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-md rounded-2xl border border-white/10 p-8"
        style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(16px)",
        }}
      >
        {/* 제목 */}
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold text-primary/80 tracking-widest uppercase mb-2">
            Step 1 / 4
          </p>
          <h1 className="text-2xl font-bold text-white">생년월일 입력</h1>
          <p className="mt-2 text-sm text-white/50">
            정확한 사주 분석을 위해 생년월일시를 입력해주세요.
          </p>
        </div>

        {/* 폼 */}
        <BirthInfoForm onSubmit={handleSubmit} isLoading={isLoading} />

        {/* 에러 메시지 */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-sm text-red-400 text-center"
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
        입력하신 정보는 사주 분석 외 다른 목적으로 사용되지 않습니다.
      </motion.p>
    </main>
  );
}
