import { IS_TOSS } from '@/lib/platform';

/** IS_TOSS 분기에 따른 Tailwind 클래스 디자인 상수 */
export const designTokens = {
  // 레이아웃
  pagePadding: 'px-6',
  maxWidth: IS_TOSS ? 'max-w-[375px]' : 'max-w-[480px]',
  pageMinHeight: IS_TOSS ? 'min-h-screen bg-white' : 'min-h-screen bg-background',

  // border-radius
  cardRadius: 'rounded-xl',
  buttonRadius: 'rounded-[14px]',
  inputRadius: 'rounded-[14px]',

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
  textSuccess: 'text-tds-green-500',

  // 랜딩/공통 헤딩
  headingLg: IS_TOSS ? 'text-t3 font-bold text-tds-grey-900' : 'text-3xl font-bold text-foreground',
  headingXl: IS_TOSS ? 'text-t4 font-bold text-tds-grey-900' : 'text-xl font-bold text-foreground',
  subtitleSm: IS_TOSS ? 'text-st8 text-tds-grey-700' : 'text-sm text-muted-foreground',
  textBody: IS_TOSS ? 'text-st8 text-tds-grey-700' : 'text-sm text-muted-foreground',
  stepNumberMuted: IS_TOSS ? 'text-tds-grey-200' : 'text-muted-foreground/20',
  textSubheading: IS_TOSS ? 'text-tds-grey-800' : 'text-foreground/90',

  // 토글/폼 비활성 상태
  toggleInactive: IS_TOSS
    ? 'bg-tds-grey-100 text-tds-grey-500 hover:bg-tds-grey-200'
    : 'bg-secondary text-muted-foreground hover:bg-secondary/80',
  optionBg: IS_TOSS ? 'bg-white' : 'bg-background',
  inputToss: IS_TOSS
    ? 'w-full px-4 py-3 rounded-[14px] border border-tds-grey-200 bg-tds-grey-50 text-tds-grey-900 text-st8 placeholder:text-tds-grey-500 focus:outline-none focus:border-tds-blue-500 focus:ring-1 focus:ring-tds-blue-500'
    : 'bg-secondary border-border text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary',
  selectToss: IS_TOSS
    ? 'w-full px-4 py-3 rounded-[14px] border border-tds-grey-200 bg-tds-grey-50 text-tds-grey-900 text-st8'
    : 'w-full h-10 rounded-md bg-secondary border border-border text-foreground text-sm px-3 focus:outline-none focus:ring-2 focus:ring-primary',
  checkboxUnchecked: IS_TOSS
    ? 'border-tds-grey-300 hover:border-tds-grey-500'
    : 'border-border hover:border-muted-foreground',
  consentBox: IS_TOSS
    ? 'border border-tds-grey-200 bg-tds-grey-50'
    : 'border border-border bg-card',
  formCard: IS_TOSS
    ? 'border border-tds-grey-200 bg-white'
    : 'bg-card border border-border',

  // 서베이 네비게이션
  navPrevButton: IS_TOSS
    ? 'flex items-center gap-1 px-4 py-3 rounded-xl bg-tds-grey-100 text-tds-grey-700 font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-tds-grey-200 transition-colors'
    : 'flex items-center gap-1 px-4 py-3 rounded-xl bg-white/10 text-white font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-colors',
  navSubmitButton: IS_TOSS
    ? 'flex-1 py-3 rounded-xl font-bold text-white transition-all duration-200 bg-tds-blue-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-tds-blue-600 active:scale-[0.98]'
    : 'flex-1 py-3 rounded-[14px] font-bold text-primary-foreground transition-all duration-200 bg-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 active:scale-[0.98]',
  navNextButton: IS_TOSS
    ? 'flex-1 flex items-center justify-center gap-1 py-3 rounded-xl font-bold text-white bg-tds-blue-500 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-tds-blue-600 active:scale-[0.98]'
    : 'flex-1 flex items-center justify-center gap-1 py-3 rounded-[14px] font-bold text-primary-foreground bg-primary transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 active:scale-[0.98]',
  dotActiveCurrent: IS_TOSS ? 'w-6 h-2.5 rounded-full bg-tds-blue-500' : 'w-6 h-2 rounded-full bg-primary',
  progressAccent: IS_TOSS ? 'text-st11 text-tds-blue-500 font-medium' : 'text-xs text-primary font-medium',

  // 서베이 질문 카드
  questionCardText: IS_TOSS
    ? 'font-medium leading-relaxed text-sm text-tds-grey-800'
    : 'text-card-foreground font-medium leading-relaxed text-sm sm:text-base',
  likertSelectedRing: IS_TOSS
    ? 'ring-2 ring-tds-blue-300 scale-110 shadow-md'
    : 'ring-4 ring-primary/30 scale-110 shadow-lg rounded-[14px]',
  likertUnselectedWeb: 'bg-secondary border border-border text-secondary-foreground hover:bg-secondary/80 active:scale-95 rounded-[14px]',

  // 결과 페이지
  resultContainer: IS_TOSS ? 'px-6 py-6' : 'max-w-2xl mx-auto px-4 py-12',
  shareButtonInline: IS_TOSS ? 'bg-tds-blue-500 text-white' : 'bg-primary text-primary-foreground',
  disclaimer: IS_TOSS ? 'text-[11px] text-tds-grey-400' : 'text-[11px] text-muted-foreground/40',

  // 결과 스켈레톤
  skeletonBlock: IS_TOSS ? 'border-tds-grey-200 bg-tds-grey-50' : 'border-border bg-muted',
  skeletonAccent: IS_TOSS ? 'text-tds-blue-500' : 'text-primary',

  // 차트 스타일 (inline style values)
  chartGridStroke: IS_TOSS ? '#e5e8eb' : 'rgba(255,255,255,0.08)',
  chartTickFill: IS_TOSS ? '#6b7684' : 'rgba(255,255,255,0.5)',
  chartLegendColor: IS_TOSS ? '#4e5968' : 'rgba(255,255,255,0.6)',
  tooltipBg: IS_TOSS ? '#fff' : 'hsl(218, 22%, 14%)',
  tooltipBorder: IS_TOSS ? '1px solid #e5e7eb' : '1px solid rgba(255,255,255,0.08)',
  tooltipColor: IS_TOSS ? '#111827' : '#fff',

  // 프라이버시 페이지
  privacyDate: IS_TOSS ? 'text-tds-grey-400' : 'text-muted-foreground/40',
  privacyContact: IS_TOSS ? 'text-tds-grey-500' : 'text-muted-foreground/50',

  // 카드 bg 보조 (IS_TOSS일 때 빈 문자열, 웹일 때 bg-card)
  cardBgFill: IS_TOSS ? '' : 'bg-card',

  // 모션 비활성 (토스에서는 hover 애니메이션 꺼짐)
  hoverScale: IS_TOSS ? undefined : { scale: 1.04 },
  hoverLift: IS_TOSS ? undefined : { y: -4 },

  // 카드 외곽 (사주 카드용)
  cardRadiusOuter: IS_TOSS ? 'rounded-xl' : 'rounded-2xl',
  headerSeparator: IS_TOSS ? '#e5e7eb' : 'rgba(255,255,255,0.08)',
  dividerBg: IS_TOSS ? 'bg-tds-grey-200' : 'bg-border',
  elementBgFallback: IS_TOSS ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.04)',

  // 강조 스타일
  accentText: IS_TOSS ? 'text-tds-blue-500' : 'text-primary',
  accentTextLight: IS_TOSS ? 'text-tds-blue-400' : 'text-primary/70',
  pillarLabelBg: IS_TOSS ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.2)',
  pillarNormalBg: IS_TOSS ? 'bg-white' : 'bg-card',
  highlightBorder: IS_TOSS ? 'border-tds-blue-400' : 'border-primary/60',
  highlightShadow: IS_TOSS
    ? 'shadow-[0_0_16px_rgba(59,130,246,0.20)]'
    : 'shadow-[0_0_24px_rgba(49,130,246,0.25)]',
  highlightGradient: IS_TOSS
    ? 'linear-gradient(160deg, rgba(59,130,246,0.08) 0%, rgba(59,130,246,0.02) 100%)'
    : 'linear-gradient(160deg, rgba(49,130,246,0.12) 0%, rgba(49,130,246,0.04) 100%)',

  // 탭
  tabContainer: IS_TOSS ? 'flex border-b border-tds-grey-200' : 'flex gap-1 bg-white/5 rounded-xl p-1',
  tabItemBase: IS_TOSS
    ? 'flex-1 pb-3 transition-colors border-b-2 font-semibold'
    : 'flex-1 py-2 text-sm rounded-lg transition-all',
  tabItemActive: IS_TOSS ? 'border-tds-grey-800 text-tds-grey-800' : 'bg-white text-slate-900 shadow-sm font-semibold',
  tabItemInactive: IS_TOSS ? 'border-transparent text-tds-grey-600' : 'text-white/50 hover:text-white/80',
  tabSizeLg: IS_TOSS ? 'text-t4 pt-2' : '',
  tabSizeSm: IS_TOSS ? 'text-st12 pt-1' : '',

  // 폼 라벨/헬퍼
  formLabel: IS_TOSS ? 'text-t6 font-semibold text-tds-grey-700 mb-2' : 'text-sm font-medium text-foreground mb-2',
  formHelper: IS_TOSS ? 'text-st11 text-tds-grey-500 mt-1' : 'text-xs text-muted-foreground/50 mt-1',
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
export const tdsElementColors = IS_TOSS ? {
  wood: '#15803d', fire: '#b91c1c', earth: '#a16207', metal: '#52525b', water: '#1d4ed8',
} as const : {
  wood: '#22c55e', fire: '#ef4444', earth: '#eab308', metal: '#a1a1aa', water: '#3b82f6',
} as const;

/** 오행별 Tailwind 클래스 매핑 */
const _elText = IS_TOSS
  ? { wood: 'text-wood-dark', fire: 'text-fire-dark', earth: 'text-earth-dark', metal: 'text-metal-dark', water: 'text-water-dark' }
  : { wood: 'text-wood', fire: 'text-fire', earth: 'text-earth', metal: 'text-metal', water: 'text-water' };
export const elementStyles = {
  wood:  { text: _elText.wood,  bg: 'bg-wood/10',  border: 'border-wood' },
  fire:  { text: _elText.fire,  bg: 'bg-fire/10',  border: 'border-fire' },
  earth: { text: _elText.earth, bg: 'bg-earth/10', border: 'border-earth' },
  metal: { text: _elText.metal, bg: 'bg-metal/10', border: 'border-metal' },
  water: { text: _elText.water, bg: 'bg-water/10', border: 'border-water' },
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

/** 오행별 배경색 — IS_TOSS에 따라 자동 선택 */
export const ELEMENT_BG_ADAPTIVE: Record<string, string> = IS_TOSS ? ELEMENT_BG_TOSS : ELEMENT_BG;

/** 오행 한글 이름 매핑 */
export const ELEMENT_KOREAN: Record<string, string> = {
  wood:  "목",
  fire:  "화",
  earth: "토",
  metal: "금",
  water: "수",
};

export { IS_TOSS };

export const LIKERT_LABELS: Record<number, string> = {
  1: '전혀 아님',
  4: '보통',
  7: '매우 그렇다',
};

