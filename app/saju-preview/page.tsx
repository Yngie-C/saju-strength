"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SajuPillarCard } from "@/components/saju/SajuPillarCard";
import { FiveElementsChart } from "@/components/saju/FiveElementsChart";
import { ArchetypeCard } from "@/components/saju/ArchetypeCard";
import { Button } from "@/components/ui/button";
import type { SajuAnalysis } from "@/types/saju";
import { getStateManager } from '@/lib/state-manager';

const PILLAR_LABELS = ["년주", "월주", "일주", "시주"] as const;

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function SajuPreviewPage() {
  const router = useRouter();
  const [result, setResult] = useState<SajuAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadResult() {
      try {
        // Try sessionStorage first
        const raw = sessionStorage.getItem("sajuResult");
        if (raw) {
          setResult(JSON.parse(raw) as SajuAnalysis);
          return;
        }
        // Fallback: state manager (DB)
        const sm = getStateManager();
        const dbResult = await sm.load<SajuAnalysis>('sajuResult');
        if (dbResult) {
          setResult(dbResult);
          return;
        }
        throw new Error("분석 결과가 없습니다. 다시 시작해주세요.");
      } catch (e) {
        setError(e instanceof Error ? e.message : "데이터를 불러올 수 없습니다.");
      }
    }
    loadResult();
  }, []);

  if (error) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-red-400 text-sm">{error}</p>
        <Button onClick={() => router.push("/birth-info")}>다시 시작</Button>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <span className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </main>
    );
  }

  const { fourPillars, dayMaster, elementDistribution } = result;

  const pillars = [
    fourPillars.year,
    fourPillars.month,
    fourPillars.day,
    fourPillars.hour,
  ];

  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="max-w-2xl mx-auto space-y-10">
        {/* 단계 표시 */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 justify-center"
        >
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center gap-2">
              <div
                className={
                  step <= 2
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

        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          <p className="text-xs font-semibold text-primary/80 tracking-widest uppercase mb-2">
            Step 2 / 4
          </p>
          <h1 className="text-2xl font-bold text-white">사주 미리보기</h1>
          <p className="mt-2 text-sm text-white/50">
            타고난 사주 기둥과 오행 분포를 확인하세요.
          </p>
        </motion.div>

        {/* 4기둥 카드 */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {PILLAR_LABELS.map((label, i) => {
            const pillar = pillars[i];
            if (!pillar) {
              return (
                <motion.div
                  key={label}
                  variants={fadeUp}
                  className="rounded-2xl border border-white/5 flex flex-col items-center justify-center py-10 text-white/20 text-sm"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                >
                  {label}
                  <br />
                  <span className="text-xs mt-1">시진 미입력</span>
                </motion.div>
              );
            }
            return (
              <motion.div key={label} variants={fadeUp}>
                <SajuPillarCard
                  label={label}
                  stem={pillar.stem}
                  branch={pillar.branch}
                  stemElement={pillar.stemElement}
                  branchElement={pillar.branchElement}
                  isHighlighted={label === "일주"}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* 오행 분포 */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-white/10 p-6"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <h2 className="text-base font-semibold text-white mb-6 text-center">
            오행 분포
          </h2>
          <FiveElementsChart distribution={elementDistribution} />
        </motion.section>

        {/* 아키타입 */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-base font-semibold text-white mb-4 text-center">
            일간 아키타입
          </h2>
          <ArchetypeCard
            name={dayMaster.name}
            element={dayMaster.element}
            keywords={dayMaster.keywords}
            description={dayMaster.description}
            image={dayMaster.image}
          />
        </motion.section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="rounded-2xl border border-primary/30 p-6 text-center"
          style={{ background: "rgba(139,92,246,0.08)" }}
        >
          <p className="text-white font-medium mb-1">
            더 정확한 분석을 원하시나요?
          </p>
          <p className="text-sm text-white/50 mb-5">
            강점 설문을 진행하면 선천적 기질과 후천적 강점을 교차 분석한
            나만의 리포트를 받을 수 있어요.
          </p>
          <Button
            onClick={() => router.push("/survey")}
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 h-auto text-base"
          >
            강점 설문 시작하기
          </Button>
        </motion.div>
      </div>
    </main>
  );
}
