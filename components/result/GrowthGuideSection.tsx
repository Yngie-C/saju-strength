"use client";

interface FocusArea {
  area: string;
  advice: string;
}

interface GrowthGuide {
  summary: string;
  focusAreas: FocusArea[];
  dailyPractice: string;
}

interface StrengthTip {
  title: string;
  description: string;
}

interface BrandingMessages {
  selfIntro: string;
  linkedinHeadline: string;
  elevatorPitch: string;
  hashtags: string[];
}

interface GrowthGuideSectionProps {
  guide: GrowthGuide;
  strengthTips?: StrengthTip[];
  brandingMessages?: BrandingMessages;
}

export function GrowthGuideSection({
  guide,
  strengthTips,
  brandingMessages,
}: GrowthGuideSectionProps) {
  return (
    <section className="space-y-8">
      {/* Section Header */}
      <div className="space-y-1">
        <p className="text-xs font-semibold tracking-widest text-emerald-400/70 uppercase">
          Section D
        </p>
        <h2 className="text-2xl font-bold text-foreground">성장 가이드</h2>
      </div>

      {/* Summary */}
      <div
        className="rounded-2xl border border-emerald-500/20 p-6"
        style={{
          background:
            "linear-gradient(160deg, rgba(34,197,94,0.07) 0%, rgba(34,197,94,0.02) 100%)",
        }}
      >
        <h3 className="text-sm font-semibold text-emerald-400 mb-3">
          종합 가이드
        </h3>
        <p className="text-sm text-white/75 leading-relaxed">{guide.summary}</p>
      </div>

      {/* Focus Areas */}
      {guide.focusAreas && guide.focusAreas.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white/60">집중 영역</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {guide.focusAreas.map((fa, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/10 p-4 space-y-2"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-sm font-semibold text-white/80">{fa.area}</p>
                </div>
                <p className="text-sm text-white/55 leading-relaxed pl-8">
                  {fa.advice}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Practice */}
      {guide.dailyPractice && (
        <div
          className="rounded-xl border border-white/10 p-5"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <h3 className="text-sm font-semibold text-white/60 mb-2">
            일상 실천 가이드
          </h3>
          <p className="text-sm text-white/70 leading-relaxed">
            {guide.dailyPractice}
          </p>
        </div>
      )}

      {/* Strength Tips */}
      {strengthTips && strengthTips.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white/60">강점 활용 팁</h3>
          <div className="space-y-3">
            {strengthTips.map((tip, i) => (
              <div
                key={i}
                className="rounded-xl border border-cyan-500/15 p-4 space-y-1.5"
                style={{ background: "rgba(6,182,212,0.05)" }}
              >
                <p className="text-sm font-semibold text-cyan-300">
                  {tip.title}
                </p>
                <p className="text-sm text-white/60 leading-relaxed">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Branding Messages */}
      {brandingMessages && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white/60">퍼스널 브랜딩</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Self Intro */}
            <div
              className="rounded-xl border border-white/10 p-4 space-y-1.5"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <p className="text-xs text-white/40 font-medium">한 줄 자기소개</p>
              <p className="text-sm text-white/80 leading-relaxed">
                {brandingMessages.selfIntro}
              </p>
            </div>

            {/* LinkedIn */}
            <div
              className="rounded-xl border border-white/10 p-4 space-y-1.5"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <p className="text-xs text-white/40 font-medium">
                LinkedIn 헤드라인
              </p>
              <p className="text-sm text-white/80 leading-relaxed">
                {brandingMessages.linkedinHeadline}
              </p>
            </div>
          </div>

          {/* Elevator Pitch */}
          <div
            className="rounded-xl border border-purple-500/15 p-4 space-y-1.5"
            style={{ background: "rgba(168,85,247,0.05)" }}
          >
            <p className="text-xs text-purple-400/70 font-medium">
              엘리베이터 피치
            </p>
            <p className="text-sm text-white/75 leading-relaxed">
              {brandingMessages.elevatorPitch}
            </p>
          </div>

          {/* Hashtags */}
          {brandingMessages.hashtags && brandingMessages.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {brandingMessages.hashtags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1.5 rounded-full border border-white/15 text-white/50 font-medium"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
