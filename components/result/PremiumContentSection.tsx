'use client';

import { IS_TOSS, designTokens } from '@/lib/design-tokens';
import { UnlockStatus, getRemainingText } from '@/lib/premium/unlock-schedule';

interface WeeklyPlanItem {
  week: number;
  theme: string;
  actions: string[];
  reflection: string;
}

interface BrandingProfile {
  tagline: string;
  elevatorPitch: string;
  keywords: string[];
  strengthStatement: string;
}

interface PremiumContentSectionProps {
  hiddenStrengths: string[];
  blindSpots: string[];
  brandingProfile: BrandingProfile | null;
  weeklyPlan: WeeklyPlanItem[] | null;
  unlockStatus: UnlockStatus;
  analyzedAt: string;
}

const styles = IS_TOSS ? {
  sectionLabel: 'text-xs font-semibold tracking-widest text-tds-blue-400 uppercase',
  sectionTitle: 'text-t3 font-bold text-tds-grey-900',
  card: 'rounded-2xl border border-tds-grey-200 bg-white p-6',
  cardTitle: 'text-t5 font-semibold text-tds-grey-500 mb-3',
  bodyText: 'text-st8 text-tds-grey-600 leading-relaxed',
  listItem: 'flex items-start gap-2 text-st8 text-tds-grey-700',
  bullet: 'text-tds-blue-500 mt-0.5 flex-shrink-0',
  chip: 'text-xs px-3 py-1.5 rounded-full border border-tds-grey-200 text-tds-grey-500 font-medium bg-tds-grey-50',
  label: 'text-xs text-tds-grey-400 font-medium',
  lockedOverlay: 'absolute inset-0 flex items-center justify-center',
  lockedCard: 'rounded-xl border border-tds-grey-200 bg-white p-4 shadow text-center space-y-1',
  lockedText: 'text-st10 text-tds-grey-500',
  weekCard: 'rounded-xl border border-tds-grey-200 bg-white p-4 space-y-2',
  weekLabel: 'text-xs font-semibold text-tds-blue-500',
  weekTheme: 'text-t5 font-semibold text-tds-grey-800',
  reflectionCard: 'rounded-xl border border-tds-grey-100 bg-tds-grey-50 p-3',
  reflectionLabel: 'text-xs text-tds-grey-400 font-medium mb-1',
  reflectionText: 'text-st8 text-tds-grey-600 italic leading-relaxed',
} : {
  sectionLabel: 'text-xs font-semibold tracking-widest text-primary/70 uppercase',
  sectionTitle: 'text-2xl font-bold text-foreground',
  card: 'rounded-2xl border border-border p-6',
  cardTitle: 'text-sm font-semibold text-muted-foreground/80 mb-3',
  bodyText: 'text-sm text-muted-foreground leading-relaxed',
  listItem: 'flex items-start gap-2 text-sm text-foreground/80',
  bullet: 'text-primary mt-0.5 flex-shrink-0',
  chip: 'text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground/70 font-medium',
  label: 'text-xs text-muted-foreground/50 font-medium',
  lockedOverlay: 'absolute inset-0 flex items-center justify-center',
  lockedCard: 'rounded-xl border border-border bg-background p-4 shadow text-center space-y-1',
  lockedText: 'text-xs text-muted-foreground',
  weekCard: 'rounded-xl border border-border p-4 space-y-2',
  weekLabel: 'text-xs font-semibold text-primary',
  weekTheme: 'text-sm font-semibold text-foreground/80',
  reflectionCard: 'rounded-xl border border-border/50 bg-secondary/30 p-3',
  reflectionLabel: 'text-xs text-muted-foreground/50 font-medium mb-1',
  reflectionText: 'text-sm text-muted-foreground italic leading-relaxed',
};

function LockedSection({ remainingText }: { remainingText: string }) {
  return (
    <div className="relative">
      <div className="filter blur-[6px] pointer-events-none select-none opacity-40">
        <div className={`${styles.card} space-y-2`}>
          <div className="h-4 bg-tds-grey-200 rounded w-1/3" />
          <div className="h-3 bg-tds-grey-100 rounded w-full" />
          <div className="h-3 bg-tds-grey-100 rounded w-4/5" />
          <div className="h-3 bg-tds-grey-100 rounded w-2/3" />
        </div>
      </div>
      <div className={styles.lockedOverlay}>
        <div className={styles.lockedCard}>
          <div className="text-xl">🔒</div>
          <p className={styles.lockedText}>{remainingText}</p>
        </div>
      </div>
    </div>
  );
}

export function PremiumContentSection({
  hiddenStrengths,
  blindSpots,
  brandingProfile,
  weeklyPlan,
  unlockStatus,
  analyzedAt,
}: PremiumContentSectionProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <p className={styles.sectionLabel}>Section E</p>
        <h2 className={styles.sectionTitle}>심화 분석</h2>
      </div>

      {/* 숨겨진 강점 (Day 0 즉시) */}
      {unlockStatus.hiddenStrengths ? (
        <div className={`${styles.card} space-y-3`}>
          <h3 className={styles.cardTitle}>숨겨진 강점</h3>
          <ul className="space-y-2">
            {hiddenStrengths.map((item, i) => (
              <li key={i} className={styles.listItem}>
                <span className={styles.bullet}>✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <LockedSection remainingText={getRemainingText(analyzedAt, 0)} />
      )}

      {/* 블라인드 스팟 (Day 0 즉시) */}
      {unlockStatus.blindSpots ? (
        <div className={`${styles.card} space-y-3`}>
          <h3 className={styles.cardTitle}>블라인드 스팟</h3>
          <ul className="space-y-2">
            {blindSpots.map((item, i) => (
              <li key={i} className={styles.listItem}>
                <span className="text-amber-500 mt-0.5 flex-shrink-0">!</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <LockedSection remainingText={getRemainingText(analyzedAt, 0)} />
      )}

      {/* 퍼스널 브랜딩 (Day 1) */}
      {unlockStatus.branding && brandingProfile ? (
        <div className={`${styles.card} space-y-4`}>
          <h3 className={styles.cardTitle}>퍼스널 브랜딩</h3>
          <div className="space-y-1">
            <p className={styles.label}>태그라인</p>
            <p className={`${styles.bodyText} font-semibold`}>{brandingProfile.tagline}</p>
          </div>
          <div className="space-y-1">
            <p className={styles.label}>강점 선언문</p>
            <p className={styles.bodyText}>{brandingProfile.strengthStatement}</p>
          </div>
          <div className="space-y-2">
            <p className={styles.label}>키워드</p>
            <div className="flex flex-wrap gap-2">
              {brandingProfile.keywords.map((kw, i) => (
                <span key={i} className={styles.chip}>#{kw}</span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <LockedSection remainingText={getRemainingText(analyzedAt, 1)} />
      )}

      {/* 주간 성장 플랜 (Week 1~4) */}
      <div className="space-y-3">
        <h3 className={styles.cardTitle}>주간 성장 플랜</h3>
        {[0, 1, 2, 3].map((idx) => {
          const unlocked = unlockStatus.weeklyPlan[idx as 0 | 1 | 2 | 3];
          const targetDays = [7, 14, 21, 28][idx];
          const item = weeklyPlan?.[idx];

          if (!unlocked || !item) {
            return <LockedSection key={idx} remainingText={getRemainingText(analyzedAt, targetDays)} />;
          }

          return (
            <div key={idx} className={styles.weekCard}>
              <p className={styles.weekLabel}>{item.week}주차</p>
              <p className={styles.weekTheme}>{item.theme}</p>
              <ul className="space-y-1.5 mt-1">
                {item.actions.map((action, ai) => (
                  <li key={ai} className={styles.listItem}>
                    <span className={styles.bullet}>·</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
              <div className={styles.reflectionCard}>
                <p className={styles.reflectionLabel}>성찰 질문</p>
                <p className={styles.reflectionText}>{item.reflection}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
