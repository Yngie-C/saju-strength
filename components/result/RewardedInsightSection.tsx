'use client';

import { useState, useEffect, useCallback } from 'react';
import { SajuAnalysis, AxisAnalysis } from '@/types/saju';
import { BriefAnalysis } from '@/types/survey';
import { PremiumReport, DetailedAxisAnalysis, StrengthScenario } from '@/types/premium';
import { generatePremiumReport } from '@/lib/premium/analyzer';
import { RewardedAdButton } from '@/components/ads/RewardedAdButton';
import { motion } from 'framer-motion';
import { IS_TOSS } from '@/lib/platform';

interface Props {
  sessionId: string;
  sajuResult: SajuAnalysis;
  psaResult: BriefAnalysis;
  axes: AxisAnalysis[];
}

const STORAGE_KEY = 'ad-reward-unlocked';
const REPORT_CACHE_KEY = 'ad-reward-report';

export function RewardedInsightSection({ sessionId, sajuResult, psaResult, axes }: Props) {
  const [unlocked, setUnlocked] = useState(false);
  const [report, setReport] = useState<PremiumReport | null>(null);
  const [expandedAxis, setExpandedAxis] = useState<number | null>(null);

  // 캐시된 해제 상태 복원
  useEffect(() => {
    const wasUnlocked = sessionStorage.getItem(STORAGE_KEY) === 'true';
    if (wasUnlocked) {
      setUnlocked(true);
      const cached = sessionStorage.getItem(REPORT_CACHE_KEY);
      if (cached) {
        try {
          setReport(JSON.parse(cached));
        } catch {
          // 캐시 파싱 실패 시 재생성
          const fresh = generatePremiumReport(sessionId, sajuResult, psaResult, axes);
          setReport(fresh);
          sessionStorage.setItem(REPORT_CACHE_KEY, JSON.stringify(fresh));
        }
      } else {
        const fresh = generatePremiumReport(sessionId, sajuResult, psaResult, axes);
        setReport(fresh);
        sessionStorage.setItem(REPORT_CACHE_KEY, JSON.stringify(fresh));
      }
    }
  }, [sessionId, sajuResult, psaResult, axes]);

  const handleRewardEarned = useCallback(() => {
    setUnlocked(true);
    sessionStorage.setItem(STORAGE_KEY, 'true');

    const generated = generatePremiumReport(sessionId, sajuResult, psaResult, axes);
    setReport(generated);
    sessionStorage.setItem(REPORT_CACHE_KEY, JSON.stringify(generated));
  }, [sessionId, sajuResult, psaResult, axes]);

  // 웹에서는 비노출
  if (!IS_TOSS) return null;

  // 기본 상태: CTA 카드
  if (!unlocked) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border border-tds-grey-200 bg-tds-grey-50 p-6 space-y-4"
      >
        <div className="text-center space-y-2">
          <h3 className="text-t4 font-bold text-tds-grey-900">
            추가 인사이트 확인하기
          </h3>
          <p className="text-st8 text-tds-grey-600">
            심층 교차 분석과 강점 활용 시나리오를 무료로 확인하세요
          </p>
        </div>

        <ul className="space-y-2 text-sm text-tds-grey-700">
          <li className="flex items-start gap-2">
            <span className="text-tds-blue-500 mt-0.5">✓</span>
            <span>오행 × 강점 심층 교차 분석</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-tds-blue-500 mt-0.5">✓</span>
            <span>맞춤 강점 활용 시나리오</span>
          </li>
        </ul>

        <RewardedAdButton
          onRewardEarned={handleRewardEarned}
          buttonText="광고 보고 무료로 잠금 해제"
          rewardDescription="30초 광고를 시청하면 추가 인사이트를 확인할 수 있어요"
        />
      </motion.div>
    );
  }

  // 해제 상태: 프리미엄 콘텐츠
  if (!report) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* 해제 배지 */}
      <div className="flex items-center gap-2">
        <span className="text-tds-blue-500 text-sm font-semibold">추가 인사이트</span>
        <span className="px-2 py-0.5 rounded-full bg-tds-blue-50 text-tds-blue-500 text-[11px] font-medium">
          잠금 해제됨
        </span>
      </div>

      {/* 심층 교차 분석 */}
      <div className="rounded-xl border border-tds-grey-200 bg-white p-5 space-y-4">
        <h3 className="text-t5 font-bold text-tds-grey-900">심층 교차 분석</h3>
        <div className="space-y-3">
          {report.detailedAxes.map((axis: DetailedAxisAnalysis, i: number) => (
            <div key={i} className="border border-tds-grey-100 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedAxis(expandedAxis === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-tds-grey-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-st8 font-medium text-tds-grey-900">
                    {axis.element} × {axis.psaCategory}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-tds-blue-50 text-tds-blue-500">
                    {axis.type}
                  </span>
                </div>
                <span className={`text-tds-grey-400 transition-transform ${expandedAxis === i ? 'rotate-180' : ''}`}>
                  ▾
                </span>
              </button>
              {expandedAxis === i && (
                <div className="px-4 pb-4 space-y-3 border-t border-tds-grey-100">
                  <p className="text-st8 text-tds-grey-700 leading-relaxed pt-3">
                    {axis.detailedInsight}
                  </p>
                  <div className="bg-tds-blue-50 rounded-lg p-3">
                    <p className="text-st10 font-medium text-tds-blue-500 mb-1">실천 팁</p>
                    <p className="text-st10 text-tds-grey-700">{axis.actionTip}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 강점 활용 시나리오 */}
      <div className="rounded-xl border border-tds-grey-200 bg-white p-5 space-y-4">
        <h3 className="text-t5 font-bold text-tds-grey-900">강점 활용 시나리오</h3>
        <div className="space-y-4">
          {report.strengthScenarios.map((s: StrengthScenario, i: number) => (
            <div key={i} className="space-y-2 pb-3 border-b border-tds-grey-100 last:border-0 last:pb-0">
              <p className="text-st8 font-medium text-tds-grey-900">{s.scenario}</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[11px] text-tds-blue-500 font-medium">활용 강점</span>
                  <p className="text-st10 text-tds-grey-600">{s.strengthUsed}</p>
                </div>
                <div>
                  <span className="text-[11px] text-tds-blue-500 font-medium">기대 결과</span>
                  <p className="text-st10 text-tds-grey-600">{s.expectedOutcome}</p>
                </div>
              </div>
              <p className="text-st11 text-tds-grey-500">{s.approach}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
