"use client";

const IS_TOSS = process.env.NEXT_PUBLIC_BUILD_TARGET === 'toss';

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import { Star, Diamond, TrendingUp, Circle, Sparkles, BarChart3, GitMerge, ArrowRight } from "lucide-react";

const styles = IS_TOSS ? {
  page: 'min-h-screen bg-white',
  heroTitle: 'text-t1 font-bold text-tds-grey-900',
  heroSubtitle: 'text-st8 text-tds-grey-700',
  ctaButton: 'bg-tds-blue-500 text-white rounded-[14px] w-full py-4 font-semibold text-t5 hover:bg-tds-blue-600 transition-colors',
  card: 'bg-white border border-tds-grey-200 rounded-xl p-6',
  badge: 'bg-tds-blue-50 text-tds-blue-600 border border-tds-blue-100 rounded-full px-3 py-1 text-st11 font-medium',
  sectionTitle: 'text-t3 font-bold text-tds-grey-900',
  bodyText: 'text-st8 text-tds-grey-700',
  caption: 'text-st11 text-tds-grey-500',
  container: 'px-6 py-8 max-w-[375px] mx-auto',
} : {
  page: 'min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900',
  heroTitle: 'text-5xl md:text-7xl font-bold text-white',
  heroSubtitle: 'text-lg text-white/70',
  ctaButton: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl w-full py-3.5 font-bold hover:from-purple-400 hover:to-pink-400 transition-all',
  card: 'bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl p-6',
  badge: 'bg-purple-500/20 text-purple-300 border border-purple-400/20 rounded-full px-3 py-1 text-xs font-medium',
  sectionTitle: 'text-3xl font-bold text-white',
  bodyText: 'text-sm text-white/70',
  caption: 'text-xs text-white/40',
  container: 'px-4 py-12 max-w-2xl mx-auto',
} as const;

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
    <main className={`${styles.page} ${IS_TOSS ? 'text-tds-grey-900' : 'text-white'} overflow-x-hidden`}>
      {/* 히어로 섹션 */}
      <section className={`relative flex flex-col items-center justify-center min-h-screen ${IS_TOSS ? 'px-6' : 'px-4'} pt-20 pb-16 text-center`}>
        {/* 배경 글로우 */}
        {!IS_TOSS && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-3xl" />
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 flex flex-col items-center gap-6 max-w-2xl mx-auto"
        >
          {/* 뱃지 */}
          <span className={`inline-flex items-center gap-1.5 ${styles.badge}`}>
            <Sparkles size={12} />
            사주 × 강점 교차 분석
          </span>

          {/* 타이틀 */}
          <h1 className="text-5xl sm:text-7xl font-extrabold leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
              사주강점
            </span>
          </h1>

          {/* 서브타이틀 */}
          <p className={`font-medium leading-snug ${styles.heroSubtitle}`}>
            타고난 기질 × 현재 강점 = 당신만의 성장 지도
          </p>

          {/* 설명 */}
          <p className={`leading-relaxed max-w-md whitespace-pre-line ${styles.caption}`}>
            {"사주 오행 분석과 Big5 기반 강점 설문으로\n선천적 기질과 후천적 강점을 교차 분석합니다."}
          </p>

          {/* CTA */}
          <motion.button
            whileHover={IS_TOSS ? undefined : { scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/birth-info")}
            className="mt-2 inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg shadow-lg shadow-purple-900/50 hover:shadow-purple-700/60 transition-shadow"
          >
            무료로 시작하기
            <ArrowRight size={20} />
          </motion.button>

          {/* 무료 강조 */}
          <p className={`tracking-wide ${styles.caption}`}>
            100% 무료 · 5분 소요 · 즉시 결과
          </p>
        </motion.div>
      </section>

      {/* 가치 제안 3컬럼 */}
      <section className={`${IS_TOSS ? 'px-6' : 'px-4'} py-20`}>
        <div className="max-w-5xl mx-auto">
          <SectionReveal className="text-center mb-12">
            <h2 className={styles.sectionTitle}>어떻게 분석하나요?</h2>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: <Sparkles size={28} className="text-purple-400" />,
                step: "01",
                title: "사주 오행 분석",
                desc: "생년월일시로 타고난 에너지 패턴 분석",
              },
              {
                icon: <BarChart3 size={28} className="text-pink-400" />,
                step: "02",
                title: "Big5 강점 설문",
                desc: "60문항으로 현재 발현 중인 강점 측정",
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
                  className={`rounded-2xl flex flex-col gap-4 ${styles.card}`}
                  style={IS_TOSS ? undefined : { background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)" }}
                >
                  <div className="flex items-center justify-between">
                    {item.icon}
                    <span className={`text-3xl font-black ${IS_TOSS ? 'text-tds-grey-200' : 'text-white/10'}`}>{item.step}</span>
                  </div>
                  <h3 className={`text-lg font-bold ${IS_TOSS ? 'text-tds-grey-900' : 'text-white'}`}>{item.title}</h3>
                  <p className={`leading-relaxed ${styles.bodyText}`}>{item.desc}</p>
                </motion.div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4유형 설명 섹션 */}
      <section className={`${IS_TOSS ? 'px-6' : 'px-4'} py-20`}>
        <div className="max-w-5xl mx-auto">
          <SectionReveal className="text-center mb-12">
            <h2 className={styles.sectionTitle}>4가지 강점 유형</h2>
            <p className={`mt-3 ${styles.caption}`}>교차 분석이 발견하는 당신의 강점 지형</p>
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
                icon: <Diamond size={22} className="text-purple-400" />,
                badge: "◆ 잠재력",
                badgeColor: "bg-purple-500/15 text-purple-300 border-purple-500/30",
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
                  className={`rounded-2xl flex flex-col gap-3 h-full ${styles.card}`}
                  style={IS_TOSS ? undefined : { background: "rgba(255,255,255,0.03)" }}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>
                  <p className={`text-base font-semibold ${IS_TOSS ? 'text-tds-grey-800' : 'text-white/90'}`}>{item.title}</p>
                  <p className={`leading-relaxed ${styles.bodyText}`}>{item.desc}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 하단 CTA */}
      <SectionReveal>
        <section className={`${IS_TOSS ? 'px-6' : 'px-4'} py-20 text-center`}>
          <div className="max-w-lg mx-auto flex flex-col items-center gap-6">
            <h2 className={styles.sectionTitle}>
              지금 바로 분석해보세요
            </h2>
            <motion.button
              whileHover={IS_TOSS ? undefined : { scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/birth-info")}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg shadow-lg shadow-purple-900/50"
            >
              무료로 시작하기
              <ArrowRight size={20} />
            </motion.button>
            <p className={`tracking-wide ${styles.caption}`}>100% 무료 · 5분 소요 · 즉시 결과</p>
          </div>
        </section>
      </SectionReveal>

      {/* Footer 면책 고지 */}
      <footer className={`${IS_TOSS ? 'px-6' : 'px-4'} py-10 border-t ${IS_TOSS ? 'border-tds-grey-200' : 'border-white/8'}`}>
        <p className={`max-w-2xl mx-auto text-center leading-relaxed ${styles.caption}`}>
          이 서비스는 동양 전통 기질 분석과 현대 강점 진단의 융합 서비스이며, 의학적/심리학적 진단을 대체하지 않습니다.
        </p>
      </footer>
    </main>
  );
}
