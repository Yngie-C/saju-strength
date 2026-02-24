'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SajuAnalysis, AxisAnalysis } from '@/types/saju';
import { BriefAnalysis } from '@/types/survey';
import { PremiumReport } from '@/types/premium';
import { purchaseProduct, checkPurchase, PRODUCTS } from '@/lib/iap';
import { isTossEnvironment } from '@/lib/toss';
import { apiUrl } from '@/lib/config';

const IS_TOSS = process.env.NEXT_PUBLIC_BUILD_TARGET === 'toss';

interface Props {
  sessionId: string;
  sajuResult: SajuAnalysis;
  psaResult: BriefAnalysis;
  axes: AxisAnalysis[];
}

export function PremiumUpsellSection({ sessionId, sajuResult, psaResult, axes }: Props) {
  const [purchased, setPurchased] = useState(false);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [report, setReport] = useState<PremiumReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check purchase status on mount
  useEffect(() => {
    checkPurchase('premium_report', sessionId).then(result => {
      setPurchased(result);
      setLoading(false);
      if (result) loadPremiumReport();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  async function loadPremiumReport() {
    try {
      const res = await fetch(apiUrl('/api/premium/report'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, sajuResult, psaResult, axes }),
      });
      if (res.ok) {
        const data = await res.json();
        setReport(data);
      }
    } catch {
      // silent fail - premium content not critical
    }
  }

  async function handlePurchase() {
    setPurchasing(true);
    setError(null);
    const result = await purchaseProduct('premium_report', sessionId);
    if (result.success) {
      setPurchased(true);
      loadPremiumReport();
    } else {
      setError(result.error || '결제에 실패했습니다.');
    }
    setPurchasing(false);
  }

  if (loading) return null;

  // UPSELL CARD (not purchased)
  if (!purchased) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={
          IS_TOSS
            ? "relative overflow-hidden rounded-xl border border-tds-blue-200 bg-tds-blue-50 p-6"
            : "relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 p-6"
        }
      >
        {/* Glow effect (web only) */}
        {!IS_TOSS && (
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
        )}

        <div className="relative space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">&#x2728;</span>
            <h3 className={IS_TOSS ? "text-t4 font-bold text-tds-grey-900" : "text-lg font-bold text-white"}>
              프리미엄 심층 리포트
            </h3>
          </div>

          <p className={IS_TOSS ? "text-st8 text-tds-grey-600" : "text-sm text-white/60"}>
            기본 분석에서 더 깊이 들어가보세요
          </p>

          <ul className={IS_TOSS ? "space-y-2 text-sm text-tds-grey-700" : "space-y-2 text-sm text-white/70"}>
            <li className="flex items-start gap-2">
              <span className={IS_TOSS ? "text-tds-blue-500 mt-0.5" : "text-purple-400 mt-0.5"}>&#x2713;</span>
              <span>10가지 페르소나 심층 분석</span>
            </li>
            <li className="flex items-start gap-2">
              <span className={IS_TOSS ? "text-tds-blue-500 mt-0.5" : "text-purple-400 mt-0.5"}>&#x2713;</span>
              <span>4주 개인화 성장 로드맵</span>
            </li>
            <li className="flex items-start gap-2">
              <span className={IS_TOSS ? "text-tds-blue-500 mt-0.5" : "text-purple-400 mt-0.5"}>&#x2713;</span>
              <span>퍼스널 브랜딩 메시지 생성</span>
            </li>
            <li className="flex items-start gap-2">
              <span className={IS_TOSS ? "text-tds-blue-500 mt-0.5" : "text-purple-400 mt-0.5"}>&#x2713;</span>
              <span>강점 활용 실전 시나리오</span>
            </li>
          </ul>

          {isTossEnvironment() ? (
            <button
              onClick={handlePurchase}
              disabled={purchasing}
              className={
                IS_TOSS
                  ? "w-full py-3 rounded-[14px] font-semibold text-sm text-white bg-tds-blue-500 disabled:opacity-50"
                  : "w-full py-3 rounded-xl font-semibold text-sm text-white disabled:opacity-50"
              }
              style={IS_TOSS ? undefined : { background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)' }}
            >
              {purchasing ? '결제 진행 중...' : `${PRODUCTS.premium_report.priceDisplay}으로 잠금 해제`}
            </button>
          ) : (
            <div className="text-center py-3 rounded-xl border border-white/10 text-white/40 text-sm">
              토스 앱에서 구매할 수 있습니다
            </div>
          )}

          {error && (
            <p className="text-xs text-red-400 text-center">{error}</p>
          )}
        </div>
      </motion.div>
    );
  }

  // PREMIUM REPORT CONTENT (purchased)
  if (!report) {
    return (
      <div className={`rounded-xl p-6 animate-pulse ${IS_TOSS ? 'border border-tds-blue-200 bg-tds-blue-50' : 'rounded-2xl border border-purple-500/20 bg-purple-900/10'}`}>
        <p className={`text-sm text-center ${IS_TOSS ? 'text-tds-grey-500' : 'text-white/40'}`}>프리미엄 리포트 불러오는 중...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-8"
    >
      {/* Premium badge */}
      <div className="flex items-center gap-2 text-purple-400">
        <span>&#x2728;</span>
        <span className="text-xs font-semibold tracking-wider uppercase">Premium Report</span>
      </div>

      {/* Persona Deep Dive */}
      <div className="rounded-2xl border border-purple-500/20 bg-purple-900/10 p-6 space-y-4">
        <h3 className="text-lg font-bold text-white">
          {report.personaDeepDive.personaTitle} - 심층 분석
        </h3>
        <p className="text-sm text-white/70 leading-relaxed">{report.personaDeepDive.coreIdentity}</p>

        <div className="grid grid-cols-1 gap-3">
          <div>
            <h4 className="text-xs font-semibold text-purple-400 mb-2">숨겨진 강점</h4>
            <ul className="space-y-1">
              {report.personaDeepDive.hiddenStrengths.map((s, i) => (
                <li key={i} className="text-sm text-white/60 flex items-start gap-2">
                  <span className="text-purple-400">&#x25B8;</span>{s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-amber-400 mb-2">주의할 맹점</h4>
            <ul className="space-y-1">
              {report.personaDeepDive.blindSpots.map((s, i) => (
                <li key={i} className="text-sm text-white/60 flex items-start gap-2">
                  <span className="text-amber-400">&#x25B8;</span>{s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-green-400 mb-1">최적의 환경</h4>
          <p className="text-sm text-white/60">{report.personaDeepDive.idealEnvironment}</p>
        </div>
      </div>

      {/* Growth Roadmap */}
      <div className="rounded-2xl border border-purple-500/20 bg-purple-900/10 p-6 space-y-4">
        <h3 className="text-lg font-bold text-white">4주 성장 로드맵</h3>
        <div className="space-y-4">
          {report.growthRoadmap.weeklyPlan.map((week) => (
            <div key={week.week} className="border-l-2 border-purple-500/30 pl-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-purple-400">Week {week.week}</span>
                <span className="text-sm font-semibold text-white">{week.theme}</span>
              </div>
              <ul className="space-y-1">
                {week.actions.map((a, i) => (
                  <li key={i} className="text-xs text-white/50">&#x2022; {a}</li>
                ))}
              </ul>
              <p className="text-xs text-white/30 italic">{week.reflection}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-white/40 pt-2 border-t border-white/5">
          {report.growthRoadmap.longTermVision}
        </p>
      </div>

      {/* Branding Profile */}
      <div className="rounded-2xl border border-purple-500/20 bg-purple-900/10 p-6 space-y-4">
        <h3 className="text-lg font-bold text-white">퍼스널 브랜딩</h3>
        <div className="space-y-3">
          <div>
            <span className="text-xs text-purple-400 font-semibold">한 줄 소개</span>
            <p className="text-sm text-white/80 font-medium mt-1">{report.brandingProfile.tagline}</p>
          </div>
          <div>
            <span className="text-xs text-purple-400 font-semibold">엘리베이터 피치</span>
            <p className="text-sm text-white/60 mt-1 leading-relaxed">{report.brandingProfile.elevatorPitch}</p>
          </div>
          <div>
            <span className="text-xs text-purple-400 font-semibold">강점 선언</span>
            <p className="text-sm text-white/80 font-medium mt-1">&ldquo;{report.brandingProfile.strengthStatement}&rdquo;</p>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {report.brandingProfile.keywords.map((k, i) => (
              <span key={i} className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300">
                #{k}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Strength Scenarios */}
      <div className="rounded-2xl border border-purple-500/20 bg-purple-900/10 p-6 space-y-4">
        <h3 className="text-lg font-bold text-white">강점 활용 시나리오</h3>
        <div className="space-y-4">
          {report.strengthScenarios.map((s, i) => (
            <div key={i} className="space-y-2 pb-3 border-b border-white/5 last:border-0">
              <p className="text-sm font-medium text-white/80">{s.scenario}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-purple-400">활용 강점:</span>
                  <span className="text-white/50 ml-1">{s.strengthUsed}</span>
                </div>
                <div>
                  <span className="text-green-400">기대 결과:</span>
                  <span className="text-white/50 ml-1">{s.expectedOutcome}</span>
                </div>
              </div>
              <p className="text-xs text-white/40">{s.approach}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
