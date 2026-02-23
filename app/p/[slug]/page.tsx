import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Star, Diamond } from 'lucide-react';

interface ProfilePageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  return {
    title: `사주강점 프로필 - ${params.slug}`,
    description: '사주 오행과 강점 분석 결과를 확인하세요.',
    openGraph: {
      title: `사주강점 프로필`,
      description: '사주 오행과 강점 분석 결과를 확인하세요.',
      locale: 'ko_KR',
      type: 'profile',
    },
  };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 text-white px-4 py-16">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">

        {/* 헤더 */}
        <div className="text-center flex flex-col gap-3">
          <span className="inline-block px-3 py-1 rounded-full border border-purple-500/40 bg-purple-500/10 text-purple-300 text-xs font-semibold tracking-widest uppercase self-center">
            사주강점 프로필
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
            강점 분석 리포트
          </h1>
          <p className="text-sm text-white/40">프로필 ID: {params.slug}</p>
        </div>

        {/* 사주 프로필 요약 */}
        <section
          className="rounded-2xl border border-white/10 p-6 flex flex-col gap-4"
          style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)' }}
        >
          <h2 className="text-base font-bold text-white/80 tracking-wide uppercase text-xs">사주 오행 분석</h2>
          <div className="flex flex-col gap-3">
            {/* 일간 아키타입 placeholder */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-2xl">
                🌊
              </div>
              <div>
                <p className="text-white font-bold text-lg">— 일간 아키타입</p>
                <p className="text-white/45 text-sm">분석 결과가 여기에 표시됩니다</p>
              </div>
            </div>
            {/* 오행 분포 placeholder */}
            <div className="grid grid-cols-5 gap-2 mt-1">
              {[
                { label: '목', color: 'bg-green-500' },
                { label: '화', color: 'bg-red-500' },
                { label: '토', color: 'bg-yellow-500' },
                { label: '금', color: 'bg-zinc-400' },
                { label: '수', color: 'bg-blue-500' },
              ].map((el) => (
                <div key={el.label} className="flex flex-col items-center gap-1.5">
                  <div className="w-full h-1.5 rounded-full bg-white/10">
                    <div className={`h-full rounded-full ${el.color} opacity-50`} style={{ width: '20%' }} />
                  </div>
                  <span className="text-xs text-white/40">{el.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PSA 강점 요약 */}
        <section
          className="rounded-2xl border border-white/10 p-6 flex flex-col gap-4"
          style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)' }}
        >
          <h2 className="text-base font-bold text-white/80 tracking-wide uppercase text-xs">Big5 강점 설문</h2>
          {/* 페르소나 placeholder */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-2xl">
              ✨
            </div>
            <div>
              <p className="text-white font-bold text-lg">— 강점 페르소나</p>
              <p className="text-white/45 text-sm">설문 결과가 여기에 표시됩니다</p>
            </div>
          </div>
          {/* 레이더 차트 placeholder */}
          <div className="w-full aspect-square max-w-[200px] mx-auto rounded-xl border border-white/10 bg-white/5 flex items-center justify-center">
            <p className="text-xs text-white/30">레이더 차트</p>
          </div>
        </section>

        {/* 교차 분석 하이라이트 */}
        <section className="flex flex-col gap-4">
          <h2 className="text-base font-bold text-white/80 tracking-wide uppercase text-xs">교차 분석 하이라이트</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 일치 영역 */}
            <div
              className="rounded-2xl border border-amber-500/20 p-5 flex flex-col gap-2"
              style={{ background: 'rgba(245,158,11,0.06)' }}
            >
              <div className="flex items-center gap-2">
                <Star size={16} className="text-amber-400" />
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">일치 강점</span>
              </div>
              <p className="text-white/80 text-sm">타고난 재능이 현재도 빛나는 영역</p>
              <p className="text-white/35 text-xs">분석 결과가 여기에 표시됩니다</p>
            </div>
            {/* 잠재력 영역 */}
            <div
              className="rounded-2xl border border-purple-500/20 p-5 flex flex-col gap-2"
              style={{ background: 'rgba(168,85,247,0.06)' }}
            >
              <div className="flex items-center gap-2">
                <Diamond size={16} className="text-purple-400" />
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wide">잠재력</span>
              </div>
              <p className="text-white/80 text-sm">아직 발현되지 않은 숨은 보석</p>
              <p className="text-white/35 text-xs">분석 결과가 여기에 표시됩니다</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center flex flex-col items-center gap-4 pt-4">
          <p className="text-sm text-white/50">나의 사주강점도 분석해보세요</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-base shadow-lg shadow-purple-900/50 hover:shadow-purple-700/60 transition-shadow"
          >
            나도 분석하기
            <ArrowRight size={18} />
          </Link>
          <p className="text-xs text-white/30">100% 무료 · 5분 소요 · 즉시 결과</p>
        </div>

      </div>
    </main>
  );
}
