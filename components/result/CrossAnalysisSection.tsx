"use client";

import { DualRadarChart } from "@/components/result/DualRadarChart";
import { CrossAnalysisType, FiveElement } from "@/types/saju";
import { ELEMENT_COLORS } from "@/lib/design-tokens";
import { crossAnalysisStyles as styles } from "@/lib/section-styles";

interface AxisData {
  element: FiveElement;
  psaCategory: string;
  elementRank: number;
  psaRank: number;
  type: CrossAnalysisType;
  insight: string;
}

interface CrossAnalysisSectionProps {
  axes: AxisData[];
}

const TYPE_CONFIG: Record<
  CrossAnalysisType,
  { label: string; color: string; icon: string; description: string }
> = {
  alignment: {
    label: "핵심 무기",
    color: "#a855f7",
    icon: "★",
    description: "선천·후천 모두 강함",
  },
  potential: {
    label: "숨겨진 보석",
    color: "#eab308",
    icon: "◆",
    description: "선천 강하나 아직 미개발",
  },
  developed: {
    label: "노력의 결실",
    color: "#22c55e",
    icon: "↑",
    description: "후천 노력으로 발달",
  },
  undeveloped: {
    label: "성장 기회",
    color: "#a1a1aa",
    icon: "✿",
    description: "발전 가능한 영역",
  },
};

const ELEMENT_TO_AXIS: Record<FiveElement, string> = {
  wood: "혁신/목",
  fire: "영향/화",
  earth: "협업/토",
  metal: "실행/금",
  water: "회복/수",
};

const PSA_TO_AXIS: Record<string, string> = {
  innovation: "혁신/목",
  influence: "영향/화",
  collaboration: "협업/토",
  execution: "실행/금",
  resilience: "회복/수",
};

// rank→score: rank 1=100, 2=80, 3=60, 4=40, 5=20
function rankToScore(rank: number): number {
  return Math.max(0, 120 - rank * 20);
}

export function CrossAnalysisSection({ axes }: CrossAnalysisSectionProps) {
  const AXES_ORDER = ["혁신/목", "영향/화", "협업/토", "실행/금", "회복/수"];

  const elementData = AXES_ORDER.map((axis) => {
    const found = axes.find((a) => ELEMENT_TO_AXIS[a.element] === axis);
    return { axis, value: found ? rankToScore(found.elementRank) : 0 };
  });

  const psaData = AXES_ORDER.map((axis) => {
    const found = axes.find((a) => PSA_TO_AXIS[a.psaCategory] === axis);
    return { axis, value: found ? rankToScore(found.psaRank) : 0 };
  });

  // Group by type
  const grouped = axes.reduce<Record<CrossAnalysisType, AxisData[]>>(
    (acc, axis) => {
      if (!acc[axis.type]) acc[axis.type] = [];
      acc[axis.type].push(axis);
      return acc;
    },
    { alignment: [], potential: [], developed: [], undeveloped: [] }
  );

  const matrixTypes: CrossAnalysisType[] = [
    "alignment",
    "potential",
    "developed",
    "undeveloped",
  ];

  return (
    <section className="space-y-8">
      {/* Section Header */}
      <div className="space-y-1">
        <p className={styles.sectionLabel}>
          Section C
        </p>
        <h2 className={styles.sectionTitle}>
          교차 분석{" "}
          <span className={styles.sectionSubtitle}>
            - 선천 × 후천
          </span>
        </h2>
        <p className={styles.sectionDesc}>
          사주 오행(타고난 기질)과 PSA 강점(현재 강점)을 겹쳐 분석해요
        </p>
      </div>

      {/* Dual Radar Chart */}
      <div className={`${styles.card} ${styles.cardFill}`}>
        <h3 className={styles.cardTitle}>
          선천 · 후천 이중 레이더
        </h3>
        <DualRadarChart elementData={elementData} psaData={psaData} />
      </div>

      {/* Unified Type Cards */}
      <div className="space-y-4">
        {matrixTypes.map((type) => {
          const cfg = TYPE_CONFIG[type];
          const items = grouped[type] ?? [];
          if (items.length === 0) return null;
          return (
            <div
              key={type}
              className="rounded-2xl border p-5 space-y-4"
              style={{
                borderColor: `${cfg.color}30`,
                background: `${cfg.color}06`,
              }}
            >
              {/* Type Header */}
              <div className="flex items-center gap-2">
                <span
                  className="text-t5"
                  style={{ color: cfg.color }}
                >
                  {cfg.icon}
                </span>
                <div>
                  <p
                    className="text-t5 font-semibold"
                    style={{ color: cfg.color }}
                  >
                    {cfg.label}
                  </p>
                  <p className="text-st10 text-tds-grey-400">{cfg.description}</p>
                </div>
              </div>
              {/* Axis Insights */}
              <div className="space-y-3">
                {items.map((ax, i) => {
                  const axisLabel = ELEMENT_TO_AXIS[ax.element];
                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{
                            background: ELEMENT_COLORS[ax.element],
                          }}
                        />
                        <span
                          className="text-st8 font-semibold"
                          style={{ color: ELEMENT_COLORS[ax.element] }}
                        >
                          {axisLabel}
                        </span>
                      </div>
                      <p className="text-st8 text-tds-grey-600 leading-relaxed">
                        {ax.insight}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
