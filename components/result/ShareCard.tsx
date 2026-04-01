'use client';

import { useRef, useCallback, useState } from 'react';
import { toPng } from 'html-to-image';
import { IS_TOSS } from '@/lib/platform';

interface ShareCardProps {
  userName: string | null;
  personaTitle: string;
  personaTagline: string;
  dayMasterName: string;
  dominantElement: string;
  weakestElement?: string;
  topCategories: { name: string; score: number }[];
  allCategories: { name: string; score: number }[];
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

const ELEMENT_GRADIENTS: Record<string, { from: string; to: string; text: string }> = {
  wood: { from: '#059669', to: '#34D399', text: '#ECFDF5' },
  fire: { from: '#DC2626', to: '#FB923C', text: '#FFF7ED' },
  earth: { from: '#D97706', to: '#FBBF24', text: '#FFFBEB' },
  metal: { from: '#52525B', to: '#A1A1AA', text: '#F4F4F5' },
  water: { from: '#2563EB', to: '#60A5FA', text: '#EFF6FF' },
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
  allCategories,
  onSaved,
  onError,
}: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);

  const handleSaveImage = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        width: 1080,
        height: 1080,
        pixelRatio: 2,
        backgroundColor: '#FFFFFF',
      });
      if (IS_TOSS) {
        // 1차: navigator.share로 이미지 공유
        try {
          const response = await fetch(dataUrl);
          const blob = await response.blob();
          const file = new File([blob], `saju-strength-${userName || 'result'}.png`, { type: 'image/png' });
          if (navigator.canShare?.({ files: [file] })) {
            await navigator.share({ files: [file], title: '사주강점 결과' });
            onSaved?.();
            return;
          }
        } catch {
          // navigator.share 실패 — 모달 폴백
        }
        // 2차: 모달 표시 + 스크린샷 안내
        setImageDataUrl(dataUrl);
        onSaved?.();
      } else {
        const link = document.createElement('a');
        link.download = `saju-strength-${userName || 'result'}.png`;
        link.href = dataUrl;
        link.click();
        onSaved?.();
      }
    } catch {
      onError?.();
    }
  }, [userName, onSaved, onError]);

  const gradient = ELEMENT_GRADIENTS[dominantElement] || ELEMENT_GRADIENTS.water;
  const elementColor = ELEMENT_COLORS[dominantElement] || '#3B82F6';
  const sortedCategories = allCategories.slice().sort((a, b) => b.score - a.score);

  return (
    <>
      {/* 캡처 대상: 화면 밖에 렌더링 */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div
          ref={cardRef}
          style={{
            width: 1080,
            height: 1080,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#FFFFFF',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            overflow: 'hidden',
          }}
        >
          {/* 헤더 섹션 — 오행 그래디언트 배경 */}
          <div style={{
            background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
            borderBottomLeftRadius: 48,
            borderBottomRightRadius: 48,
            padding: '72px 80px 64px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}>
            {/* 브랜드 */}
            <div style={{ fontSize: 24, color: gradient.text, opacity: 0.75, letterSpacing: 4 }}>
              사주강점
            </div>
            {/* 사용자명 */}
            <div style={{ fontSize: 44, fontWeight: 700, color: gradient.text, opacity: 0.9 }}>
              {userName ? `${userName}님은` : '나는'}
            </div>
            {/* 페르소나 타이틀 */}
            <div style={{ fontSize: 64, fontWeight: 800, color: gradient.text, textAlign: 'center', lineHeight: 1.2 }}>
              {personaTitle}
            </div>
            {/* 태그라인 */}
            <div style={{ fontSize: 26, color: gradient.text, opacity: 0.85, textAlign: 'center', marginTop: 4 }}>
              {personaTagline}
            </div>
          </div>

          {/* 본문 섹션 — 흰색 배경 */}
          <div style={{
            flex: 1,
            padding: '52px 80px 48px',
            display: 'flex',
            flexDirection: 'column',
            gap: 36,
          }}>
            {/* 일간 + 주요 오행 뱃지 */}
            <div style={{ display: 'flex', gap: 20 }}>
              <div style={{
                padding: '14px 28px',
                borderRadius: 16,
                backgroundColor: '#F3F4F6',
                fontSize: 22,
                color: '#374151',
                fontWeight: 500,
              }}>
                일간: {dayMasterName}
              </div>
              <div style={{
                padding: '14px 28px',
                borderRadius: 16,
                backgroundColor: `${elementColor}26`,
                fontSize: 22,
                color: elementColor,
                fontWeight: 600,
              }}>
                주요 오행: {ELEMENT_KOREAN[dominantElement] || dominantElement}
              </div>
            </div>

            {/* 5개 카테고리 바 차트 */}
            <div style={{ flex: 1 }}>
              {sortedCategories.map((cat) => (
                <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                  <div style={{ width: 100, fontSize: 20, color: '#6B7280', textAlign: 'right', flexShrink: 0 }}>
                    {PSA_LABELS[cat.name] ?? cat.name}
                  </div>
                  <div style={{ flex: 1, height: 28, backgroundColor: '#F3F4F6', borderRadius: 14, overflow: 'hidden' }}>
                    <div style={{
                      width: `${Math.round(cat.score)}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, ${gradient.from}, ${gradient.to})`,
                      borderRadius: 14,
                    }} />
                  </div>
                  <div style={{ width: 52, fontSize: 20, fontWeight: 700, color: '#374151', textAlign: 'right', flexShrink: 0 }}>
                    {Math.round(cat.score)}
                  </div>
                </div>
              ))}
            </div>

            {/* 하단 CTA */}
            <div style={{ fontSize: 20, color: '#9CA3AF', textAlign: 'center' }}>
              나도 분석받기 → saju-strength
            </div>
          </div>
        </div>
      </div>

      {/* 저장 버튼 */}
      <button
        onClick={handleSaveImage}
        className="w-full py-3.5 rounded-xl font-semibold text-sm bg-tds-blue-500 text-white active:bg-tds-blue-600 transition-colors"
      >
        결과 이미지 저장하기
      </button>

      {/* 토스 WebView 이미지 저장 모달 (스크린샷으로 저장) */}
      {imageDataUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4"
          onClick={() => setImageDataUrl(null)}
        >
          <div className="relative max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={imageDataUrl}
              alt="사주강점 결과 카드"
              className="w-full rounded-xl"
              style={{ WebkitTouchCallout: 'default' }}
            />
            <p className="text-white text-center text-sm mt-4 opacity-80">
              스크린샷으로 저장해주세요
            </p>
            <button
              onClick={() => setImageDataUrl(null)}
              className="mt-4 w-full py-3 rounded-xl bg-white/20 text-white font-semibold text-sm"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
}
