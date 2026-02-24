"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from "recharts";

const IS_TOSS = process.env.NEXT_PUBLIC_BUILD_TARGET === "toss";

interface DualRadarChartProps {
  elementData: Array<{ axis: string; value: number }>;
  psaData: Array<{ axis: string; value: number }>;
}

const AXES = ["혁신/목", "영향/화", "협업/토", "실행/금", "회복/수"];

export function DualRadarChart({ elementData, psaData }: DualRadarChartProps) {
  // Merge into single data array for recharts
  const data = AXES.map((axis) => {
    const el = elementData.find((d) => d.axis === axis);
    const psa = psaData.find((d) => d.axis === axis);
    return {
      axis,
      element: el?.value ?? 0,
      psa: psa?.value ?? 0,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius={100} data={data}>
        <PolarGrid stroke={IS_TOSS ? "#e5e8eb" : "rgba(255,255,255,0.08)"} />
        <PolarAngleAxis
          dataKey="axis"
          tick={{
            fill: IS_TOSS ? "#6b7684" : "rgba(255,255,255,0.5)",
            fontSize: 12,
          }}
        />
        <Radar
          name="사주 오행 (선천)"
          dataKey="element"
          stroke="#3182f6"
          fill="#3182f6"
          fillOpacity={0.3}
        />
        <Radar
          name="PSA 강점 (후천)"
          dataKey="psa"
          stroke="#06b6d4"
          fill="#06b6d4"
          fillOpacity={0.3}
        />
        <Legend
          wrapperStyle={{
            fontSize: "12px",
            color: IS_TOSS ? "#4e5968" : "rgba(255,255,255,0.6)",
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
