"use client";

import { growthGuideStyles as styles } from "@/lib/section-styles";

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Self Intro */}
            <div className={`${styles.brandingCard} ${styles.cardFill}`}>
              <p className={styles.brandingLabel}>한 줄 자기소개</p>
              <p className={styles.brandingText}>
                {brandingMessages.selfIntro}
              </p>
            </div>

            {/* LinkedIn */}
            <div className={`${styles.brandingCard} ${styles.cardFill}`}>
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
            style={styles.pitchBgStyle}
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
                  style={styles.hashtagBgStyle}
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
