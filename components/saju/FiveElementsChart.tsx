"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface FiveElementsChartProps {
  distribution: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
  };
}

const ELEMENTS = [
  { key: "wood",  label: "목(木)", color: "#22c55e" },
  { key: "fire",  label: "화(火)", color: "#ef4444" },
  { key: "earth", label: "토(土)", color: "#eab308" },
  { key: "metal", label: "금(金)", color: "#a1a1aa" },
  { key: "water", label: "수(水)", color: "#3b82f6" },
] as const;

type ElementKey = (typeof ELEMENTS)[number]["key"];

const IS_TOSS = process.env.NEXT_PUBLIC_BUILD_TARGET === 'toss';

export function FiveElementsChart({ distribution }: FiveElementsChartProps) {
  const total = Object.values(distribution).reduce((s, v) => s + v, 0) || 1;

  const data = ELEMENTS.map((el) => ({
    name: el.label,
    value: distribution[el.key as ElementKey],
    color: el.color,
    pct: Math.round((distribution[el.key as ElementKey] / total) * 100),
  }));

  const dominant = ELEMENTS.reduce((best, el) =>
    distribution[el.key as ElementKey] > distribution[best.key as ElementKey] ? el : best
  );

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 도넛 차트 */}
      <div className="relative w-48 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={56}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={(props: Record<string, unknown>) => {
                const payload = props.payload as Array<Record<string, unknown>> | undefined;
                const p = payload?.[0];
                if (!p) return null;
                const val = typeof p.value === "number" ? p.value : 0;
                const name = typeof p.name === "string" ? p.name : "";
                const innerPayload = p.payload as Record<string, unknown> | undefined;
                const color = typeof innerPayload?.color === "string" ? innerPayload.color : "#fff";
                return IS_TOSS ? (
                  <div style={{
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    color: "#111827",
                    fontSize: "12px",
                    padding: "6px 10px",
                  }}>
                    <span style={{ color }}>{name}</span>
                    {" "}{Math.round((val / total) * 100)}%
                  </div>
                ) : (
                  <div style={{
                    background: "hsl(218, 22%, 14%)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                    padding: "6px 10px",
                  }}>
                    <span style={{ color }}>{name}</span>
                    {" "}{Math.round((val / total) * 100)}%
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* 중앙 주도 오행 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span
            className="text-2xl font-bold"
            style={{ color: dominant.color }}
          >
            {dominant.label}
          </span>
          <span className={`text-xs mt-0.5 ${IS_TOSS ? 'text-tds-grey-500' : 'text-muted-foreground/50'}`}>주도 오행</span>
        </div>
      </div>

      {/* 범례 */}
      <div className="grid grid-cols-5 gap-2 w-full">
        {data.map((entry, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: entry.color }}
            />
            <span className={`text-[10px] ${IS_TOSS ? 'text-tds-grey-600' : 'text-muted-foreground'}`}>{entry.name}</span>
            <span
              className="text-xs font-semibold"
              style={{ color: entry.color }}
            >
              {entry.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
