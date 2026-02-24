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
import { designTokens, IS_TOSS } from '@/lib/design-tokens';

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

const styles = IS_TOSS ? {
  page: 'min-h-screen bg-white',
  container: 'px-6 py-6 pb-[calc(100px+env(safe-area-inset-bottom))]',
  title: 'text-t3 font-bold text-tds-grey-900',
  subtitle: 'text-st8 text-tds-grey-700',
  card: 'bg-white border border-tds-grey-200 rounded-xl p-5',
  sectionTitle: 'text-t4 font-bold text-tds-grey-900',
  bodyText: 'text-st8 text-tds-grey-700',
  caption: 'text-st11 text-tds-grey-500',
  stepActive: 'w-8 h-8 rounded-full bg-tds-blue-500 text-white flex items-center justify-center text-t7 font-bold',
  stepInactive: 'w-8 h-8 rounded-full border-2 border-tds-grey-300 text-tds-grey-500 flex items-center justify-center text-t7',
  divider: 'border-t border-tds-grey-200',
} : {
  page: 'min-h-screen bg-background',
  container: 'px-4 py-8 max-w-2xl mx-auto pb-32',
  title: 'text-2xl font-bold text-foreground',
  subtitle: 'text-sm text-muted-foreground',
  card: 'bg-card border border-border rounded-2xl p-5',
  sectionTitle: 'text-xl font-bold text-foreground',
  bodyText: 'text-sm text-muted-foreground',
  caption: 'text-xs text-muted-foreground/50',
  stepActive: 'w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold',
  stepInactive: 'w-8 h-8 rounded-full border-2 border-border text-muted-foreground/50 flex items-center justify-center text-xs',
  divider: 'border-t border-border',
} as const;

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
      <main className={`min-h-screen bg-background flex flex-col items-center justify-center gap-4 ${IS_TOSS ? 'px-6' : 'px-4'}`}>
        <p className="text-destructive text-sm">{error}</p>
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
    <main className={`${styles.page} ${IS_TOSS ? 'px-6' : 'px-4'} py-12`}>
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
                    ? styles.stepActive
                    : styles.stepInactive
                }
              >
                {step}
              </div>
              {step < 4 && (
                IS_TOSS
                  ? <div className="w-8 h-px bg-tds-grey-200" />
                  : <div className="w-8 h-px bg-border" />
              )}
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
          <p className={IS_TOSS ? 'text-st11 font-semibold text-tds-blue-500 tracking-widest uppercase mb-2' : 'text-xs font-semibold text-primary/80 tracking-widest uppercase mb-2'}>
            Step 2 / 4
          </p>
          <h1 className={styles.title}>사주 미리보기</h1>
          <p className={`mt-2 ${styles.subtitle}`}>
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
                  className={IS_TOSS
                    ? "rounded-xl border border-tds-grey-200 flex flex-col items-center justify-center py-10 text-tds-grey-400 text-sm"
                    : "rounded-2xl border border-border bg-card flex flex-col items-center justify-center py-10 text-muted-foreground/40 text-sm"}
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
          className={IS_TOSS
            ? "rounded-xl border border-tds-grey-200 p-6 bg-white"
            : "rounded-2xl border border-border bg-card p-6"}
        >
          <h2 className={`text-base font-semibold mb-6 text-center ${IS_TOSS ? 'text-tds-grey-900' : 'text-foreground'}`}>
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
          <h2 className={`text-base font-semibold mb-4 text-center ${IS_TOSS ? 'text-tds-grey-900' : 'text-foreground'}`}>
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
          className={IS_TOSS
            ? "rounded-xl border border-tds-blue-200 p-6 text-center bg-tds-blue-50"
            : "rounded-2xl border border-primary/30 p-6 text-center bg-primary/10"}
        >
          <p className={`font-medium mb-1 ${IS_TOSS ? 'text-tds-grey-900' : 'text-foreground'}`}>
            더 정확한 분석을 원하시나요?
          </p>
          <p className={`text-sm mb-5 ${IS_TOSS ? 'text-tds-grey-600' : 'text-muted-foreground'}`}>
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
