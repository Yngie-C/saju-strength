"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import { Star, Diamond, TrendingUp, Circle, Sparkles, BarChart3, GitMerge, ArrowRight } from "lucide-react";
import { designTokens, IS_TOSS } from '@/lib/design-tokens';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

function SectionReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className={`${designTokens.pageMinHeight} ${IS_TOSS ? 'text-tds-grey-900' : 'text-foreground'} overflow-x-hidden`}>
      {/* 히어로 섹션 */}
      <section className={`relative flex flex-col items-center justify-center min-h-screen ${designTokens.pagePadding} pt-20 pb-16 text-center`}>
        {/* 배경 글로우 */}
        {!IS_TOSS && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/15 rounded-full blur-3xl" />
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 flex flex-col items-center gap-6 max-w-2xl mx-auto"
        >
          {/* 뱃지 */}
          <span className={`inline-flex items-center gap-1.5 ${designTokens.badge}`}>
            <Sparkles size={12} />
            사주 × 강점 교차 분석
          </span>

          {/* 타이틀 */}
          <h1 className={`text-5xl sm:text-7xl font-extrabold leading-tight tracking-tight ${IS_TOSS ? 'text-tds-grey-900' : ''}`}>
            {IS_TOSS ? (
              '사주강점'
            ) : (
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                사주강점
              </span>
            )}
          </h1>

          {/* 서브타이틀 */}
          <p className={`font-medium leading-snug ${IS_TOSS ? 'text-st8 text-tds-grey-700' : 'text-lg ' + designTokens.textSecondary}`}>
            타고난 기질 × 현재 강점 = 당신만의 성장 지도
          </p>

          {/* 설명 */}
          <p className={`leading-relaxed max-w-md whitespace-pre-line ${designTokens.textCaption}`}>
            {"사주 오행 분석과 Big5 기반 강점 설문으로\n선천적 기질과 후천적 강점을 교차 분석합니다."}
          </p>

          {/* CTA */}
          <motion.button
            whileHover={IS_TOSS ? undefined : { scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/survey")}
            className={`mt-2 inline-flex items-center gap-2 ${designTokens.primaryButton} px-8 py-4 font-bold text-lg shadow-lg shadow-primary/30 hover:opacity-90 transition-opacity`}
          >
            무료로 시작하기
            <ArrowRight size={20} />
          </motion.button>

          {/* 무료 강조 */}
          <p className={`tracking-wide ${designTokens.textCaption}`}>
            100% 무료 · 3분 소요 · 즉시 결과
          </p>
        </motion.div>
      </section>

      {/* 가치 제안 3컬럼 */}
      <section className={`${designTokens.pagePadding} py-20`}>
        <div className="max-w-5xl mx-auto">
          <SectionReveal className="text-center mb-12">
            <h2 className={IS_TOSS ? 'text-t3 font-bold text-tds-grey-900' : 'text-3xl font-bold text-foreground'}>어떻게 분석하나요?</h2>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: <BarChart3 size={28} className="text-primary" />,
                step: "01",
                title: "Big5 강점 설문",
                desc: "30문항으로 현재 발현 중인 강점 측정",
              },
              {
                icon: <Sparkles size={28} className="text-primary/80" />,
                step: "02",
                title: "사주 오행 분석",
                desc: "생년월일시로 타고난 에너지 패턴 분석",
              },
              {
                icon: <GitMerge size={28} className="text-amber-400" />,
                step: "03",
                title: "교차 분석 리포트",
                desc: "선천 × 후천 비교로 성장 지도 제공",
              },
            ].map((item, i) => (
              <SectionReveal key={i}>
                <motion.div
                  whileHover={IS_TOSS ? undefined : { y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`rounded-2xl flex flex-col gap-4 ${designTokens.cardBg} p-6`}
                >
                  <div className="flex items-center justify-between">
                    {item.icon}
                    <span className={`text-3xl font-black ${IS_TOSS ? 'text-tds-grey-200' : 'text-muted-foreground/20'}`}>{item.step}</span>
                  </div>
                  <h3 className={`text-lg font-bold ${IS_TOSS ? 'text-tds-grey-900' : 'text-foreground'}`}>{item.title}</h3>
                  <p className={`leading-relaxed ${designTokens.textSecondary}`}>{item.desc}</p>
                </motion.div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4유형 설명 섹션 */}
      <section className={`${designTokens.pagePadding} py-20`}>
        <div className="max-w-5xl mx-auto">
          <SectionReveal className="text-center mb-12">
            <h2 className={IS_TOSS ? 'text-t3 font-bold text-tds-grey-900' : 'text-3xl font-bold text-foreground'}>4가지 강점 유형</h2>
            <p className={`mt-3 ${designTokens.textCaption}`}>교차 분석이 발견하는 당신의 강점 지형</p>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                icon: <Star size={22} className="text-amber-400" />,
                badge: "★ 일치",
                badgeColor: "bg-amber-500/15 text-amber-300 border-amber-500/30",
                title: "타고난 재능이 현재도 빛나는 영역",
                desc: "선천적 기질과 후천적 강점이 모두 높은 당신의 핵심 강점입니다.",
              },
              {
                icon: <Diamond size={22} className="text-primary" />,
                badge: "◆ 잠재력",
                badgeColor: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
                title: "아직 발현되지 않은 숨은 보석",
                desc: "타고난 기질은 강하지만 아직 충분히 쓰이지 않은 잠재 영역입니다.",
              },
              {
                icon: <TrendingUp size={22} className="text-green-400" />,
                badge: "▲ 후천 개발",
                badgeColor: "bg-green-500/15 text-green-300 border-green-500/30",
                title: "노력으로 만들어낸 강점",
                desc: "타고난 기질 이상으로 현재 발현된 후천적 성장의 증거입니다.",
              },
              {
                icon: <Circle size={22} className="text-blue-400" />,
                badge: "○ 미발현",
                badgeColor: "bg-blue-500/15 text-blue-300 border-blue-500/30",
                title: "앞으로의 성장 기회",
                desc: "아직 개발되지 않은 영역으로 선택적 성장을 위한 기회입니다.",
              },
            ].map((item, i) => (
              <SectionReveal key={i}>
                <div
                  className={`rounded-2xl flex flex-col gap-3 h-full ${designTokens.cardBg} p-6`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>
                  <p className={`text-base font-semibold ${IS_TOSS ? 'text-tds-grey-800' : 'text-foreground/90'}`}>{item.title}</p>
                  <p className={`leading-relaxed ${designTokens.textSecondary}`}>{item.desc}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 하단 CTA */}
      <SectionReveal>
        <section className={`${designTokens.pagePadding} py-20 text-center`}>
          <div className="max-w-lg mx-auto flex flex-col items-center gap-6">
            <h2 className={IS_TOSS ? 'text-t3 font-bold text-tds-grey-900' : 'text-3xl font-bold text-foreground'}>
              지금 바로 분석해보세요
            </h2>
            <motion.button
              whileHover={IS_TOSS ? undefined : { scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/survey")}
              className={`inline-flex items-center gap-2 ${designTokens.primaryButton} px-8 py-4 font-bold text-lg shadow-lg shadow-primary/30`}
            >
              무료로 시작하기
              <ArrowRight size={20} />
            </motion.button>
            <p className={`tracking-wide ${designTokens.textCaption}`}>100% 무료 · 3분 소요 · 즉시 결과</p>
          </div>
        </section>
      </SectionReveal>

      {/* Footer 면책 고지 */}
      <footer className={`${designTokens.pagePadding} py-10 border-t ${IS_TOSS ? 'border-tds-grey-200' : 'border-border'}`}>
        <p className={`max-w-2xl mx-auto text-center leading-relaxed ${designTokens.textCaption}`}>
          이 서비스는 동양 전통 기질 분석과 현대 강점 진단의 융합 서비스이며, 의학적/심리학적 진단을 대체하지 않습니다.
        </p>
      </footer>
    </main>
  );
}
