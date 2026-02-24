"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SajuAnalysis, CombinedAnalysis, AxisAnalysis } from "@/types/saju";
import { BriefAnalysis } from "@/types/survey";
import { apiUrl } from "@/lib/config";
import { shareResult } from '@/lib/share';
import { getStateManager } from '@/lib/state-manager';
import { designTokens, IS_TOSS } from '@/lib/design-tokens';
import { SajuProfileSection } from "@/components/result/SajuProfileSection";
import { PsaProfileSection } from "@/components/result/PsaProfileSection";
import { CrossAnalysisSection } from "@/components/result/CrossAnalysisSection";
import { GrowthGuideSection } from "@/components/result/GrowthGuideSection";
import { PremiumUpsellSection } from "@/components/result/PremiumUpsellSection";

const styles = IS_TOSS ? {
  page: 'min-h-screen bg-white',
  container: 'px-6 py-6',
  title: 'text-t2 font-bold text-tds-grey-900',
  subtitle: 'text-st8 text-tds-grey-700',
  sectionTitle: 'text-t3 font-bold text-tds-grey-900',
  bodyText: 'text-st8 text-tds-grey-700',
  caption: 'text-st11 text-tds-grey-500',
  card: 'bg-white border border-tds-grey-200 rounded-xl p-5',
  divider: 'border-t border-tds-grey-200 my-8',
  shareButton: 'bg-tds-blue-500 text-white rounded-[14px] px-6 py-3 font-semibold text-t6',
} : {
  page: 'min-h-screen bg-background text-foreground',
  container: 'px-4 py-8 max-w-2xl mx-auto',
  title: 'text-3xl font-bold text-foreground',
  subtitle: 'text-sm text-muted-foreground',
  sectionTitle: 'text-2xl font-bold text-foreground',
  bodyText: 'text-sm text-muted-foreground',
  caption: 'text-xs text-muted-foreground/50',
  card: 'bg-card border border-border rounded-2xl p-5',
  divider: 'border-t border-border my-8',
  shareButton: 'bg-primary text-primary-foreground rounded-[14px] px-6 py-3 font-bold',
} as const;

// Parse growthGuide string back into structured form
function parseGrowthGuide(raw: string): {
  summary: string;
  focusAreas: Array<{ area: string; advice: string }>;
  dailyPractice: string;
} {
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  const summary = lines[0] ?? "";
  const focusAreas: Array<{ area: string; advice: string }> = [];
  let dailyPractice = "";

  for (const line of lines.slice(1)) {
    if (line.startsWith("실천 방법:")) {
      dailyPractice = line.replace("실천 방법:", "").trim();
    } else if (line.includes(":")) {
      const colonIdx = line.indexOf(":");
      focusAreas.push({
        area: line.slice(0, colonIdx).trim(),
        advice: line.slice(colonIdx + 1).trim(),
      });
    }
  }

  return { summary, focusAreas, dailyPractice };
}

function SectionDivider() {
  return (
    <div className={styles.divider} />
  );
}

function SkeletonBlock({ h = "h-40" }: { h?: string }) {
  return (
    <div
      className={`rounded-2xl border animate-pulse ${h} ${IS_TOSS ? 'border-tds-grey-200 bg-tds-grey-50' : 'border-border bg-muted'}`}
    />
  );
}

export default function ResultPage() {
  const [sajuResult, setSajuResult] = useState<SajuAnalysis | null>(null);
  const [psaResult, setPsaResult] = useState<BriefAnalysis | null>(null);
  const [combined, setCombined] = useState<CombinedAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "shared">(
    "idle"
  );
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    (async () => {
      let rawSaju = sessionStorage.getItem("sajuResult");
      let rawPsa = sessionStorage.getItem("psaResult");

      // State manager fallback (toss WebView or lost sessionStorage)
      if (!rawSaju || !rawPsa) {
        const sm = getStateManager();
        if (!rawSaju) {
          const dbSaju = await sm.load('sajuResult');
          if (dbSaju) rawSaju = JSON.stringify(dbSaju);
        }
        if (!rawPsa) {
          const dbPsa = await sm.load('psaResult');
          if (dbPsa) rawPsa = JSON.stringify(dbPsa);
        }
      }

      if (!rawSaju || !rawPsa) {
        setError("분석 데이터를 찾을 수 없습니다. 처음부터 다시 시작해주세요.");
        setLoading(false);
        return;
      }

      let parsedSaju: SajuAnalysis;
      let parsedPsa: BriefAnalysis;

      try {
        parsedSaju = JSON.parse(rawSaju) as SajuAnalysis;
        parsedPsa = JSON.parse(rawPsa) as BriefAnalysis;
      } catch {
        setError("데이터 파싱에 실패했습니다. 처음부터 다시 시작해주세요.");
        setLoading(false);
        return;
      }

      setSajuResult(parsedSaju);
      setPsaResult(parsedPsa);

      const sid = parsedSaju.sessionId ?? crypto.randomUUID();
      setSessionId(sid);

      fetch(apiUrl("/api/combined/analyze"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sid, sajuResult: parsedSaju, psaResult: parsedPsa }),
      })
        .then(async (res) => {
          if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error((body as { error?: string }).error ?? "교차 분석 실패");
          }
          return res.json() as Promise<CombinedAnalysis>;
        })
        .then((data) => {
          setCombined(data);
          setLoading(false);
        })
        .catch((err: unknown) => {
          const msg = err instanceof Error ? err.message : "알 수 없는 오류";
          setError(msg);
          setLoading(false);
        });
    })();
  }, []);

  const handleShare = async () => {
    const personaTitle = psaResult?.persona?.title || '강점 분석';
    const result = await shareResult({
      title: `사주강점 - ${personaTitle}`,
      description: '나의 사주-강점 교차 분석 결과를 확인해보세요!',
      path: '/result',
    });

    if (result === 'copied') {
      setShareStatus('copied');
      setTimeout(() => setShareStatus('idle'), 2000);
    } else if (result === 'shared') {
      setShareStatus('shared');
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={`${IS_TOSS ? 'px-6 py-12' : 'max-w-2xl mx-auto px-4 py-12'} space-y-8`}>
          <div className="text-center space-y-3">
            <div className={`inline-flex items-center gap-2 ${IS_TOSS ? 'text-tds-blue-500' : 'text-primary'}`}>
              <span className="animate-spin text-xl">⟳</span>
              <span className="text-sm font-medium">교차 분석 중...</span>
            </div>
            <p className={styles.caption}>
              사주 오행과 PSA 강점을 비교 분석하고 있습니다
            </p>
          </div>
          <SkeletonBlock h="h-56" />
          <SkeletonBlock h="h-40" />
          <SkeletonBlock h="h-48" />
          <SkeletonBlock h="h-32" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.page} flex items-center justify-center px-4`}>
        <div className="text-center space-y-4 max-w-sm">
          <p className="text-4xl">⚠</p>
          <p className={styles.bodyText}>{error}</p>
          <button
            onClick={() => (window.location.href = "/survey")}
            className={`mt-4 px-6 py-2.5 rounded-xl text-sm font-semibold ${IS_TOSS ? 'bg-tds-blue-500 text-white' : `${designTokens.primaryButton}`}`}
          >
            처음부터 시작하기
          </button>
        </div>
      </div>
    );
  }

  if (!sajuResult || !psaResult || !combined) return null;

  const growthGuide = parseGrowthGuide(combined.growthGuide);

  // Build PSA radar data with Korean labels
  const PSA_LABELS: Record<string, string> = {
    innovation: "혁신 사고",
    execution: "철저 실행",
    influence: "대인 영향",
    collaboration: "협업 공감",
    resilience: "상황 회복",
  };
  const radarData = psaResult.radarData.map((d) => ({
    category: PSA_LABELS[d.category] ?? d.category,
    score: d.score,
  }));

  // Build branding messages for growth guide
  const brandingMessages = psaResult.brandingMessages
    ? {
        selfIntro: psaResult.brandingMessages.selfIntro,
        linkedinHeadline: psaResult.brandingMessages.linkedinHeadline,
        elevatorPitch: psaResult.brandingMessages.elevatorPitch,
        hashtags: psaResult.brandingMessages.hashtags,
      }
    : undefined;

  // Build strength tips
  const strengthTips = psaResult.strengthTips?.map((t) => ({
    title: t.strength,
    description: `${t.tip} (${t.scenario})`,
  }));

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
  };

  return (
    <div className={styles.page}>
      <div className={`${IS_TOSS ? styles.container : 'max-w-2xl mx-auto px-4 py-12'} space-y-12`}>
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-2"
        >
          <h1 className={styles.title}>
            나의 강점 분석 리포트
          </h1>
          <p className={styles.subtitle}>
            사주 오행 × PSA 강점 — 선천과 후천의 교차
          </p>
        </motion.div>

        {/* Section A: Saju Profile */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <SajuProfileSection
            fourPillars={sajuResult.fourPillars}
            dayMaster={{
              name: sajuResult.dayMaster.name,
              element: sajuResult.dayMaster.element,
              keywords: sajuResult.dayMaster.keywords,
              description: sajuResult.dayMaster.description,
              image: sajuResult.dayMaster.image,
            }}
            elementDistribution={sajuResult.elementDistribution}
            dominantElement={sajuResult.dominantElement}
          />
        </motion.div>

        <SectionDivider />

        {/* Section B: PSA Profile */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <PsaProfileSection
            categoryScores={psaResult.categoryScores.map((cs) => ({
              category: cs.category,
              normalizedScore: cs.normalizedScore,
              rank: cs.rank,
            }))}
            persona={{
              type: psaResult.persona.type,
              title: psaResult.persona.title,
              tagline: psaResult.persona.tagline,
            }}
            radarData={radarData}
            strengthsSummary={psaResult.strengthsSummary}
          />
        </motion.div>

        <SectionDivider />

        {/* Section C: Cross Analysis */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <CrossAnalysisSection
            axes={combined.axes as AxisAnalysis[]}
          />
        </motion.div>

        <SectionDivider />

        {/* Section D: Growth Guide */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <GrowthGuideSection
            guide={growthGuide}
            strengthTips={strengthTips}
            brandingMessages={brandingMessages}
          />
        </motion.div>

        <SectionDivider />

        {/* Section E: Premium Upsell */}
        {sessionId && sajuResult && psaResult && combined && (
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <PremiumUpsellSection
              sessionId={sessionId}
              sajuResult={sajuResult}
              psaResult={psaResult}
              axes={combined.axes as AxisAnalysis[]}
            />
          </motion.div>
        )}

        {/* CTA Buttons */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-col sm:flex-row gap-3 pt-4"
        >
          <button
            onClick={handleShare}
            className={`flex-1 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${IS_TOSS ? 'bg-tds-blue-500 text-white' : 'bg-primary text-primary-foreground'}`}
          >
            {shareStatus === "copied"
              ? "링크 복사됨!"
              : shareStatus === "shared"
              ? "공유 완료!"
              : "결과 공유하기"}
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

        {/* Disclaimer */}
        <p className={`text-center leading-relaxed pb-8 ${IS_TOSS ? 'text-[11px] text-tds-grey-400' : 'text-[11px] text-muted-foreground/40'}`}>
          이 서비스는 재미와 자기 이해를 위한 도구이며, 의학적/심리학적 진단을
          대체하지 않습니다.
        </p>
      </div>
    </div>
  );
}
