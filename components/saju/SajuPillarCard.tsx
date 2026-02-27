"use client";

import { cn } from "@/lib/utils";
import { designTokens, ELEMENT_COLORS, ELEMENT_BG_ADAPTIVE, ELEMENT_KOREAN } from "@/lib/design-tokens";

interface SajuPillarCardProps {
  label: string;
  stem: string;
  branch: string;
  stemElement: string;
  branchElement: string;
  isHighlighted?: boolean;
}

const STEM_KOREAN: Record<string, string> = {
  甲: "갑", 乙: "을", 丙: "병", 丁: "정", 戊: "무",
  己: "기", 庚: "경", 辛: "신", 壬: "임", 癸: "계",
};

const BRANCH_KOREAN: Record<string, string> = {
  子: "자", 丑: "축", 寅: "인", 卯: "묘", 辰: "진",
  巳: "사", 午: "오", 未: "미", 申: "신", 酉: "유",
  戌: "술", 亥: "해",
};

export function SajuPillarCard({
  label,
  stem,
  branch,
  stemElement,
  branchElement,
  isHighlighted = false,
}: SajuPillarCardProps) {
  const stemColor = ELEMENT_COLORS[stemElement] ?? "#fff";
  const branchColor = ELEMENT_COLORS[branchElement] ?? "#fff";

  return (
    <div
      className={cn(
        `relative flex flex-col items-center ${designTokens.cardRadiusOuter} border transition-all duration-200 overflow-hidden ${designTokens.pillarNormalBg}`,
        isHighlighted
          ? `${designTokens.highlightBorder} ${designTokens.highlightShadow}`
          : designTokens.borderDefault
      )}
      style={isHighlighted ? { background: designTokens.highlightGradient } : undefined}
    >
      {/* 레이블 */}
      <div
        className={cn(
          "w-full text-center py-2 text-xs font-semibold tracking-widest",
          isHighlighted ? designTokens.accentText : designTokens.textMuted
        )}
        style={{ background: designTokens.pillarLabelBg }}
      >
        {label}
        {isHighlighted && (
          <span className={`ml-1 text-[10px] ${designTokens.accentTextLight}`}>(일간)</span>
        )}
      </div>

      {/* 천간 */}
      <div
        className="flex flex-col items-center justify-center py-5 w-full"
        style={{ background: ELEMENT_BG_ADAPTIVE[stemElement] }}
      >
        <span
          className="text-4xl font-bold leading-none"
          style={{ color: stemColor }}
        >
          {stem}
        </span>
        <span className={`mt-1 text-[11px] ${designTokens.textMuted}`}>
          {STEM_KOREAN[stem] ?? stem} · {ELEMENT_KOREAN[stemElement]}
        </span>
      </div>

      {/* 구분선 */}
      <div className={`w-full h-px ${designTokens.dividerBg}`} />

      {/* 지지 */}
      <div
        className="flex flex-col items-center justify-center py-5 w-full"
        style={{ background: ELEMENT_BG_ADAPTIVE[branchElement] }}
      >
        <span
          className="text-4xl font-bold leading-none"
          style={{ color: branchColor }}
        >
          {branch}
        </span>
        <span className={`mt-1 text-[11px] ${designTokens.textMuted}`}>
          {BRANCH_KOREAN[branch] ?? branch} · {ELEMENT_KOREAN[branchElement]}
        </span>
      </div>
    </div>
  );
}
