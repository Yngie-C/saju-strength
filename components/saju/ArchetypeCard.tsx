"use client";

interface ArchetypeCardProps {
  name: string;
  element: string;
  keywords: string[];
  description: string;
  image: string;
}

const ELEMENT_COLORS: Record<string, string> = {
  wood:  "#22c55e",
  fire:  "#ef4444",
  earth: "#eab308",
  metal: "#a1a1aa",
  water: "#3b82f6",
};

const ELEMENT_BG: Record<string, string> = {
  wood:  "rgba(34,197,94,0.08)",
  fire:  "rgba(239,68,68,0.08)",
  earth: "rgba(234,179,8,0.08)",
  metal: "rgba(161,161,170,0.08)",
  water: "rgba(59,130,246,0.08)",
};

const ELEMENT_BG_TOSS: Record<string, string> = {
  wood:  "rgba(34,197,94,0.05)",
  fire:  "rgba(239,68,68,0.05)",
  earth: "rgba(234,179,8,0.05)",
  metal: "rgba(161,161,170,0.05)",
  water: "rgba(59,130,246,0.05)",
};

const ELEMENT_KOREAN: Record<string, string> = {
  wood: "목(木)", fire: "화(火)", earth: "토(土)", metal: "금(金)", water: "수(水)",
};

const IS_TOSS = process.env.NEXT_PUBLIC_BUILD_TARGET === 'toss';

export function ArchetypeCard({
  name,
  element,
  keywords,
  description,
  image,
}: ArchetypeCardProps) {
  const color = ELEMENT_COLORS[element] ?? "#a1a1aa";
  const bg = IS_TOSS
    ? (ELEMENT_BG_TOSS[element] ?? "rgba(255,255,255,1)")
    : (ELEMENT_BG[element] ?? "rgba(255,255,255,0.04)");

  if (IS_TOSS) {
    return (
      <div
        className="rounded-xl border border-tds-grey-200 overflow-hidden bg-white"
        style={{ background: bg }}
      >
        {/* 헤더 */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: `1px solid #e5e7eb` }}
        >
          <div>
            <p className="text-xs font-medium mb-1" style={{ color }}>
              {ELEMENT_KOREAN[element]} 일간 아키타입
            </p>
            <h3 className="text-2xl font-bold text-tds-grey-900">{name}</h3>
          </div>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold border-2"
            style={{ borderColor: color, color, background: `${color}18` }}
          >
            {ELEMENT_KOREAN[element]?.charAt(0)}
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
          <p className="text-sm text-tds-grey-700 leading-relaxed">{description}</p>

          {/* 비유 이미지 */}
          <p
            className="text-sm italic text-tds-grey-500 leading-relaxed border-l-2 pl-3"
            style={{ borderColor: `${color}50` }}
          >
            &ldquo;{image}&rdquo;
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border border-white/10 overflow-hidden"
      style={{ background: bg }}
    >
      {/* 헤더 */}
      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid rgba(255,255,255,0.08)` }}
      >
        <div>
          <p className="text-xs font-medium mb-1" style={{ color }}>
            {ELEMENT_KOREAN[element]} 일간 아키타입
          </p>
          <h3 className="text-2xl font-bold text-white">{name}</h3>
        </div>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold border-2"
          style={{ borderColor: color, color, background: `${color}18` }}
        >
          {ELEMENT_KOREAN[element]?.charAt(0)}
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
        <p className="text-sm text-white/70 leading-relaxed">{description}</p>

        {/* 비유 이미지 */}
        <p
          className="text-sm italic text-white/40 leading-relaxed border-l-2 pl-3"
          style={{ borderColor: `${color}50` }}
        >
          &ldquo;{image}&rdquo;
        </p>
      </div>
    </div>
  );
}
