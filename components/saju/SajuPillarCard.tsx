"use client";

import { cn } from "@/lib/utils";
import { ELEMENT_COLORS, ELEMENT_BG, ELEMENT_BG_TOSS, ELEMENT_KOREAN } from "@/lib/design-tokens";

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

const IS_TOSS = process.env.NEXT_PUBLIC_BUILD_TARGET === 'toss';

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

  if (IS_TOSS) {
    return (
      <div
        className={cn(
          "relative flex flex-col items-center rounded-xl border transition-all duration-200 overflow-hidden",
          isHighlighted
            ? "border-tds-blue-400 shadow-[0_0_16px_rgba(59,130,246,0.20)]"
            : "border-tds-grey-200"
        )}
        style={{
          background: isHighlighted
            ? "linear-gradient(160deg, rgba(59,130,246,0.08) 0%, rgba(59,130,246,0.02) 100%)"
            : "#fff",
        }}
      >
        {/* 레이블 */}
        <div
          className={cn(
            "w-full text-center py-2 text-xs font-semibold tracking-widest",
            isHighlighted ? "text-tds-blue-500" : "text-tds-grey-500"
          )}
          style={{ background: "rgba(0,0,0,0.04)" }}
        >
          {label}
          {isHighlighted && (
            <span className="ml-1 text-[10px] text-tds-blue-400">(일간)</span>
          )}
        </div>

        {/* 천간 */}
        <div
          className="flex flex-col items-center justify-center py-5 w-full"
          style={{ background: ELEMENT_BG_TOSS[stemElement] }}
        >
          <span
            className="text-4xl font-bold leading-none"
            style={{ color: stemColor }}
          >
            {stem}
          </span>
          <span className="mt-1 text-[11px] text-tds-grey-500">
            {STEM_KOREAN[stem] ?? stem} · {ELEMENT_KOREAN[stemElement]}
          </span>
        </div>

        {/* 구분선 */}
        <div className="w-full h-px bg-tds-grey-200" />

        {/* 지지 */}
        <div
          className="flex flex-col items-center justify-center py-5 w-full"
          style={{ background: ELEMENT_BG_TOSS[branchElement] }}
        >
          <span
            className="text-4xl font-bold leading-none"
            style={{ color: branchColor }}
          >
            {branch}
          </span>
          <span className="mt-1 text-[11px] text-tds-grey-500">
            {BRANCH_KOREAN[branch] ?? branch} · {ELEMENT_KOREAN[branchElement]}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex flex-col items-center rounded-2xl border transition-all duration-200 overflow-hidden",
        isHighlighted
          ? "border-primary/60 shadow-[0_0_24px_rgba(49,130,246,0.25)] bg-card"
          : "border-border bg-card"
      )}
      style={isHighlighted ? {
        background: "linear-gradient(160deg, rgba(49,130,246,0.12) 0%, rgba(49,130,246,0.04) 100%)",
      } : undefined}
    >
      {/* 레이블 */}
      <div
        className={cn(
          "w-full text-center py-2 text-xs font-semibold tracking-widest",
          isHighlighted ? "text-primary" : "text-muted-foreground/50"
        )}
        style={{ background: "rgba(0,0,0,0.2)" }}
      >
        {label}
        {isHighlighted && (
          <span className="ml-1 text-[10px] text-primary/70">(일간)</span>
        )}
      </div>

      {/* 천간 */}
      <div
        className="flex flex-col items-center justify-center py-5 w-full"
        style={{ background: ELEMENT_BG[stemElement] }}
      >
        <span
          className="text-4xl font-bold leading-none"
          style={{ color: stemColor }}
        >
          {stem}
        </span>
        <span className="mt-1 text-[11px] text-muted-foreground/50">
          {STEM_KOREAN[stem] ?? stem} · {ELEMENT_KOREAN[stemElement]}
        </span>
      </div>

      {/* 구분선 */}
      <div className="w-full h-px bg-border" />

      {/* 지지 */}
      <div
        className="flex flex-col items-center justify-center py-5 w-full"
        style={{ background: ELEMENT_BG[branchElement] }}
      >
        <span
          className="text-4xl font-bold leading-none"
          style={{ color: branchColor }}
        >
          {branch}
        </span>
        <span className="mt-1 text-[11px] text-muted-foreground/50">
          {BRANCH_KOREAN[branch] ?? branch} · {ELEMENT_KOREAN[branchElement]}
        </span>
      </div>
    </div>
  );
}
