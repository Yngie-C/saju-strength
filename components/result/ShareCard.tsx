'use client';

import { useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';

interface ShareCardProps {
  userName: string | null;
  personaTitle: string;
  personaTagline: string;
  dayMasterName: string;
  dominantElement: string;
  topCategories: { name: string; score: number }[];
  onSaved?: () => void;
  onError?: () => void;
}

const ELEMENT_KOREAN: Record<string, string> = {
  wood: '목(木)',
  fire: '화(火)',
  earth: '토(土)',
  metal: '금(金)',
  water: '수(水)',
};

const ELEMENT_COLORS: Record<string, string> = {
  wood: '#22C55E',
  fire: '#EF4444',
  earth: '#F59E0B',
  metal: '#A1A1AA',
  water: '#3B82F6',
};

const PSA_LABELS: Record<string, string> = {
  innovation: '혁신 사고',
  execution: '철저 실행',
  influence: '대인 영향',
  collaboration: '협업 공감',
  resilience: '상황 회복',
};

export function ShareCard({
  userName,
  personaTitle,
  personaTagline,
  dayMasterName,
  dominantElement,
  topCategories,
  onSaved,
  onError,
}: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleSaveImage = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        width: 1080,
        height: 1080,
        pixelRatio: 2,
        backgroundColor: '#FFFFFF',
      });
      const link = document.createElement('a');
      link.download = `saju-strength-${userName || 'result'}.png`;
      link.href = dataUrl;
      link.click();
      onSaved?.();
    } catch {
      onError?.();
    }
  }, [userName, onSaved, onError]);

  const elementColor = ELEMENT_COLORS[dominantElement] || '#3B82F6';

  return (
    <>
      {/* 캡처 대상: 화면 밖에 렌더링 */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div
          ref={cardRef}
          style={{
            width: 1080,
            height: 1080,
            padding: 80,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          {/* 상단 브랜드 */}
          <div style={{ fontSize: 28, color: '#9CA3AF', letterSpacing: 4, marginBottom: 48 }}>
            사주강점
          </div>

          {/* 메인: 페르소나 */}
          <div style={{ fontSize: 56, fontWeight: 800, color: '#111827', marginBottom: 16, textAlign: 'center' }}>
            {userName ? `${userName}님은` : '나는'}
          </div>
          <div style={{ fontSize: 64, fontWeight: 800, color: elementColor, marginBottom: 24, textAlign: 'center' }}>
            {personaTitle}
          </div>
          <div style={{ fontSize: 28, color: '#6B7280', marginBottom: 64, textAlign: 'center' }}>
            {personaTagline}
          </div>

          {/* 일간 + 오행 */}
          <div style={{ display: 'flex', gap: 32, marginBottom: 48 }}>
            <div style={{
              padding: '16px 32px',
              borderRadius: 16,
              backgroundColor: '#F3F4F6',
              fontSize: 24,
              color: '#374151',
            }}>
              일간: {dayMasterName}
            </div>
            <div style={{
              padding: '16px 32px',
              borderRadius: 16,
              backgroundColor: `${elementColor}26`,
              fontSize: 24,
              color: elementColor,
              fontWeight: 600,
            }}>
              주요 오행: {ELEMENT_KOREAN[dominantElement] || dominantElement}
            </div>
          </div>

          {/* Top 강점 */}
          <div style={{ display: 'flex', gap: 24 }}>
            {topCategories.map((cat, i) => (
              <div key={i} style={{
                padding: '12px 28px',
                borderRadius: 12,
                border: '2px solid #E5E7EB',
                fontSize: 22,
                color: '#4B5563',
              }}>
                {PSA_LABELS[cat.name] ?? cat.name} {cat.score}
              </div>
            ))}
          </div>

          {/* 하단 CTA */}
          <div style={{ marginTop: 64, fontSize: 22, color: '#9CA3AF' }}>
            나도 분석받기 → saju-strength
          </div>
        </div>
      </div>

      {/* 저장 버튼 */}
      <button
        onClick={handleSaveImage}
        className="w-full py-3.5 rounded-xl font-semibold text-sm bg-tds-grey-100 text-tds-grey-900 active:bg-tds-grey-200 transition-colors"
      >
        결과 이미지 저장하기
      </button>
    </>
  );
}
