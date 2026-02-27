"use client";

import { motion } from "framer-motion";
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

export default function ResultPage() {
  const { sajuResult, psaResult, combined, loading, error, shareStatus, handleShare } = useResultData();

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

        <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <SajuProfileSection
            fourPillars={sajuResult.fourPillars}
            dayMaster={{ name: sajuResult.dayMaster.name, element: sajuResult.dayMaster.element, keywords: sajuResult.dayMaster.keywords, description: sajuResult.dayMaster.description, image: sajuResult.dayMaster.image }}
            elementDistribution={sajuResult.elementDistribution}
            dominantElement={sajuResult.dominantElement}
          />
        </motion.div>

        <SectionDivider />

        <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <PsaProfileSection
            categoryScores={psaResult.categoryScores.map((cs) => ({ category: cs.category, normalizedScore: cs.normalizedScore, rank: cs.rank }))}
            persona={{ type: psaResult.persona.type, title: psaResult.persona.title, tagline: psaResult.persona.tagline }}
            radarData={radarData}
            strengthsSummary={psaResult.strengthsSummary}
          />
        </motion.div>

        <SectionDivider />

        <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <CrossAnalysisSection axes={combined.axes as AxisAnalysis[]} />
        </motion.div>

        <SectionDivider />

        <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <GrowthGuideSection guide={growthGuide} strengthTips={strengthTips} brandingMessages={brandingMessages} />
        </motion.div>

        <SectionDivider />

        <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={handleShare}
            className={`flex-1 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${designTokens.shareButtonInline}`}
          >
            {shareStatus === "copied" ? "링크 복사됨!" : shareStatus === "shared" ? "공유 완료!" : "결과 공유하기"}
          </button>
          {!IS_TOSS && (
            <button
              onClick={() => (window.location.href = "/p")}
              className="flex-1 py-3.5 rounded-xl border border-border text-muted-foreground font-semibold text-sm hover:bg-muted transition-all duration-200"
            >
              웹 프로필 만들기
            </button>
          )}
        </motion.div>

        <TossBannerAd theme="light" variant="card" className="my-4" />

        <p className={`text-center leading-relaxed pb-8 ${designTokens.disclaimer}`}>
          이 서비스는 재미와 자기 이해를 위한 도구이며, 의학적/심리학적 진단을 대체하지 않습니다.
        </p>
      </div>
    </div>
  );
}
