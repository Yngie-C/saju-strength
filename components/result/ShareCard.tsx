'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { IS_TOSS } from '@/lib/platform';
import type { ElementDistribution } from '@/types/saju';

const TOSS_MINION_URL = 'https://minion.toss.im/B4th4OxD';

interface ShareCardProps {
  userName: string | null;
  personaTitle: string;
  selfIntro: string;
  dayMasterName: string;
  dominantElement: string;
  elementDistribution: ElementDistribution;
  dayMasterKeywords: string[];
  allCategories: { name: string; score: number }[];
  onSaved?: () => void;
  onError?: () => void;
}

const ELEMENT_KOREAN: Record<string, string> = {
  wood: '목(木)', fire: '화(火)', earth: '토(土)', metal: '금(金)', water: '수(水)',
};

const ELEMENT_COLORS: Record<string, string> = {
  wood: '#22C55E', fire: '#EF4444', earth: '#F59E0B', metal: '#A1A1AA', water: '#3B82F6',
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

// --- Radar chart geometry ---
const RADAR_CATEGORIES = ['innovation', 'execution', 'influence', 'collaboration', 'resilience'] as const;
const SVG_W = 920;
const SVG_H = 500;
const RADAR_CX = SVG_W / 2;
const RADAR_CY = SVG_H / 2;
const RADAR_R = 170;
const ANGLES = RADAR_CATEGORIES.map((_, i) => -Math.PI / 2 + (2 * Math.PI * i) / 5);
const GRID_LEVELS = [0.2, 0.4, 0.6, 0.8, 1.0];

function radarPoint(idx: number, scale: number): [number, number] {
  const a = ANGLES[idx];
  return [RADAR_CX + RADAR_R * scale * Math.cos(a), RADAR_CY + RADAR_R * scale * Math.sin(a)];
}

function gridPolygon(scale: number): string {
  return ANGLES.map(a =>
    `${RADAR_CX + RADAR_R * scale * Math.cos(a)},${RADAR_CY + RADAR_R * scale * Math.sin(a)}`
  ).join(' ');
}

type TextAnchor = 'middle' | 'start' | 'end';
const LABEL_ANCHORS: TextAnchor[] = ['middle', 'start', 'start', 'end', 'end'];
const LABEL_DY: number[] = [-14, 0, 14, 14, 0];

function labelPos(idx: number): { x: number; y: number; anchor: TextAnchor; dy: number } {
  const [x, y] = radarPoint(idx, 1.22);
  return { x, y, anchor: LABEL_ANCHORS[idx], dy: LABEL_DY[idx] };
}

export function ShareCard({
  userName,
  personaTitle,
  selfIntro,
  dayMasterName,
  dominantElement,
  elementDistribution,
  dayMasterKeywords,
  allCategories,
  onSaved,
  onError,
}: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    import('qrcode').then(({ toDataURL }) =>
      toDataURL(TOSS_MINION_URL, {
        width: 240,
        margin: 1,
        color: { dark: '#000000', light: '#FFFFFF' },
      })
    ).then((url) => setQrDataUrl(url)).catch(() => {});
  }, []);

  const handleSaveImage = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        width: 1080,
        height: 1920,
        pixelRatio: 2,
        backgroundColor: '#FFFFFF',
      });
      if (IS_TOSS) {
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
          // navigator.share failed — modal fallback
        }
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

  // Radar scores (0-1 scale)
  const radarScores = RADAR_CATEGORIES.map(cat => {
    const found = allCategories.find(c => c.name === cat);
    return (found?.score ?? 50) / 100;
  });
  const dataPolygon = radarScores.map((s, i) => radarPoint(i, s).join(',')).join(' ');

  // Element distribution → sorted percentages
  const distEntries: [string, number][] = [
    ['wood', elementDistribution.wood],
    ['fire', elementDistribution.fire],
    ['earth', elementDistribution.earth],
    ['metal', elementDistribution.metal],
    ['water', elementDistribution.water],
  ];
  const totalDist = distEntries.reduce((a, [, v]) => a + v, 0);
  const elements = distEntries
    .sort(([, a], [, b]) => b - a)
    .map(([key, value]) => ({
      key,
      name: ELEMENT_KOREAN[key] || key,
      color: ELEMENT_COLORS[key] || '#888',
      pct: totalDist > 0 ? Math.round((value / totalDist) * 100) : 0,
    }));

  const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

  return (
    <>
      {/* 오프스크린 캡처 대상 */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div
          ref={cardRef}
          style={{
            width: 1080,
            height: 1920,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#FFFFFF',
            fontFamily: FONT,
            overflow: 'hidden',
          }}
        >
          {/* ── Section 1: 오행 그래디언트 헤더 ── */}
          <div style={{
            background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
            borderBottomLeftRadius: 48,
            borderBottomRightRadius: 48,
            padding: '72px 80px 56px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
          }}>
            <div style={{ fontSize: 24, color: gradient.text, opacity: 0.7, letterSpacing: 4 }}>
              사주강점
            </div>
            <div style={{ fontSize: 42, fontWeight: 700, color: gradient.text, opacity: 0.9 }}>
              {userName ? `${userName}님은` : '나는'}
            </div>
            <div style={{
              fontSize: 72,
              fontWeight: 800,
              color: gradient.text,
              textAlign: 'center',
              lineHeight: 1.2,
            }}>
              {personaTitle}
            </div>
            <div style={{ fontSize: 22, color: gradient.text, opacity: 0.6, marginTop: 4 }}>
              10가지 유형 중
            </div>
          </div>

          {/* ── Section 2: selfIntro 인용문 ── */}
          <div style={{
            padding: '48px 100px 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0,
          }}>
            <div style={{
              position: 'relative',
              maxWidth: 820,
              textAlign: 'center',
            }}>
              <span style={{
                position: 'absolute',
                top: -32,
                left: -20,
                fontSize: 64,
                color: gradient.from,
                opacity: 0.25,
                lineHeight: 1,
                fontFamily: 'Georgia, serif',
              }}>&ldquo;</span>
              <div style={{
                fontSize: 28,
                color: '#374151',
                lineHeight: 1.6,
                fontWeight: 500,
              }}>
                {selfIntro}
              </div>
              <span style={{
                position: 'absolute',
                bottom: -40,
                right: -20,
                fontSize: 64,
                color: gradient.from,
                opacity: 0.25,
                lineHeight: 1,
                fontFamily: 'Georgia, serif',
              }}>&rdquo;</span>
            </div>
          </div>

          {/* ── Section 3: 레이더(펜타곤) 차트 ── */}
          <div style={{
            padding: '16px 80px 8px',
            display: 'flex',
            justifyContent: 'center',
          }}>
            <svg
              width={SVG_W}
              height={SVG_H}
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Grid pentagons */}
              {GRID_LEVELS.map(level => (
                <polygon
                  key={level}
                  points={gridPolygon(level)}
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth={level === 1.0 ? 1.5 : 0.8}
                />
              ))}
              {/* Axis lines */}
              {ANGLES.map((a, i) => (
                <line
                  key={i}
                  x1={RADAR_CX} y1={RADAR_CY}
                  x2={RADAR_CX + RADAR_R * Math.cos(a)}
                  y2={RADAR_CY + RADAR_R * Math.sin(a)}
                  stroke="#E5E7EB"
                  strokeWidth={0.8}
                />
              ))}
              {/* Data filled polygon */}
              <polygon
                points={dataPolygon}
                fill={gradient.from}
                fillOpacity={0.18}
                stroke={gradient.from}
                strokeWidth={2.5}
                strokeLinejoin="round"
              />
              {/* Data dots */}
              {radarScores.map((s, i) => {
                const [x, y] = radarPoint(i, s);
                return <circle key={i} cx={x} cy={y} r={6} fill={gradient.from} stroke="#fff" strokeWidth={2.5} />;
              })}
              {/* Labels: category name + score */}
              {RADAR_CATEGORIES.map((cat, i) => {
                const lp = labelPos(i);
                const score = Math.round(radarScores[i] * 100);
                return (
                  <g key={cat}>
                    <text
                      x={lp.x} y={lp.y + lp.dy}
                      textAnchor={lp.anchor}
                      fontSize={22}
                      fill="#374151"
                      fontWeight={600}
                      fontFamily={FONT}
                    >
                      {PSA_LABELS[cat]}
                    </text>
                    <text
                      x={lp.x} y={lp.y + lp.dy + 26}
                      textAnchor={lp.anchor}
                      fontSize={20}
                      fill={gradient.from}
                      fontWeight={700}
                      fontFamily={FONT}
                    >
                      {score}점
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* ── Section 4: 일간 + 오행 분포 ── */}
          <div style={{
            padding: '24px 80px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}>
            {/* 일간 정보 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#1F2937' }}>
                일간: {dayMasterName}
              </div>
              {dayMasterKeywords.length > 0 && (
                <div style={{ fontSize: 22, color: '#6B7280', fontWeight: 500 }}>
                  {dayMasterKeywords.slice(0, 3).join(' · ')}
                </div>
              )}
            </div>

            {/* 구분선 */}
            <div style={{ height: 1, backgroundColor: '#F3F4F6' }} />

            {/* 오행 분포 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontSize: 22, color: '#9CA3AF', fontWeight: 500 }}>
                오행 분포
              </div>
              {/* Stacked bar */}
              <div style={{
                display: 'flex',
                height: 36,
                borderRadius: 18,
                overflow: 'hidden',
              }}>
                {elements.map(el => (
                  <div
                    key={el.key}
                    style={{
                      width: `${el.pct}%`,
                      backgroundColor: el.color,
                      minWidth: el.pct > 0 ? 6 : 0,
                    }}
                  />
                ))}
              </div>
              {/* Legend */}
              <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
                {elements.map(el => (
                  <div key={el.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 14,
                      height: 14,
                      borderRadius: 4,
                      backgroundColor: el.color,
                      flexShrink: 0,
                    }} />
                    <span style={{ fontSize: 20, color: '#6B7280' }}>
                      {el.name} {el.pct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 주요 오행 뱃지 */}
            <div style={{ marginTop: 4 }}>
              <span style={{
                display: 'inline-block',
                padding: '12px 28px',
                borderRadius: 14,
                backgroundColor: `${elementColor}20`,
                fontSize: 22,
                color: elementColor,
                fontWeight: 600,
              }}>
                주요 오행: {ELEMENT_KOREAN[dominantElement] || dominantElement}
              </span>
            </div>
          </div>

          {/* ── Section 5: QR + CTA ── */}
          <div style={{
            padding: '24px 80px 52px',
            display: 'flex',
            alignItems: 'center',
            gap: 28,
            marginTop: 'auto',
          }}>
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="" style={{ width: 140, height: 140, borderRadius: 8 }} />
            ) : (
              <div style={{ width: 140, height: 140, borderRadius: 8, backgroundColor: '#F3F4F6' }} />
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 26, color: '#374151', fontWeight: 600 }}>
                {"토스에서 '사주강점' 검색"}
              </div>
              <div style={{ fontSize: 22, color: '#9CA3AF' }}>
                나도 분석받기 →
              </div>
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

      {/* 토스 WebView 이미지 저장 모달 */}
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
