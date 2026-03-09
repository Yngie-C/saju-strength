'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { decodeShareData, type SharePayload } from '@/lib/share-encoder';
import { IS_TOSS, designTokens, ELEMENT_KOREAN } from '@/lib/design-tokens';
import { resultTokens } from '@/lib/section-styles';

const PSA_LABELS: Record<string, string> = {
  innovation: '혁신 사고',
  execution: '철저 실행',
  influence: '대인 영향',
  collaboration: '협업 공감',
  resilience: '상황 회복',
};

function SharedContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<SharePayload | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const encoded = searchParams.get('d');
    if (!encoded) {
      setError(true);
      return;
    }
    const decoded = decodeShareData(encoded);
    if (!decoded) {
      setError(true);
      return;
    }
    setData(decoded);
  }, [searchParams]);

  if (error || (!data && typeof window !== 'undefined')) {
    return (
      <div className={`${resultTokens.page} flex flex-col items-center justify-center`}>
        <meta name="referrer" content="no-referrer" />
        <div className={`${resultTokens.container} text-center space-y-6 flex flex-col items-center`}>
          <div className="space-y-2">
            <h1 className={`${resultTokens.title} text-xl`}>공유 링크가 유효하지 않아요</h1>
            <p className={resultTokens.subtitle}>잘못된 링크이거나 만료된 링크예요.</p>
          </div>
          <Link
            href="/"
            className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all ${designTokens.primaryButton}`}
          >
            나도 분석하기
          </Link>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const elementKo = ELEMENT_KOREAN[data.de] || data.de;

  return (
    <div className={resultTokens.page}>
      <meta name="referrer" content="no-referrer" />
      <div className={`${resultTokens.container} space-y-8`}>
        {/* Header */}
        <div className="text-center space-y-2">
          <div className={designTokens.badge}>사주강점 분석 결과</div>
          <h1 className={`${resultTokens.title} mt-3`}>{data.tt}</h1>
          <p className={resultTokens.subtitle}>{data.tg}</p>
        </div>

        {/* Day Master + Element */}
        <div className={`${resultTokens.card} space-y-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs font-medium ${designTokens.textTertiary}`}>일간 아키타입</p>
              <p className={`text-lg font-bold ${designTokens.textPrimary}`}>{data.dm}</p>
            </div>
            <div className="text-right">
              <p className={`text-xs font-medium ${designTokens.textTertiary}`}>우세 오행</p>
              <p className={`text-lg font-bold ${designTokens.accentText}`}>{elementKo}({data.de})</p>
            </div>
          </div>
        </div>

        {/* Top Categories */}
        {data.tc.length > 0 && (
          <div className={`${resultTokens.card} space-y-4`}>
            <h2 className={`text-sm font-semibold ${designTokens.textSecondary}`}>상위 강점</h2>
            <div className="space-y-3">
              {data.tc.map(([cat, score], i) => (
                <div key={cat} className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    IS_TOSS
                      ? 'bg-tds-blue-50 text-tds-blue-600'
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${designTokens.textPrimary}`}>
                      {PSA_LABELS[cat] || cat}
                    </p>
                  </div>
                  <span className={`text-sm font-bold ${designTokens.accentText}`}>
                    {Math.round(score)}점
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Persona Type Badge */}
        <div className="text-center">
          <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
            IS_TOSS
              ? 'bg-tds-grey-100 text-tds-grey-700'
              : 'bg-secondary text-secondary-foreground'
          }`}>
            {data.pt}
          </span>
        </div>

        {/* CTA */}
        <div className="text-center space-y-3 pt-4">
          <p className={`text-sm ${designTokens.textMuted}`}>나의 사주강점도 분석해보세요</p>
          <Link
            href="/"
            className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all ${designTokens.primaryButton}`}
          >
            나도 분석하기
          </Link>
          <p className={`text-xs ${designTokens.textCaption}`}>100% 무료 · 3분 소요 · 즉시 결과</p>
        </div>

        <p className={`text-center leading-relaxed pb-8 ${designTokens.disclaimer}`}>
          이 서비스는 재미와 자기 이해를 위한 도구이며, 의학적/심리학적 진단을 대체하지 않아요.
        </p>
      </div>
    </div>
  );
}

export default function SharedPage() {
  return (
    <Suspense fallback={null}>
      <SharedContent />
    </Suspense>
  );
}
