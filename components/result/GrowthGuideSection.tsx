"use client";

import { IS_TOSS, designTokens } from "@/lib/design-tokens";

const styles = IS_TOSS ? {
  sectionLabel: 'text-xs font-semibold tracking-widest text-tds-green-500 uppercase',
  sectionTitle: 'text-t3 font-bold text-tds-grey-900',
  summaryCard: 'rounded-2xl border border-tds-grey-200 bg-white p-6',
  summaryTitle: 'text-sm font-semibold text-tds-green-600 mb-3',
  summaryText: 'text-sm text-tds-grey-600 leading-relaxed',
  focusTitle: 'text-sm font-semibold text-tds-grey-500',
  focusCard: 'rounded-xl border border-tds-grey-200 bg-white p-4 space-y-2',
  focusIndex: 'w-6 h-6 rounded-full bg-tds-green-100 text-tds-green-600 text-xs flex items-center justify-center font-bold flex-shrink-0',
  focusArea: 'text-sm font-semibold text-tds-grey-800',
  focusAdvice: 'text-sm text-tds-grey-500 leading-relaxed pl-8',
  practiceCard: 'rounded-xl border border-tds-grey-200 bg-white p-5',
  practiceTitle: 'text-sm font-semibold text-tds-grey-500 mb-2',
  practiceText: 'text-sm text-tds-grey-600 leading-relaxed',
  tipsTitle: 'text-sm font-semibold text-tds-grey-500',
  tipCard: 'rounded-xl border border-tds-grey-200 bg-white p-4 space-y-1.5',
  tipTitle: 'text-sm font-semibold text-tds-blue-600',
  tipText: 'text-sm text-tds-grey-500 leading-relaxed',
  brandingTitle: 'text-sm font-semibold text-tds-grey-500',
  brandingCard: 'rounded-xl border border-tds-grey-200 bg-white p-4 space-y-1.5',
  brandingLabel: 'text-xs text-tds-grey-400 font-medium',
  brandingText: 'text-sm text-tds-grey-700 leading-relaxed',
  pitchCard: 'rounded-xl border border-tds-grey-200 bg-white p-4 space-y-1.5',
  pitchLabel: 'text-xs text-tds-grey-400 font-medium',
  pitchText: 'text-sm text-tds-grey-700 leading-relaxed',
  hashtag: 'text-xs px-3 py-1.5 rounded-full border border-tds-grey-200 text-tds-grey-500 font-medium bg-tds-grey-50',
} : {
  sectionLabel: 'text-xs font-semibold tracking-widest text-muted-foreground uppercase',
  sectionTitle: 'text-2xl font-bold text-foreground',
  summaryCard: 'rounded-2xl border border-border p-6',
  summaryTitle: 'text-sm font-semibold text-primary mb-3',
  summaryText: 'text-sm text-muted-foreground leading-relaxed',
  focusTitle: 'text-sm font-semibold text-muted-foreground/80',
  focusCard: 'rounded-xl border border-border p-4 space-y-2',
  focusIndex: 'w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold flex-shrink-0',
  focusArea: 'text-sm font-semibold text-foreground/80',
  focusAdvice: 'text-sm text-muted-foreground/70 leading-relaxed pl-8',
  practiceCard: 'rounded-xl border border-border p-5',
  practiceTitle: 'text-sm font-semibold text-muted-foreground/80 mb-2',
  practiceText: 'text-sm text-muted-foreground leading-relaxed',
  tipsTitle: 'text-sm font-semibold text-muted-foreground/80',
  tipCard: 'rounded-xl border border-primary/15 p-4 space-y-1.5',
  tipTitle: 'text-sm font-semibold text-primary',
  tipText: 'text-sm text-muted-foreground/80 leading-relaxed',
  brandingTitle: 'text-sm font-semibold text-muted-foreground/80',
  brandingCard: 'rounded-xl border border-border p-4 space-y-1.5',
  brandingLabel: 'text-xs text-muted-foreground/50 font-medium',
  brandingText: 'text-sm text-foreground/80 leading-relaxed',
  pitchCard: 'rounded-xl border border-primary/15 p-4 space-y-1.5',
  pitchLabel: 'text-xs text-primary/70 font-medium',
  pitchText: 'text-sm text-muted-foreground leading-relaxed',
  hashtag: 'text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground/70 font-medium',
} as const;

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
}

export function GrowthGuideSection({
  guide,
  strengthTips,
  brandingMessages,
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
        className={`${styles.summaryCard} ${IS_TOSS ? '' : 'bg-card'}`}
        style={IS_TOSS ? undefined : {
          background:
            "linear-gradient(160deg, rgba(34,197,94,0.07) 0%, rgba(34,197,94,0.02) 100%)",
        }}
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
                className={`${styles.focusCard} ${IS_TOSS ? '' : 'bg-card'}`}
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
        <div className={`${styles.practiceCard} ${IS_TOSS ? '' : 'bg-card'}`}>
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
                style={IS_TOSS ? undefined : { background: "rgba(6,182,212,0.05)" }}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Self Intro */}
            <div className={`${styles.brandingCard} ${IS_TOSS ? '' : 'bg-card'}`}>
              <p className={styles.brandingLabel}>한 줄 자기소개</p>
              <p className={styles.brandingText}>
                {brandingMessages.selfIntro}
              </p>
            </div>

            {/* LinkedIn */}
            <div className={`${styles.brandingCard} ${IS_TOSS ? '' : 'bg-card'}`}>
              <p className={styles.brandingLabel}>
                LinkedIn 헤드라인
              </p>
              <p className={styles.brandingText}>
                {brandingMessages.linkedinHeadline}
              </p>
            </div>
          </div>

          {/* Elevator Pitch */}
          <div
            className={styles.pitchCard}
            style={IS_TOSS ? undefined : { background: "rgba(49,130,246,0.05)" }}
          >
            <p className={styles.pitchLabel}>
              엘리베이터 피치
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
                  style={IS_TOSS ? undefined : { background: "rgba(255,255,255,0.04)" }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
