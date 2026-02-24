"use client";

import { motion } from "framer-motion";
import { SajuPillarCard } from "@/components/saju/SajuPillarCard";
import { FiveElementsChart } from "@/components/saju/FiveElementsChart";
import { Pillar, ElementDistribution } from "@/types/saju";
import { ELEMENT_COLORS, IS_TOSS, designTokens } from "@/lib/design-tokens";

const styles = IS_TOSS ? {
  sectionLabel: 'text-xs font-semibold tracking-widest text-tds-blue-500 uppercase',
  sectionTitle: 'text-t3 font-bold text-tds-grey-900',
  sectionSubtitle: 'text-tds-grey-400 font-normal text-lg',
  emptyPillarCard: 'flex flex-col items-center justify-center rounded-2xl border border-tds-grey-200 bg-tds-grey-50 min-h-[160px]',
  emptyPillarLabel: 'text-xs text-tds-grey-400',
  emptyPillarSub: 'text-xs text-tds-grey-300 mt-1',
  card: 'rounded-2xl border border-tds-grey-200 bg-white p-6',
  cardTitle: 'text-sm font-semibold text-tds-grey-500 mb-4',
  dayMasterCardTitle: 'text-sm font-semibold text-tds-grey-500',
  dayMasterName: 'text-xl font-bold',
  dayMasterSub: 'text-xs text-tds-grey-400',
  dayMasterDesc: 'text-sm text-tds-grey-600 leading-relaxed',
} : {
  sectionLabel: 'text-xs font-semibold tracking-widest text-primary/70 uppercase',
  sectionTitle: 'text-2xl font-bold text-foreground',
  sectionSubtitle: 'text-muted-foreground/50 font-normal text-lg',
  emptyPillarCard: 'flex flex-col items-center justify-center rounded-2xl border border-border bg-card min-h-[160px]',
  emptyPillarLabel: 'text-xs text-muted-foreground/40',
  emptyPillarSub: 'text-xs text-muted-foreground/30 mt-1',
  card: 'rounded-2xl border border-border p-6',
  cardTitle: 'text-sm font-semibold text-muted-foreground/80 mb-4',
  dayMasterCardTitle: 'text-sm font-semibold text-muted-foreground/80',
  dayMasterName: 'text-xl font-bold',
  dayMasterSub: 'text-xs text-muted-foreground/50',
  dayMasterDesc: 'text-sm text-muted-foreground leading-relaxed',
} as const;

interface DayMasterInfo {
  name: string;
  element: string;
  keywords: string[];
  description: string;
  image: string;
}

interface SajuProfileSectionProps {
  fourPillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar | null;
  };
  dayMaster: DayMasterInfo;
  elementDistribution: ElementDistribution;
  dominantElement: string;
}

const PILLAR_LABELS = ["년주", "월주", "일주", "시주"];

export function SajuProfileSection({
  fourPillars,
  dayMaster,
  elementDistribution,
  dominantElement,
}: SajuProfileSectionProps) {
  const pillars: Array<{ label: string; pillar: Pillar | null }> = [
    { label: PILLAR_LABELS[0], pillar: fourPillars.year },
    { label: PILLAR_LABELS[1], pillar: fourPillars.month },
    { label: PILLAR_LABELS[2], pillar: fourPillars.day },
    { label: PILLAR_LABELS[3], pillar: fourPillars.hour },
  ];

  const dominantColor = ELEMENT_COLORS[dominantElement] ?? "#fff";

  return (
    <section className="space-y-8">
      {/* Section Header */}
      <div className="space-y-1">
        <p className={styles.sectionLabel}>
          Section A
        </p>
        <h2 className={styles.sectionTitle}>
          사주 프로필{" "}
          <span className={styles.sectionSubtitle}>- 타고난 기질</span>
        </h2>
      </div>

      {/* Four Pillars */}
      <div className="grid grid-cols-4 gap-3">
        {pillars.map(({ label, pillar }, i) => {
          if (!pillar) {
            return (
              <div
                key={i}
                className={styles.emptyPillarCard}
              >
                <span className={styles.emptyPillarLabel}>{label}</span>
                <span className={styles.emptyPillarSub}>미입력</span>
              </div>
            );
          }
          return (
            <SajuPillarCard
              key={i}
              label={label}
              stem={pillar.stem}
              branch={pillar.branch}
              stemElement={pillar.stemElement}
              branchElement={pillar.branchElement}
              isHighlighted={i === 2}
            />
          );
        })}
      </div>

      {/* Chart + Archetype Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Five Elements Chart */}
        <div className={`${styles.card} ${IS_TOSS ? '' : 'bg-card'}`}>
          <h3 className={styles.cardTitle}>오행 분포</h3>
          <FiveElementsChart distribution={elementDistribution} />
        </div>

        {/* Day Master Archetype */}
        <div className={`${styles.card} ${IS_TOSS ? '' : 'bg-card'} space-y-4`}>
          <h3 className={styles.dayMasterCardTitle}>일간 아키타입</h3>

          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl border"
              style={{
                borderColor: `${dominantColor}40`,
                background: `${dominantColor}15`,
              }}
            >
              {dayMaster.image.slice(0, 2)}
            </div>
            <div>
              <p
                className={styles.dayMasterName}
                style={{ color: dominantColor }}
              >
                {dayMaster.name}
              </p>
              <p className={styles.dayMasterSub}>{dayMaster.image}</p>
            </div>
          </div>

          <p className={styles.dayMasterDesc}>
            {dayMaster.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {dayMaster.keywords.map((kw, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-1 rounded-full border font-medium"
                style={{
                  borderColor: `${dominantColor}40`,
                  color: dominantColor,
                  background: `${dominantColor}10`,
                }}
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
