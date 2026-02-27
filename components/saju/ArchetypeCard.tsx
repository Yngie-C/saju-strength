"use client";

import { designTokens, ELEMENT_COLORS, ELEMENT_BG_ADAPTIVE } from "@/lib/design-tokens";

interface ArchetypeCardProps {
  name: string;
  element: string;
  keywords: string[];
  description: string;
  image: string;
}

const ELEMENT_KOREAN_FULL: Record<string, string> = {
  wood: "목(木)", fire: "화(火)", earth: "토(土)", metal: "금(金)", water: "수(水)",
};

export function ArchetypeCard({
  name,
  element,
  keywords,
  description,
  image,
}: ArchetypeCardProps) {
  const color = ELEMENT_COLORS[element] ?? "#a1a1aa";
  const bg = ELEMENT_BG_ADAPTIVE[element] ?? designTokens.elementBgFallback;

  return (
    <div
      className={`${designTokens.cardRadiusOuter} border ${designTokens.borderDefault} overflow-hidden`}
      style={{ background: bg }}
    >
      {/* 헤더 */}
      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${designTokens.headerSeparator}` }}
      >
        <div>
          <p className="text-xs font-medium mb-1" style={{ color }}>
            {ELEMENT_KOREAN_FULL[element]} 일간 아키타입
          </p>
          <h3 className={`text-2xl font-bold ${designTokens.textPrimary}`}>{name}</h3>
        </div>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold border-2"
          style={{ borderColor: color, color, background: `${color}18` }}
        >
          {ELEMENT_KOREAN_FULL[element]?.charAt(0)}
        </div>
      </div>

      {/* 본문 */}
      <div className="px-6 py-4 space-y-4">
        {/* 키워드 태그 */}
        <div className="flex flex-wrap gap-2">
          {keywords.map((kw, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-xs font-medium border"
              style={{
                color,
                borderColor: `${color}40`,
                background: `${color}12`,
              }}
            >
              {kw}
            </span>
          ))}
        </div>

        {/* 설명 */}
        <p className={`text-sm ${designTokens.textSecondary} leading-relaxed`}>{description}</p>

        {/* 비유 이미지 */}
        <p
          className={`text-sm italic ${designTokens.textMuted} leading-relaxed border-l-2 pl-3`}
          style={{ borderColor: `${color}50` }}
        >
          &ldquo;{image}&rdquo;
        </p>
      </div>
    </div>
  );
}
