"use client";

import { cn } from "@/lib/utils";

interface SajuPillarCardProps {
  label: string;
  stem: string;
  branch: string;
  stemElement: string;
  branchElement: string;
  isHighlighted?: boolean;
}

const ELEMENT_COLORS: Record<string, string> = {
  wood: "#22c55e",
  fire: "#ef4444",
  earth: "#eab308",
  metal: "#a1a1aa",
  water: "#3b82f6",
};

const ELEMENT_BG: Record<string, string> = {
  wood: "rgba(34,197,94,0.08)",
  fire: "rgba(239,68,68,0.08)",
  earth: "rgba(234,179,8,0.08)",
  metal: "rgba(161,161,170,0.08)",
  water: "rgba(59,130,246,0.08)",
};

const STEM_KOREAN: Record<string, string> = {
  甲: "갑", 乙: "을", 丙: "병", 丁: "정", 戊: "무",
  己: "기", 庚: "경", 辛: "신", 壬: "임", 癸: "계",
};

const BRANCH_KOREAN: Record<string, string> = {
  子: "자", 丑: "축", 寅: "인", 卯: "묘", 辰: "진",
  巳: "사", 午: "오", 未: "미", 申: "신", 酉: "유",
  戌: "술", 亥: "해",
};

const ELEMENT_KOREAN: Record<string, string> = {
  wood: "목", fire: "화", earth: "토", metal: "금", water: "수",
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
        "relative flex flex-col items-center rounded-2xl border transition-all duration-200 overflow-hidden",
        isHighlighted
          ? "border-primary/60 shadow-[0_0_24px_rgba(139,92,246,0.35)]"
          : "border-white/10"
      )}
      style={{
        background: isHighlighted
          ? "linear-gradient(160deg, rgba(139,92,246,0.12) 0%, rgba(139,92,246,0.04) 100%)"
          : "rgba(255,255,255,0.03)",
      }}
    >
      {/* 레이블 */}
      <div
        className={cn(
          "w-full text-center py-2 text-xs font-semibold tracking-widest",
          isHighlighted ? "text-primary" : "text-white/40"
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
        <span className="mt-1 text-[11px] text-white/40">
          {STEM_KOREAN[stem] ?? stem} · {ELEMENT_KOREAN[stemElement]}
        </span>
      </div>

      {/* 구분선 */}
      <div className="w-full h-px bg-white/10" />

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
        <span className="mt-1 text-[11px] text-white/40">
          {BRANCH_KOREAN[branch] ?? branch} · {ELEMENT_KOREAN[branchElement]}
        </span>
      </div>
    </div>
  );
}
