"use client";

import { motion } from "framer-motion";
import { SajuPillarCard } from "@/components/saju/SajuPillarCard";
import { FiveElementsChart } from "@/components/saju/FiveElementsChart";
import { Pillar, ElementDistribution } from "@/types/saju";

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

const ELEMENT_COLORS: Record<string, string> = {
  wood: "#22c55e",
  fire: "#ef4444",
  earth: "#eab308",
  metal: "#a1a1aa",
  water: "#3b82f6",
};

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
        <p className="text-xs font-semibold tracking-widest text-primary/70 uppercase">
          Section A
        </p>
        <h2 className="text-2xl font-bold text-foreground">
          사주 프로필{" "}
          <span className="text-white/40 font-normal text-lg">- 타고난 기질</span>
        </h2>
      </div>

      {/* Four Pillars */}
      <div className="grid grid-cols-4 gap-3">
        {pillars.map(({ label, pillar }, i) => {
          if (!pillar) {
            return (
              <div
                key={i}
                className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02] min-h-[160px]"
              >
                <span className="text-xs text-white/30">{label}</span>
                <span className="text-xs text-white/20 mt-1">미입력</span>
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
        <div
          className="rounded-2xl border border-white/10 p-6"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <h3 className="text-sm font-semibold text-white/60 mb-4">오행 분포</h3>
          <FiveElementsChart distribution={elementDistribution} />
        </div>

        {/* Day Master Archetype */}
        <div
          className="rounded-2xl border border-white/10 p-6 space-y-4"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <h3 className="text-sm font-semibold text-white/60">일간 아키타입</h3>

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
                className="text-xl font-bold"
                style={{ color: dominantColor }}
              >
                {dayMaster.name}
              </p>
              <p className="text-xs text-white/40">{dayMaster.image}</p>
            </div>
          </div>

          <p className="text-sm text-white/70 leading-relaxed">
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
