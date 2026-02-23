"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

interface CategoryScore {
  category: string;
  normalizedScore: number;
  rank: number;
}

interface Persona {
  type: string;
  title: string;
  tagline?: string;
}

interface PsaProfileSectionProps {
  categoryScores: CategoryScore[];
  persona: Persona;
  radarData: Array<{ category: string; score: number }>;
  strengthsSummary: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  innovation: "혁신 사고",
  execution: "철저 실행",
  influence: "대인 영향",
  collaboration: "협업 공감",
  resilience: "상황 회복",
};

const RANK_COLORS = ["#a855f7", "#06b6d4", "#22c55e", "#eab308", "#a1a1aa"];

export function PsaProfileSection({
  categoryScores,
  persona,
  radarData,
  strengthsSummary,
}: PsaProfileSectionProps) {
  const sorted = [...categoryScores].sort((a, b) => a.rank - b.rank);

  return (
    <section className="space-y-8">
      {/* Section Header */}
      <div className="space-y-1">
        <p className="text-xs font-semibold tracking-widest text-cyan-400/70 uppercase">
          Section B
        </p>
        <h2 className="text-2xl font-bold text-foreground">
          PSA 강점 프로필{" "}
          <span className="text-white/40 font-normal text-lg">- 현재 강점</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div
          className="rounded-2xl border border-white/10 p-6"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <h3 className="text-sm font-semibold text-white/60 mb-2">
            5차원 강점 레이더
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart cx="50%" cy="50%" outerRadius={90} data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis
                dataKey="category"
                tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11 }}
              />
              <Radar
                name="PSA 점수"
                dataKey="score"
                stroke="#06b6d4"
                fill="#06b6d4"
                fillOpacity={0.35}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Persona Card */}
        <div
          className="rounded-2xl border border-cyan-400/20 p-6 space-y-4"
          style={{
            background:
              "linear-gradient(160deg, rgba(6,182,212,0.08) 0%, rgba(6,182,212,0.02) 100%)",
          }}
        >
          <h3 className="text-sm font-semibold text-white/60">나의 페르소나</h3>
          <div>
            <p className="text-2xl font-bold text-cyan-300">{persona.title}</p>
            {persona.tagline && (
              <p className="text-sm text-white/50 mt-1 italic">
                &ldquo;{persona.tagline}&rdquo;
              </p>
            )}
          </div>

          <p className="text-sm text-white/70 leading-relaxed">
            {strengthsSummary}
          </p>
        </div>
      </div>

      {/* Category Score Bars */}
      <div
        className="rounded-2xl border border-white/10 p-6 space-y-4"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <h3 className="text-sm font-semibold text-white/60">카테고리별 점수</h3>
        <div className="space-y-3">
          {sorted.map((cs, i) => {
            const label = CATEGORY_LABELS[cs.category] ?? cs.category;
            const color = RANK_COLORS[i] ?? "#a1a1aa";
            return (
              <div key={cs.category} className="flex items-center gap-3">
                {/* Rank Badge */}
                <span
                  className="text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}25`, color }}
                >
                  {cs.rank}
                </span>
                {/* Label */}
                <span className="text-sm text-white/70 w-20 flex-shrink-0">
                  {label}
                </span>
                {/* Bar */}
                <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${cs.normalizedScore}%`,
                      background: color,
                    }}
                  />
                </div>
                {/* Score */}
                <span
                  className="text-xs font-semibold w-10 text-right flex-shrink-0"
                  style={{ color }}
                >
                  {Math.round(cs.normalizedScore)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
