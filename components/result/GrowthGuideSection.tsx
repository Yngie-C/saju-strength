"use client";

import { growthGuideStyles as styles } from "@/lib/section-styles";
import { ELEMENT_COLORS } from "@/lib/design-tokens";
import { FiveElement, ElementDistribution } from "@/types/saju";

const ELEMENT_BALANCE_GUIDE: Record<string, string> = {
  wood: '창의적 활동, 새로운 시도, 아침 산책이나 식물 가꾸기로 목(木) 기운을 보충하세요.',
  fire: '열정적인 프로젝트 참여, 사람들과의 교류, 밝은 환경이 화(火) 기운을 키워줍니다.',
  earth: '규칙적인 생활 루틴, 안정적인 환경 조성, 명상이나 요가로 토(土) 기운을 강화하세요.',
  metal: '체계적인 정리 습관, 판단력 훈련, 글쓰기나 분석 활동이 금(金) 기운을 높여줍니다.',
  water: '독서와 사색, 감정을 글로 표현하기, 물 가까이에서의 휴식이 수(水) 기운을 채워줍니다.',
};

const ELEMENT_KOREAN: Record<string, string> = {
  wood: '목(木)', fire: '화(火)', earth: '토(土)', metal: '금(金)', water: '수(水)',
};

interface ElementBalanceData {
  weakestElement: FiveElement;
  elementDistribution: ElementDistribution;
}

interface ScenarioData {
  title: string;
  description: string;
}

interface WeaknessStrategyData {
  weakness: string;
  strategy: string;
}

interface FocusArea {
  area: string;
  advice: string;
}

interface GrowthGuide {
  summary: string;
  focusAreas: FocusArea[];
  dailyPractice: string;
}

interface StrengthTip {
  title: string;
  description: string;
}

interface BrandingMessages {
  selfIntro: string;
  linkedinHeadline: string;
  elevatorPitch: string;
  hashtags: string[];
}

interface GrowthGuideSectionProps {
  guide: GrowthGuide;
  strengthTips?: StrengthTip[];
  brandingMessages?: BrandingMessages;
  elementBalance?: ElementBalanceData;
  scenarios?: ScenarioData[];
  weaknessStrategies?: WeaknessStrategyData[];
}

export function GrowthGuideSection({
  guide,
  strengthTips,
  brandingMessages,
  elementBalance,
  scenarios,
  weaknessStrategies,
}: GrowthGuideSectionProps) {
  return (
    <section className="space-y-8">
      {/* Section Header */}
      <div className="space-y-1">
        <p className={styles.sectionLabel}>
          Section D
        </p>
        <h2 className={styles.sectionTitle}>성장 가이드</h2>
      </div>

      {/* Summary */}
      <div
        className={`${styles.summaryCard} ${styles.cardFill}`}
        style={styles.summaryBgStyle}
      >
        <h3 className={styles.summaryTitle}>
          종합 가이드
        </h3>
        <p className={styles.summaryText}>{guide.summary}</p>
      </div>

      {/* Focus Areas */}
      {guide.focusAreas && guide.focusAreas.length > 0 && (
        <div className="space-y-3">
          <h3 className={styles.focusTitle}>집중 영역</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {guide.focusAreas.map((fa, i) => (
              <div
                key={i}
                className={`${styles.focusCard} ${styles.cardFill}`}
              >
                <div className="flex items-center gap-2">
                  <span className={styles.focusIndex}>
                    {i + 1}
                  </span>
                  <p className={styles.focusArea}>{fa.area}</p>
                </div>
                <p className={styles.focusAdvice}>
                  {fa.advice}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Practice */}
      {guide.dailyPractice && (
        <div className={`${styles.practiceCard} ${styles.cardFill}`}>
          <h3 className={styles.practiceTitle}>
            일상 실천 가이드
          </h3>
          <p className={styles.practiceText}>
            {guide.dailyPractice}
          </p>
        </div>
      )}

      {/* Strength Tips */}
      {strengthTips && strengthTips.length > 0 && (
        <div className="space-y-3">
          <h3 className={styles.tipsTitle}>강점 활용 팁</h3>
          <div className="space-y-3">
            {strengthTips.map((tip, i) => (
              <div
                key={i}
                className={styles.tipCard}
                style={styles.tipBgStyle}
              >
                <p className={styles.tipTitle}>
                  {tip.title}
                </p>
                <p className={styles.tipText}>
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Branding Messages */}
      {brandingMessages && (
        <div className="space-y-4">
          <h3 className={styles.brandingTitle}>퍼스널 브랜딩</h3>

          {/* Self Intro */}
          <div className={`${styles.brandingCard} ${styles.cardFill}`}>
            <p className={styles.brandingLabel}>한 줄 자기소개</p>
            <p className={styles.brandingText}>
              {brandingMessages.selfIntro}
            </p>
          </div>

          {/* Elevator Pitch */}
          <div
            className={styles.pitchCard}
            style={styles.pitchBgStyle}
          >
            <p className={styles.pitchLabel}>
              강점 브랜딩 요소
            </p>
            <p className={styles.pitchText}>
              {brandingMessages.elevatorPitch}
            </p>
          </div>

          {/* Hashtags */}
          {brandingMessages.hashtags && brandingMessages.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {brandingMessages.hashtags.map((tag, i) => (
                <span
                  key={i}
                  className={styles.hashtag}
                  style={styles.hashtagBgStyle}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Element Balance Guide */}
      {elementBalance && (
        <div className="space-y-3">
          <h3 className={styles.focusTitle}>오행 밸런스 개선법</h3>
          <div className={`${styles.focusCard} ${styles.cardFill}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-t5 font-semibold" style={{ color: ELEMENT_COLORS[elementBalance.weakestElement] }}>
                {ELEMENT_KOREAN[elementBalance.weakestElement]}
              </span>
              <span className="text-st10 text-tds-grey-400">— 가장 보완이 필요한 오행</span>
            </div>
            <p className="text-st8 text-tds-grey-600 leading-relaxed">
              {ELEMENT_BALANCE_GUIDE[elementBalance.weakestElement]}
            </p>
          </div>
        </div>
      )}

      {/* Scenarios */}
      {scenarios && scenarios.length > 0 && (
        <div className="space-y-3">
          <h3 className={styles.focusTitle}>실전 강점 시나리오</h3>
          <div className="space-y-2">
            {scenarios.map((s, i) => (
              <div key={i} className={`${styles.focusCard} ${styles.cardFill}`}>
                <p className="text-t5 font-semibold text-tds-grey-800">{s.title}</p>
                <p className="text-st8 text-tds-grey-600 leading-relaxed mt-1">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weakness Strategies */}
      {weaknessStrategies && weaknessStrategies.length > 0 && (
        <div className="space-y-3">
          <h3 className={styles.focusTitle}>약점 보완 전략</h3>
          <div className="space-y-2">
            {weaknessStrategies.map((ws, i) => (
              <div key={i} className={`${styles.focusCard} ${styles.cardFill}`}>
                <p className="text-t5 font-semibold text-tds-grey-800">{ws.weakness}</p>
                <p className="text-st8 text-tds-grey-600 leading-relaxed mt-1">{ws.strategy}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
