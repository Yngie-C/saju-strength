"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AxisAnalysis } from "@/types/saju";
import { IS_TOSS, designTokens } from '@/lib/design-tokens';
import { resultTokens as resultStyles } from '@/lib/section-styles';
import { parseGrowthGuide } from '@/lib/combined/parse-growth-guide';
import { useResultData } from '@/hooks/useResultData';
import { ResultSkeleton } from "@/components/result/ResultSkeleton";
import { ResultError } from "@/components/result/ResultError";
import { SajuProfileSection } from "@/components/result/SajuProfileSection";
import { PsaProfileSection } from "@/components/result/PsaProfileSection";
import { CrossAnalysisSection } from "@/components/result/CrossAnalysisSection";
import { GrowthGuideSection } from "@/components/result/GrowthGuideSection";
import { TossBannerAd } from '@/components/ads/TossBannerAd';
import { Toast } from '@/components/ui/Toast';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { trackScreen, trackClick, trackImpression } from '@/lib/analytics';

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const PSA_LABELS: Record<string, string> = {
  innovation: "혁신 사고",
  execution: "철저 실행",
  influence: "대인 영향",
  collaboration: "협업 공감",
  resilience: "상황 회복",
};

function SectionDivider() {
  return <div className={resultStyles.divider} />;
}

function ShareBottomSheet({
  open,
  onClose,
  onShareExternal,
  onShareToss,
}: {
  open: boolean;
  onClose: () => void;
  onShareExternal: () => void;
  onShareToss: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[16px] px-5 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3"
          >
            <div className="w-10 h-1 bg-tds-grey-300 rounded-full mx-auto mb-4" />
            <p className="text-base font-semibold text-tds-grey-900 mb-4">공유 방법을 선택해주세요</p>
            <div className="space-y-3">
              <button
                onClick={() => { onShareToss(); onClose(); }}
                className="w-full py-4 rounded-[14px] font-bold text-white bg-tds-blue-500 active:bg-tds-blue-600 transition-colors"
              >
                토스 친구에게 공유
              </button>
              {/* TODO: 외부 공유 활성화 시 주석 해제
              <button
                onClick={() => { onShareExternal(); onClose(); }}
                className="w-full py-4 rounded-[14px] font-bold bg-tds-grey-100 text-tds-grey-900 active:bg-tds-grey-200 transition-colors"
              >
                다른 앱으로 공유
              </button>
              */}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function ResultPage() {
  const { sajuResult, psaResult, combined, loading, error, shareStatus, handleShare, handleShareToToss, resetShareStatus } = useResultData();
  const [showShareSheet, setShowShareSheet] = useState(false);

  const onShareClick = useCallback(() => {
    trackClick('result', 'share');
    if (IS_TOSS) {
      setShowShareSheet(true);
    } else {
      handleShare();
    }
  }, [handleShare]);

  useEffect(() => {
    if (!loading && sajuResult && psaResult && combined) {
      trackScreen('result');
    }
  }, [loading, sajuResult, psaResult, combined]);

  if (loading) return <ResultSkeleton />;
  if (error) return <ResultError error={error} />;
  if (!sajuResult || !psaResult || !combined) return null;

  const growthGuide = parseGrowthGuide(combined.growthGuide);
  const radarData = psaResult.radarData.map((d) => ({ category: PSA_LABELS[d.category] ?? d.category, score: d.score }));
  const brandingMessages = psaResult.brandingMessages ?? undefined;
  const strengthTips = psaResult.strengthTips?.map((t) => ({ title: t.strength, description: `${t.tip} (${t.scenario})` }));

  return (
    <div className={resultStyles.page}>
      <div className={`${resultStyles.container} space-y-12`}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-2"
        >
          <h1 className={resultStyles.title}>나의 강점 분석 리포트</h1>
          <p className={resultStyles.subtitle}>사주 오행 × PSA 강점 — 선천과 후천의 교차</p>
        </motion.div>

        <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" onViewportEnter={() => trackImpression('result', 'saju_profile')} viewport={{ once: true, margin: "-60px" }}>
          <ErrorBoundary>
            <SajuProfileSection
              fourPillars={sajuResult.fourPillars}
              dayMaster={{ name: sajuResult.dayMaster.name, nameEn: sajuResult.dayMaster.nameEn, element: sajuResult.dayMaster.element, keywords: sajuResult.dayMaster.keywords, description: sajuResult.dayMaster.description, image: sajuResult.dayMaster.image }}
              elementDistribution={sajuResult.elementDistribution}
              dominantElement={sajuResult.dominantElement}
            />
          </ErrorBoundary>
        </motion.div>

        <SectionDivider />

        <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" onViewportEnter={() => trackImpression('result', 'psa_profile')} viewport={{ once: true, margin: "-60px" }}>
          <ErrorBoundary>
            <PsaProfileSection
              categoryScores={psaResult.categoryScores.map((cs) => ({ category: cs.category, normalizedScore: cs.normalizedScore, rank: cs.rank }))}
              persona={{ type: psaResult.persona.type, title: psaResult.persona.title, tagline: psaResult.persona.tagline }}
              radarData={radarData}
              strengthsSummary={psaResult.strengthsSummary}
            />
          </ErrorBoundary>
        </motion.div>

        <SectionDivider />

        <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" onViewportEnter={() => trackImpression('result', 'cross_analysis')} viewport={{ once: true, margin: "-60px" }}>
          <ErrorBoundary>
            <CrossAnalysisSection axes={combined.axes as AxisAnalysis[]} />
          </ErrorBoundary>
        </motion.div>

        <SectionDivider />

        <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" onViewportEnter={() => trackImpression('result', 'growth_guide')} viewport={{ once: true, margin: "-60px" }}>
          <ErrorBoundary>
            <GrowthGuideSection guide={growthGuide} strengthTips={strengthTips} brandingMessages={brandingMessages} />
          </ErrorBoundary>
        </motion.div>

        <SectionDivider />

        <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} className="pt-4">
          <button
            onClick={onShareClick}
            className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${designTokens.shareButtonInline}`}
          >
            내 결과 공유하기
          </button>
        </motion.div>

        {IS_TOSS && (
          <ShareBottomSheet
            open={showShareSheet}
            onClose={() => setShowShareSheet(false)}
            onShareExternal={handleShare}
            onShareToss={handleShareToToss}
          />
        )}

        <Toast
          message={shareStatus === 'copied' ? '링크가 복사되었어요!' : shareStatus === 'shared' ? '공유 완료!' : '공유에 실패했어요. 다시 시도해주세요.'}
          type={shareStatus === 'failed' ? 'error' : 'success'}
          visible={shareStatus !== 'idle'}
          onClose={resetShareStatus}
        />

        <TossBannerAd theme="light" variant="card" className="my-4" />

        <p className={`text-center leading-relaxed pb-8 ${designTokens.disclaimer}`}>
          이 서비스는 재미와 자기 이해를 위한 도구이며, 의학적/심리학적 진단을 대체하지 않아요.
        </p>
      </div>
    </div>
  );
}
