const IS_TOSS = process.env.NEXT_PUBLIC_BUILD_TARGET === 'toss';

/** IS_TOSS 분기에 따른 Tailwind 클래스 디자인 상수 */
export const designTokens = {
  // 레이아웃
  pagePadding: IS_TOSS ? 'px-6' : 'px-6',
  maxWidth: IS_TOSS ? 'max-w-[375px]' : 'max-w-[480px]',
  pageMinHeight: IS_TOSS ? 'min-h-screen bg-white' : 'min-h-screen bg-background',

  // border-radius
  cardRadius: IS_TOSS ? 'rounded-xl' : 'rounded-xl',
  buttonRadius: IS_TOSS ? 'rounded-[14px]' : 'rounded-[14px]',
  inputRadius: IS_TOSS ? 'rounded-[14px]' : 'rounded-[14px]',

  // 배경 스타일
  cardBg: IS_TOSS
    ? 'bg-white border border-tds-grey-200'
    : 'bg-card border border-border',
  cardBgAlt: IS_TOSS
    ? 'bg-tds-grey-50 border border-tds-grey-100'
    : 'bg-secondary border border-border',
  glassBg: IS_TOSS
    ? 'bg-white shadow-sm'
    : 'bg-card border border-border',
  highlightBg: IS_TOSS
    ? 'bg-tds-blue-50 border border-tds-blue-200'
    : 'bg-primary/10 border border-primary/20',

  // 텍스트 컬러
  textPrimary: IS_TOSS ? 'text-tds-grey-900' : 'text-foreground',
  textSecondary: IS_TOSS ? 'text-tds-grey-700' : 'text-muted-foreground',
  textTertiary: IS_TOSS ? 'text-tds-grey-600' : 'text-muted-foreground/70',
  textMuted: IS_TOSS ? 'text-tds-grey-500' : 'text-muted-foreground/50',
  textCaption: IS_TOSS ? 'text-tds-grey-400' : 'text-muted-foreground/40',

  // 인터랙티브
  primaryButton: IS_TOSS
    ? 'bg-tds-blue-500 text-white rounded-[14px]'
    : 'bg-primary text-primary-foreground rounded-[14px]',
  secondaryButton: IS_TOSS
    ? 'bg-tds-grey-100 text-tds-grey-900 rounded-[14px]'
    : 'bg-secondary text-secondary-foreground rounded-[14px]',
  disabledButton: IS_TOSS
    ? 'bg-tds-grey-300 text-white rounded-[14px]'
    : 'bg-muted text-muted-foreground rounded-[14px] opacity-50',

  // 테두리
  borderDefault: IS_TOSS ? 'border-tds-grey-200' : 'border-border',
  borderFocus: IS_TOSS ? 'border-tds-blue-500' : 'border-primary',
  divider: IS_TOSS ? 'border-t border-tds-grey-200' : 'border-t border-border',

  // 뱃지
  badge: IS_TOSS
    ? 'bg-tds-blue-50 text-tds-blue-600 rounded-full px-2.5 py-0.5 text-st11 font-medium'
    : 'bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-0.5 text-st11 font-medium',

  // 에러/성공
  textError: IS_TOSS ? 'text-tds-red-500' : 'text-destructive',
  textSuccess: IS_TOSS ? 'text-tds-green-500' : 'text-tds-green-500',
} as const;

/**
 * 오행 색상 — 라이트 배경 WCAG AA 대비 보정
 *
 * 흰색 배경 대비 비율:
 * - wood:  #15803d → 4.8:1 (AA 통과)
 * - fire:  #b91c1c → 5.9:1 (AA 통과)
 * - earth: #a16207 → 4.6:1 (AA 통과)
 * - metal: #52525b → 7.2:1 (AA 통과)
 * - water: #1d4ed8 → 6.5:1 (AA 통과)
 */
export const tdsElementColors = {
  wood:  IS_TOSS ? '#15803d' : '#22c55e',
  fire:  IS_TOSS ? '#b91c1c' : '#ef4444',
  earth: IS_TOSS ? '#a16207' : '#eab308',
  metal: IS_TOSS ? '#52525b' : '#a1a1aa',
  water: IS_TOSS ? '#1d4ed8' : '#3b82f6',
} as const;

/** 오행별 Tailwind 클래스 매핑 */
export const elementStyles = {
  wood:  { text: IS_TOSS ? 'text-wood-dark' : 'text-wood',  bg: 'bg-wood/10',  border: 'border-wood' },
  fire:  { text: IS_TOSS ? 'text-fire-dark' : 'text-fire',  bg: 'bg-fire/10',  border: 'border-fire' },
  earth: { text: IS_TOSS ? 'text-earth-dark' : 'text-earth', bg: 'bg-earth/10', border: 'border-earth' },
  metal: { text: IS_TOSS ? 'text-metal-dark' : 'text-metal', bg: 'bg-metal/10', border: 'border-metal' },
  water: { text: IS_TOSS ? 'text-water-dark' : 'text-water', bg: 'bg-water/10', border: 'border-water' },
} as const;

/** 오행별 색상 (웹 다크 테마 기준) */
export const ELEMENT_COLORS: Record<string, string> = {
  wood:  "#22c55e",
  fire:  "#ef4444",
  earth: "#eab308",
  metal: "#a1a1aa",
  water: "#3b82f6",
};

/** 오행별 배경색 (투명도 0.08, 웹 다크 테마용) */
export const ELEMENT_BG: Record<string, string> = {
  wood:  "rgba(34,197,94,0.08)",
  fire:  "rgba(239,68,68,0.08)",
  earth: "rgba(234,179,8,0.08)",
  metal: "rgba(161,161,170,0.08)",
  water: "rgba(59,130,246,0.08)",
};

/** 오행별 배경색 (투명도 0.06, 토스 라이트 테마용) */
export const ELEMENT_BG_TOSS: Record<string, string> = {
  wood:  "rgba(34,197,94,0.06)",
  fire:  "rgba(239,68,68,0.06)",
  earth: "rgba(234,179,8,0.06)",
  metal: "rgba(161,161,170,0.06)",
  water: "rgba(59,130,246,0.06)",
};

/** 오행 한글 이름 매핑 */
export const ELEMENT_KOREAN: Record<string, string> = {
  wood:  "목",
  fire:  "화",
  earth: "토",
  metal: "금",
  water: "수",
};

export { IS_TOSS };
