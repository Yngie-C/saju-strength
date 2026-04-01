"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { AxisAnalysis } from "@/types/saju";
import { IS_TOSS, designTokens } from '@/lib/design-tokens';
import { resultTokens as resultStyles } from '@/lib/section-styles';
import { parseGrowthGuide } from '@/lib/combined/parse-growth-guide';
import { generateWeaknessStrategy } from '@/lib/combined/growth-guide';
import { useResultData } from '@/hooks/useResultData';
import { ResultSkeleton } from "@/components/result/ResultSkeleton";
import { ResultError } from "@/components/result/ResultError";
import { SajuProfileSection } from "@/components/result/SajuProfileSection";
import { PsaProfileSection } from "@/components/result/PsaProfileSection";
import { CrossAnalysisSection } from "@/components/result/CrossAnalysisSection";
import { GrowthGuideSection } from "@/components/result/GrowthGuideSection";
import { TossBannerAd } from '@/components/ads/TossBannerAd';
import { preloadInterstitial, showInterstitial } from '@/lib/ads/toss-ads';
import { growthGuideStyles } from '@/lib/section-styles';
import { Toast } from '@/components/ui/Toast';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { trackScreen, trackClick, trackImpression } from '@/lib/analytics';
import { ShareCard } from '@/components/result/ShareCard';

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const ELEMENT_KOREAN: Record<string, string> = {
  wood: '목(木)', fire: '화(火)', earth: '토(土)', metal: '금(金)', water: '수(水)',
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

export default function ResultPage() {
  const { sajuResult, psaResult, combined, loading, error, userName, shareStatus, handleShare, resetShareStatus } = useResultData();
  const [growthUnlocked, setGrowthUnlocked] = useState(false);
  const [adSupported, setAdSupported] = useState(IS_TOSS);

  const handleGrowthUnlock = useCallback(() => {
    setGrowthUnlocked(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('growth-guide-unlocked', 'true');
    }
    trackClick('result', 'interstitial_ad_growth_unlocked');
  }, []);

  const onShareClick = useCallback(() => {
    trackClick('result', 'share');
    handleShare();
  }, [handleShare]);

  useEffect(() => {
    if (!loading && sajuResult && psaResult && combined) {
      trackScreen('result');
    }
  }, [loading, sajuResult, psaResult, combined]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const unlocked = sessionStorage.getItem('growth-guide-unlocked') === 'true';
      if (unlocked) setGrowthUnlocked(true);
    }
    if (!IS_TOSS) return;
    preloadInterstitial({ cooldownKey: 'interstitial-result' });
  }, []);

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
          <h1 className={resultStyles.title}>{userName ? `${userName}님의 강점 분석 리포트` : '나의 강점 분석 리포트'}</h1>
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

        {IS_TOSS && !growthUnlocked && adSupported ? (
          <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="space-y-8">
              <div className="space-y-1">
                <p className={growthGuideStyles.sectionLabel}>Section D</p>
                <h2 className={growthGuideStyles.sectionTitle}>성장 가이드</h2>
              </div>
              <div className="relative">
                <div className="filter blur-[6px] pointer-events-none select-none opacity-60">
                  <div className="rounded-2xl border border-tds-grey-200 bg-tds-grey-50 p-5 space-y-3">
                    <div className="h-4 bg-tds-grey-200 rounded w-1/3" />
                    <div className="h-3 bg-tds-grey-100 rounded w-full" />
                    <div className="h-3 bg-tds-grey-100 rounded w-4/5" />
                    <div className="h-3 bg-tds-grey-100 rounded w-2/3" />
                  </div>
                  <div className="mt-3 rounded-2xl border border-tds-grey-200 bg-tds-grey-50 p-5 space-y-3">
                    <div className="h-4 bg-tds-grey-200 rounded w-1/4" />
                    <div className="h-3 bg-tds-grey-100 rounded w-full" />
                    <div className="h-3 bg-tds-grey-100 rounded w-3/4" />
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-xl border border-tds-grey-200 bg-white p-6 space-y-4 shadow-lg max-w-[320px] w-full mx-4">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-tds-blue-50 flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl">🔒</span>
                      </div>
                      <h3 className="text-base font-bold text-tds-grey-900">성장 가이드 확인하기</h3>
                      <p className="text-sm text-tds-grey-600">{`${sajuResult.dayMaster.name} 유형 맞춤 성장 로드맵 — 최약 오행 [${ELEMENT_KOREAN[sajuResult.weakestElement] ?? sajuResult.weakestElement}] 보완 전략 포함`}</p>
                    </div>
                    <ul className="space-y-2 text-sm text-tds-grey-700">
                      <li className="flex items-start gap-2"><span className="text-tds-blue-500 mt-0.5">✓</span><span>오행 밸런스 개선법</span></li>
                      <li className="flex items-start gap-2"><span className="text-tds-blue-500 mt-0.5">✓</span><span>실전 강점 시나리오</span></li>
                      <li className="flex items-start gap-2"><span className="text-tds-blue-500 mt-0.5">✓</span><span>약점 보완 전략</span></li>
                      <li className="flex items-start gap-2"><span className="text-tds-blue-500 mt-0.5">✓</span><span>퍼스널 브랜딩</span></li>
                    </ul>
                    <button
                      onClick={async () => {
                        await showInterstitial(() => handleGrowthUnlock(), { cooldownKey: 'interstitial-result' });
                      }}
                      className={`w-full py-3.5 font-semibold text-sm transition-opacity ${designTokens.primaryButton}`}
                    >
                      광고 보고 무료로 잠금 해제
                    </button>
                    <p className="text-st10 text-center text-tds-grey-400 mt-2">
                      짧은 광고 후 성장 가이드를 확인할 수 있어요
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" onViewportEnter={() => trackImpression('result', 'growth_guide')} viewport={{ once: true, margin: "-60px" }}>
            <ErrorBoundary>
              <GrowthGuideSection
                  guide={growthGuide}
                  strengthTips={strengthTips}
                  brandingMessages={brandingMessages}
                  elementBalance={{
                    weakestElement: sajuResult.weakestElement,
                    elementDistribution: sajuResult.elementDistribution,
                  }}
                  scenarios={psaResult.strengthsScenarios}
                  weaknessStrategies={sajuResult.dayMaster.weaknesses.map(w => ({
                    weakness: w,
                    strategy: generateWeaknessStrategy(w),
                  }))}
                />
            </ErrorBoundary>
          </motion.div>
        )}

        <SectionDivider />

        <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} className="pt-4 space-y-3">
          <ShareCard
            userName={userName}
            personaTitle={psaResult.persona.title}
            personaTagline={psaResult.persona.tagline}
            dayMasterName={sajuResult.dayMaster.name}
            dominantElement={sajuResult.dominantElement}
            weakestElement={sajuResult.weakestElement}
            topCategories={psaResult.categoryScores
              .slice()
              .sort((a, b) => b.normalizedScore - a.normalizedScore)
              .slice(0, 2)
              .map((cs) => ({ name: cs.category, score: cs.normalizedScore }))}
            allCategories={psaResult.categoryScores.map((cs) => ({ name: cs.category, score: cs.normalizedScore }))}
            onSaved={() => resetShareStatus()}
          />
        </motion.div>

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
