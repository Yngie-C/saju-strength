# 사주강점 디자인 가이드

> 새 페이지 작성 시 즉시 참조하는 실용 가이드. 웹(다크)과 토스(라이트) 양쪽 커버.

---

## 목차

1. [개요](#1-개요)
2. [컬러 시스템](#2-컬러-시스템)
   - 2.1 [TDS 컬러 팔레트 (토스)](#21-tds-컬러-팔레트-토스)
   - 2.2 [시멘틱 컬러 매핑](#22-시멘틱-컬러-매핑-웹-다크--토스-라이트)
   - 2.3 [오행 색상 시스템](#23-오행-색상-시스템)
   - 2.4 [Grey Opacity 토큰 (TDS)](#24-grey-opacity-토큰-tds)
3. [타이포그래피](#3-타이포그래피)
   - 3.1 [폰트](#31-폰트)
   - 3.2 [TDS 타이포 스케일](#32-tds-타이포-스케일)
   - 3.3 [기존 Tailwind ↔ TDS 매핑](#33-기존-tailwind--tds-매핑)
4. [레이아웃](#4-레이아웃)
   - 4.1 [기본 규칙](#41-기본-규칙)
   - 4.2 [BottomCTA 패턴](#42-bottomcta-패턴)
   - 4.3 [반응형 그리드](#43-반응형-그리드)
5. [컴포넌트 스타일 가이드](#5-컴포넌트-스타일-가이드)
   - 5.1 [Button](#51-button)
   - 5.2 [Card / Container](#52-card--container)
   - 5.3 [TextField / Input](#53-textfield--input)
   - 5.4 [Tab](#54-tab)
   - 5.5 [ProgressBar](#55-progressbar)
   - 5.6 [Badge](#56-badge)
   - 5.7 [Checkbox](#57-checkbox)
   - 5.8 [Dialog](#58-dialog)
6. [Per-Page Style Map 패턴](#6-per-page-style-map-패턴-핵심)
7. [애니메이션 가이드](#7-애니메이션-가이드)
8. [UX 라이팅 규칙](#8-ux-라이팅-규칙-토스-가이드)
9. [다크패턴 금지 5가지](#9-다크패턴-금지-5가지-토스-필수)
10. [새 페이지 작성 체크리스트](#10-새-페이지-작성-체크리스트)

---

## 1. 개요

### 이중 배포 전략

| 환경 | 배포 방식 | 테마 | 기준 너비 |
|------|---------|------|---------|
| **웹** | SSR — Vercel | 다크 (딥 네이비 배경) | max-w-2xl (672px) |
| **토스** | Static Export — WebView | 라이트 (흰 배경 + TDS) | 375px 전체 사용 |

### 환경변수 분기

```ts
// 빌드 타임 상수 — 웹팩이 dead-code-eliminate 처리
const IS_TOSS = process.env.NEXT_PUBLIC_BUILD_TARGET === 'toss';
```

- `BUILD_TARGET=toss` → `NEXT_PUBLIC_BUILD_TARGET=toss` (next.config.js에서 자동 주입)
- 토스 빌드: `output: 'export'`, `trailingSlash: true`, `images.unoptimized: true`
- 웹 빌드: `@toss/tds-mobile`, `@toss/tds-mobile-ait` webpack externals 처리 (번들 제외)

### `.tds-theme` CSS 클래스 스코핑 원리

TDS 컴포넌트는 `.tds-theme` 스코프 내에서만 TDS 토큰이 적용됩니다. `TDSProvider`가 루트에서 `TDSMobileAITProvider`를 래핑하여 자동으로 이 스코프를 설정합니다.

```tsx
// app/layout.tsx (토스 빌드)
import { TDSProvider } from '@/components/adaptive/TDSProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <TDSProvider>{children}</TDSProvider>
      </body>
    </html>
  );
}
```

웹 빌드에서 `TDSProvider`는 `<>{children}</>` 그대로 반환하므로 오버헤드 없음.

---

## 2. 컬러 시스템

### 2.1 TDS 컬러 팔레트 (토스)

#### Grey

| 토큰 | 헥스 | Tailwind 클래스 |
|------|-----|---------------|
| grey50 | `#f9fafb` | `text-tds-grey-50` / `bg-tds-grey-50` |
| grey100 | `#f2f4f6` | `text-tds-grey-100` |
| grey200 | `#e5e8eb` | `text-tds-grey-200` |
| grey300 | `#d1d6db` | `text-tds-grey-300` |
| grey400 | `#b0b8c1` | `text-tds-grey-400` |
| grey500 | `#8b95a1` | `text-tds-grey-500` |
| grey600 | `#6b7684` | `text-tds-grey-600` |
| grey700 | `#4e5968` | `text-tds-grey-700` |
| grey750 | `#333d4b` | `text-tds-grey-750` |
| grey800 | `#2d3540` | `text-tds-grey-800` |
| grey900 | `#191f28` | `text-tds-grey-900` |

#### Blue (Primary)

| 토큰 | 헥스 | 비고 |
|------|-----|------|
| blue50 | `#e8f3ff` | 배경 강조 |
| blue100 | `#c9e2ff` | |
| blue200 | `#90c2ff` | |
| blue300 | `#64a8ff` | |
| blue400 | `#4593fc` | ProgressBar fill |
| **blue500** | **`#3182f6`** | **브랜드 대표색, 주 CTA 버튼** |
| blue600 | `#1b64da` | |
| blue700 | `#1957c2` | |
| blue800 | `#1750b0` | |
| blue900 | `#194aa6` | |

#### 상태 색상

| 용도 | 토큰 | 헥스 |
|------|------|------|
| 위험 / 오류 | red500 | `#f04452` |
| 성공 | green500 | `#03b26c` |
| 경고 | orange500 | `#fe9800` |
| 보조 | purple500 | `#a234c7` |

---

### 2.2 시멘틱 컬러 매핑 (웹 다크 ↔ 토스 라이트)

> 개발자가 가장 자주 참조하는 핵심 테이블

| 용도 | CSS 변수 | 웹 (다크) | 토스 (TDS) | Tailwind 클래스 |
|------|---------|-----------|-----------|----------------|
| 페이지 배경 | `--background` | `hsl(222 47% 4%)` ≈ `#060d1f` | `#ffffff` | `bg-background` |
| 카드 배경 | `--card` | `hsl(222 47% 8%)` ≈ `#0d1b38` | `#ffffff` | `bg-card` |
| Primary | `--primary` | `#7C3AED` (보라, hsl 262 83% 58%) | `#3182f6` (blue500) | `bg-primary` / `text-primary` |
| 제목 텍스트 | `--foreground` | `#F8FAFC` | `#191f28` (grey900) | `text-foreground` |
| 서브 텍스트 | 커스텀 | `text-white/70` | `text-tds-grey-700` | — |
| 보조 텍스트 | 커스텀 | `text-white/50` | `text-tds-grey-600` | — |
| placeholder | 커스텀 | `text-white/30` | `text-tds-grey-500` | — |
| 테두리 | `--border` | `border-white/10` | `#e5e8eb` (grey200) | `border-border` |
| 카드 테두리 | 커스텀 | `border-white/10` | `border-tds-grey-200` | — |
| 입력 배경 | 커스텀 | `bg-white/5` | `bg-tds-grey-50` | — |
| 에러 | `--destructive` | `#ef4444` | `#f04452` (red500) | `text-destructive` |
| 성공 | 커스텀 | `#22c55e` | `#03b26c` (green500) | — |
| 글래스 카드 | 커스텀 | `rgba(255,255,255,0.04)` + `backdrop-blur` | 사용 안 함 | — |

---

### 2.3 오행 색상 시스템

> `tailwind.config.ts`의 `wood/fire/earth/metal/water` 토큰을 사용. 절대 인라인 헥스 직접 기입 금지.

| 오행 | 웹 (다크 배경) | 토스 (라이트 배경) | 배경 light | 배경 dark |
|------|--------------|-----------------|-----------|----------|
| 木 Wood | `#22c55e` | `#15803d` | `#bbf7d0` | `#15803d` |
| 火 Fire | `#ef4444` | `#b91c1c` | `#fecaca` | `#b91c1c` |
| 土 Earth | `#eab308` | `#a16207` | `#fef08a` | `#a16207` |
| 金 Metal | `#a1a1aa` | `#52525b` | `#e4e4e7` | `#52525b` |
| 水 Water | `#3b82f6` | `#1d4ed8` | `#bfdbfe` | `#1d4ed8` |

**Tailwind 클래스 사용법:**

```tsx
// tailwind.config.ts에 정의된 토큰 활용
<div className="bg-wood text-wood-dark">木 카드</div>
<div className="bg-fire/20 text-fire">火 배지</div>
<div className="border-water text-water-dark">水 테두리</div>

// 전역 CSS 유틸 클래스 (globals.css)
<span className="element-wood">木</span>      // color: #22c55e
<div className="bg-element-fire">火</div>     // background-color: #ef4444
```

**오행별 조건부 색상 패턴:**

```tsx
const elementColors = {
  wood:  { text: 'text-wood',  bg: 'bg-wood/10',  border: 'border-wood',  darkText: 'text-wood-dark' },
  fire:  { text: 'text-fire',  bg: 'bg-fire/10',  border: 'border-fire',  darkText: 'text-fire-dark' },
  earth: { text: 'text-earth', bg: 'bg-earth/10', border: 'border-earth', darkText: 'text-earth-dark' },
  metal: { text: 'text-metal', bg: 'bg-metal/10', border: 'border-metal', darkText: 'text-metal-dark' },
  water: { text: 'text-water', bg: 'bg-water/10', border: 'border-water', darkText: 'text-water-dark' },
} as const;

// 사용 예
const colors = elementColors[element];
<div className={`${colors.bg} ${colors.border} border rounded-xl p-4`}>
  <span className={IS_TOSS ? colors.darkText : colors.text}>{label}</span>
</div>
```

---

### 2.4 Grey Opacity 토큰 (TDS)

hover, ripple, 오버레이 효과에 사용. 배경이 투명하므로 배경색에 무관하게 사용 가능.

| 토큰 | 값 | 주요 용도 |
|------|---|---------|
| greyOpacity50 | `rgba(0,23,51,0.02)` | 카드 hover 최소 |
| greyOpacity100 | `rgba(0,23,51,0.04)` | 서브 배경 |
| greyOpacity200 | `rgba(0,23,51,0.08)` | 입력 배경 |
| greyOpacity300 | `rgba(0,23,51,0.12)` | 구분선 |
| greyOpacity400 | `rgba(0,23,51,0.16)` | 비활성 버튼 |
| greyOpacity500 | `rgba(0,23,51,0.28)` | 오버레이 |
| greyOpacity600 | `rgba(0,23,51,0.44)` | 딤 처리 |
| greyOpacity700 | `rgba(0,23,51,0.56)` | 모달 배경 |
| greyOpacity800 | `rgba(0,23,51,0.72)` | 강한 오버레이 |
| greyOpacity900 | `rgba(0,23,51,0.88)` | 최대 딤 |

---

## 3. 타이포그래피

### 3.1 폰트

```ts
// tailwind.config.ts
fontFamily: {
  sans: ['var(--font-pretendard)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
}
```

- **Primary**: `PretendardVariable` — WOFF2, weight 100~900 가변 폰트 (`/fonts/PretendardVariable.woff2`)
- **Fallback**: Inter → system-ui → sans-serif
- 토스 환경에서도 Pretendard 사용 (Toss Product Sans는 네이티브 앱 전용)

---

### 3.2 TDS 타이포 스케일

| 토큰 | font-size | line-height | weight | 용도 | Tailwind 클래스 |
|------|-----------|------------|--------|------|---------------|
| t1 | 30px | 40px | bold (700) | 히어로 타이틀 | `text-t1` |
| t2 | 26px | 35px | bold (700) | 페이지 타이틀 | `text-t2` |
| t3 | 22px | 31px | bold (700) | 섹션 타이틀 | `text-t3` |
| t4 | 20px | 29px | bold (700) | 서브 타이틀 | `text-t4` |
| t5 | 17px | 25.5px | semibold (600) | 강조 본문 | `text-t5` |
| t6 | 15px | 22.5px | semibold (600) | 레이블 | `text-t6` |
| t7 | 13px | 19.5px | semibold (600) | 캡션 | `text-t7` |
| st8 | 16px | 24px | regular (400) | 본문 | `text-st8` |
| st9 | 15px | 22.5px | regular (400) | 보조 본문 | `text-st9` |
| st10 | 14px | 21px | regular (400) | 보조 | `text-st10` |
| st11 | 13px | 19.5px | regular (400) | 소형 텍스트 | `text-st11` |
| st12 | 12px | 18px | regular (400) | 캡션 | `text-st12` |
| st13 | 11px | 16.5px | regular (400) | 면책 / 법적 텍스트 | `text-st13` |

> TDS 클래스(`text-t1` 등)는 토스 빌드에서만 유효. 웹 빌드에서는 아래 매핑 참고.

---

### 3.3 기존 Tailwind ↔ TDS 매핑

| 웹 (현재) | TDS (토스) | 비고 |
|-----------|-----------|------|
| `text-5xl` ~ `text-7xl` | `text-t1` (30px) | 히어로는 t1로 통일 |
| `text-3xl` | `text-t2` (26px) | |
| `text-2xl` | `text-t3` (22px) | |
| `text-xl` | `text-t4` (20px) | |
| `text-lg` | `text-t5` (17px) | |
| `text-base` | `text-st8` (16px) | |
| `text-sm` | `text-st9` (15px) | |
| `text-xs` | `text-st11` (13px) | |

**Per-page 스타일 맵에서 사용 예:**

```tsx
// 토스 빌드: TDS 스케일
title: 'text-t3 font-bold text-tds-grey-900',
body:  'text-st8 text-tds-grey-700',
caption: 'text-st11 text-tds-grey-500',

// 웹 빌드: 기존 Tailwind
title: 'text-2xl font-bold text-white',
body:  'text-sm text-white/70',
caption: 'text-xs text-white/40',
```

---

## 4. 레이아웃

### 4.1 기본 규칙

| 항목 | 웹 | 토스 |
|------|---|------|
| 기준 너비 | `max-w-2xl` (672px), 중앙 정렬 | 375px 전체 너비 사용 |
| 좌우 패딩 | `px-4` (16px) | `px-6` (24px) |
| 섹션 간격 | `space-y-12` | `space-y-8` |
| 카드 패딩 | `p-6` ~ `p-8` | `p-4` ~ `p-6` |
| 페이지 최소 높이 | `min-h-screen bg-background` | `min-h-screen bg-white` |
| 페이지 하단 여백 | `pb-8` | `pb-[calc(80px+env(safe-area-inset-bottom))]` |

---

### 4.2 BottomCTA 패턴

토스 빌드에서 CTA 버튼은 반드시 화면 하단에 고정. `AdaptiveBottomCTA` 컴포넌트 사용.

```tsx
import { AdaptiveBottomCTA } from '@/components/adaptive/AdaptiveBottomCTA';

// 기본 사용
<AdaptiveBottomCTA onClick={handleNext} disabled={!isReady}>
  다음으로
</AdaptiveBottomCTA>

// topAccessory 포함
<AdaptiveBottomCTA
  onClick={handleSubmit}
  disabled={isLoading}
  topAccessory={
    <p className="text-xs text-center text-tds-grey-500">
      분석에는 약 1초가 걸려요
    </p>
  }
>
  분석 시작하기
</AdaptiveBottomCTA>
```

**웹 폴백 (TDS 미사용 시):**

```tsx
// 토스 빌드 + TDS 미사용 시 자동 폴백
<div className="fixed bottom-0 left-0 right-0 bg-white safe-area-pb">
  <div className="px-4 py-3">
    <button className="w-full py-4 rounded-2xl font-bold text-white text-base bg-blue-500">
      다음으로
    </button>
  </div>
</div>

// 웹 빌드 렌더링
<div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-white/10 px-4 py-4">
  <div className="max-w-2xl mx-auto">
    <button className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600">
      다음으로
    </button>
  </div>
</div>
```

**safe-area 대응 (토스 필수):**

```css
/* globals.css 또는 인라인 style */
padding-bottom: calc(16px + env(safe-area-inset-bottom));
```

---

### 4.3 반응형 그리드

```tsx
// 오행 카드 2열 그리드
<div className="grid grid-cols-2 gap-3">
  {elements.map(el => <ElementCard key={el} element={el} />)}
</div>

// 결과 통계 3열 그리드
<div className="grid grid-cols-3 gap-2">
  {stats.map(stat => <StatBox key={stat.label} {...stat} />)}
</div>

// 반응형 (웹에서만 의미 있음 — 토스는 375px 고정)
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

---

## 5. 컴포넌트 스타일 가이드

### 5.1 Button

**사용 원칙:** 항상 `AdaptiveButton` 사용. 직접 `<button>` 태그 작성 금지(BottomCTA 제외).

```tsx
import { AdaptiveButton } from '@/components/adaptive/AdaptiveButton';

// 주 CTA (파란 단색 / 보라 그라디언트)
<AdaptiveButton variant="primary" size="lg" onClick={handleNext}>
  다음으로
</AdaptiveButton>

// 보조 액션
<AdaptiveButton variant="secondary" size="md" onClick={handleBack}>
  이전
</AdaptiveButton>

// 고스트 (텍스트만)
<AdaptiveButton variant="ghost" size="sm" onClick={handleSkip}>
  건너뛰기
</AdaptiveButton>
```

**렌더링 결과:**

| variant | 웹 (shadcn) | 토스 (TDS) |
|---------|------------|-----------|
| primary | `bg-primary` 보라 버튼 | `bg-blue500` (#3182f6), `rounded-[14px]` |
| secondary | `border` outline 버튼 | `bg-grey100` weak 스타일 |
| ghost | 투명 배경 텍스트 | ghost 스타일 |

---

### 5.2 Card / Container

```tsx
const IS_TOSS = process.env.NEXT_PUBLIC_BUILD_TARGET === 'toss';

// 기본 카드
const cardClass = IS_TOSS
  ? 'bg-white border border-tds-grey-200 rounded-xl p-6'
  : 'bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl p-6';

<div className={cardClass}>
  {children}
</div>

// 강조 카드 (하이라이트 섹션)
const highlightCard = IS_TOSS
  ? 'bg-tds-blue-50 border border-tds-blue-200 rounded-xl p-5'
  : 'bg-primary/10 border border-primary/20 rounded-2xl p-5';

// 오행 카드 (동적 색상)
<div
  className={IS_TOSS
    ? `border rounded-xl p-4`
    : `border rounded-2xl p-4 backdrop-blur-sm`}
  style={{
    backgroundColor: IS_TOSS ? elementLight : `${elementDark}1A`,
    borderColor: IS_TOSS ? elementDark : `${elementColor}33`,
  }}
>
  {children}
</div>
```

---

### 5.3 TextField / Input

**사용 원칙:** 항상 `AdaptiveTextField` 사용.

```tsx
import { AdaptiveTextField } from '@/components/adaptive/AdaptiveTextField';

const [name, setName] = useState('');

<AdaptiveTextField
  label="이름"
  value={name}
  onChange={setName}
  placeholder="홍길동"
  type="text"
/>
```

**렌더링 결과:**

| 환경 | 배경 | 테두리 | 텍스트 | border-radius |
|------|------|--------|--------|--------------|
| 웹 | `bg-white/5` | `border-white/15` | `text-white`, `placeholder:text-white/30` | `rounded-xl` |
| 토스 TDS | `bg-tds-grey-50` | TDS 기본 | `text-grey-900`, caret blue500 | `14px` |
| 토스 폴백 | `bg-white` | `border-gray-200` | `text-gray-900` | `rounded-xl` |

---

### 5.4 Tab

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const IS_TOSS = process.env.NEXT_PUBLIC_BUILD_TARGET === 'toss';

// 토스: underline 스타일 탭
const tabListClass = IS_TOSS
  ? 'flex border-b border-tds-grey-200 w-full'
  : 'flex gap-1 bg-white/5 rounded-xl p-1';

const tabTriggerClass = (isActive: boolean) => IS_TOSS
  ? `flex-1 py-3 text-t6 font-semibold border-b-2 transition-colors ${
      isActive
        ? 'border-tds-blue-500 text-tds-grey-800'
        : 'border-transparent text-tds-grey-600'
    }`
  : `flex-1 py-2 text-sm rounded-lg transition-all ${
      isActive
        ? 'bg-white text-slate-900 shadow-sm font-semibold'
        : 'text-white/50 hover:text-white/80'
    }`;

<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList className={tabListClass}>
    {tabs.map(tab => (
      <TabsTrigger
        key={tab.value}
        value={tab.value}
        className={tabTriggerClass(activeTab === tab.value)}
      >
        {tab.label}
      </TabsTrigger>
    ))}
  </TabsList>
  {tabs.map(tab => (
    <TabsContent key={tab.value} value={tab.value}>
      {tab.content}
    </TabsContent>
  ))}
</Tabs>
```

---

### 5.5 ProgressBar

**사용 원칙:** 항상 `AdaptiveProgressBar` 사용.

```tsx
import { AdaptiveProgressBar } from '@/components/adaptive/AdaptiveProgressBar';

// 기본
<AdaptiveProgressBar progress={progress} />

// 마일스톤 메시지 포함
<AdaptiveProgressBar
  progress={progress}
  milestoneMessage={progress >= 50 ? '절반을 넘어섰어요!' : undefined}
/>
```

**렌더링 결과:**

| 환경 | track | fill | 애니메이션 |
|------|-------|------|---------|
| 웹 | `bg-slate-700` | `from-indigo-600 to-purple-600` 그라디언트 | Framer Motion |
| 토스 TDS | TDS 기본 (`grey200`) | `blue400` (#4593fc) | CSS transition |
| 토스 폴백 | `bg-gray-100` | `bg-blue-500` | CSS transition |

---

### 5.6 Badge

```tsx
const IS_TOSS = process.env.NEXT_PUBLIC_BUILD_TARGET === 'toss';

// 상태 배지
type BadgeVariant = 'blue' | 'teal' | 'green' | 'red' | 'yellow' | 'purple';

const badgeStyles: Record<BadgeVariant, { fill: string; weak: string }> = {
  blue:   { fill: 'bg-tds-blue-500 text-white',   weak: 'bg-tds-blue-50 text-tds-blue-600' },
  green:  { fill: 'bg-green-500 text-white',       weak: 'bg-green-50 text-green-700' },
  red:    { fill: 'bg-red-500 text-white',          weak: 'bg-red-50 text-red-700' },
  yellow: { fill: 'bg-yellow-400 text-gray-900',   weak: 'bg-yellow-50 text-yellow-700' },
  teal:   { fill: 'bg-teal-500 text-white',         weak: 'bg-teal-50 text-teal-700' },
  purple: { fill: 'bg-purple-500 text-white',       weak: 'bg-purple-50 text-purple-700' },
};

function Badge({
  label,
  variant = 'blue',
  type = 'weak',
}: {
  label: string;
  variant?: BadgeVariant;
  type?: 'fill' | 'weak';
}) {
  const webClass = 'bg-white/10 text-white/80 border border-white/20';
  const tossClass = badgeStyles[variant][type];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      IS_TOSS ? tossClass : webClass
    }`}>
      {label}
    </span>
  );
}
```

---

### 5.7 Checkbox

**사용 원칙:** 항상 `AdaptiveCheckbox` 사용.

```tsx
import { AdaptiveCheckbox } from '@/components/adaptive/AdaptiveCheckbox';

const [agreed, setAgreed] = useState(false);

<AdaptiveCheckbox
  checked={agreed}
  onChange={setAgreed}
  label="개인정보 수집 및 이용에 동의합니다."
  description="수집 항목: 생년월일시, 성별 · 보유 기간: 서비스 탈퇴 시까지"
/>
```

**렌더링 결과:**

| 환경 | 체크박스 | 레이블 색상 |
|------|---------|-----------|
| 웹 | `border-white/30`, 체크 시 `bg-primary border-primary` | `text-white` |
| 토스 TDS | TDS Checkbox 컴포넌트 네이티브 | TDS 기본 |
| 토스 폴백 | `accent-blue-500` native checkbox | `text-gray-900` |

---

### 5.8 Dialog

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const IS_TOSS = process.env.NEXT_PUBLIC_BUILD_TARGET === 'toss';

// 토스: 바텀시트 스타일 Dialog
const dialogContentClass = IS_TOSS
  ? 'fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 pb-[calc(24px+env(safe-area-inset-bottom))]'
  : 'bg-card border border-white/10 rounded-2xl p-6 max-w-sm mx-auto';

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className={dialogContentClass}>
    <DialogHeader>
      <DialogTitle className={IS_TOSS ? 'text-t4 font-bold text-tds-grey-900' : 'text-xl font-bold text-white'}>
        분석을 시작할까요?
      </DialogTitle>
      <DialogDescription className={IS_TOSS ? 'text-t6 text-tds-grey-600' : 'text-sm text-white/60'}>
        입력하신 정보로 사주강점을 분석해요.
      </DialogDescription>
    </DialogHeader>

    <div className="flex gap-3 mt-6">
      <AdaptiveButton variant="secondary" onClick={() => setOpen(false)} className="flex-1">
        취소
      </AdaptiveButton>
      <AdaptiveButton variant="primary" onClick={handleConfirm} className="flex-1">
        시작하기
      </AdaptiveButton>
    </div>
  </DialogContent>
</Dialog>
```

**TDS Dialog 스펙:**

| 요소 | 스펙 |
|------|------|
| 제목 | `text-t4` (20px), bold |
| 설명 | `text-t6` (15px), regular |
| 주 버튼 | blue500 fill |
| 보조 버튼 | grey100 weak |
| 배경 딤 | `rgba(0,23,51,0.56)` (greyOpacity600) |

---

## 6. Per-Page Style Map 패턴 (핵심!)

> 새 페이지 작성 시 반드시 이 패턴을 따를 것. 인라인 `IS_TOSS ? ... : ...` 삼항 연산자 남발 금지.

```tsx
'use client';

const IS_TOSS = process.env.NEXT_PUBLIC_BUILD_TARGET === 'toss';

// 파일 상단, 컴포넌트 바깥에 선언 (빌드 타임 상수)
const styles = IS_TOSS ? {
  page:      'min-h-screen bg-white',
  container: 'px-6 py-8 space-y-8',
  title:     'text-t3 font-bold text-tds-grey-900',
  subtitle:  'text-st8 text-tds-grey-700',
  caption:   'text-st11 text-tds-grey-500',
  card:      'bg-white border border-tds-grey-200 rounded-xl p-6',
  cardAlt:   'bg-tds-grey-50 border border-tds-grey-100 rounded-xl p-4',
  button:    'bg-tds-blue-500 text-white rounded-[14px] w-full py-4 font-semibold text-t5',
  divider:   'border-t border-tds-grey-200',
  label:     'text-t6 font-semibold text-tds-grey-700',
  badge:     'bg-tds-blue-50 text-tds-blue-600 rounded-full px-2.5 py-0.5 text-st11 font-medium',
  error:     'text-st9 text-red-500',
} : {
  page:      'min-h-screen bg-background',
  container: 'px-4 py-12 max-w-2xl mx-auto space-y-12',
  title:     'text-2xl font-bold text-white',
  subtitle:  'text-sm text-white/70',
  caption:   'text-xs text-white/40',
  card:      'bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl p-6',
  cardAlt:   'bg-white/[0.02] border border-white/5 rounded-xl p-4',
  button:    'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl w-full py-3.5 font-bold',
  divider:   'border-t border-white/10',
  label:     'text-sm font-medium text-white/70',
  badge:     'bg-white/10 text-white/80 border border-white/20 rounded-full px-2.5 py-0.5 text-xs',
  error:     'text-sm text-red-400',
};

export default function MyPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>제목</h1>
        <p className={styles.subtitle}>부제목</p>

        <div className={styles.card}>
          <p className={styles.label}>레이블</p>
          <hr className={styles.divider} />
          <p className={styles.caption}>보조 설명</p>
        </div>

        {/* 토스: BottomCTA, 웹: 인라인 버튼 */}
        {IS_TOSS ? (
          <AdaptiveBottomCTA onClick={handleNext}>다음으로</AdaptiveBottomCTA>
        ) : (
          <button className={styles.button} onClick={handleNext}>다음으로</button>
        )}
      </div>
    </main>
  );
}
```

**스타일 맵 확장 패턴 (동적 값이 필요한 경우):**

```tsx
// 오행별 동적 컬러는 함수로 처리
function getElementCardStyle(element: string) {
  const colorMap = {
    wood:  { bg: IS_TOSS ? '#bbf7d0' : '#22c55e1A', border: IS_TOSS ? '#15803d' : '#22c55e33' },
    fire:  { bg: IS_TOSS ? '#fecaca' : '#ef44441A', border: IS_TOSS ? '#b91c1c' : '#ef444433' },
    earth: { bg: IS_TOSS ? '#fef08a' : '#eab3081A', border: IS_TOSS ? '#a16207' : '#eab30833' },
    metal: { bg: IS_TOSS ? '#e4e4e7' : '#a1a1aa1A', border: IS_TOSS ? '#52525b' : '#a1a1aa33' },
    water: { bg: IS_TOSS ? '#bfdbfe' : '#3b82f61A', border: IS_TOSS ? '#1d4ed8' : '#3b82f633' },
  };
  return colorMap[element] ?? colorMap.water;
}
```

---

## 7. 애니메이션 가이드

### 기본 원칙

| 환경 | 애니메이션 수위 | 이유 |
|------|-------------|------|
| 웹 | 풍부하게 사용 | 몰입감 강조 |
| 토스 | 간소화 | 모바일 성능 + 토스 UX 가이드 |

### 패턴별 가이드

| 항목 | 웹 | 토스 |
|------|---|------|
| 페이지 진입 | `fadeUp` (y: 20→0, opacity: 0→1, 0.5s) | `fadeIn` (opacity: 0→1, 0.3s) |
| 섹션 스크롤 진입 | `whileInView` + stagger (0.1s 간격) | `whileInView` 간소화 (stagger 제거) |
| 버튼 호버 | `whileHover: { scale: 1.04 }` | 제거 (모바일 hover 없음) |
| 버튼 탭 | `whileTap: { scale: 0.97 }` | 유지 |
| 페이지 전환 | `AnimatePresence` + slide | 유지 (방향만 간소화) |
| 배경 글로우 | `blur-3xl`, 색상 glow | 제거 |
| 카운터 애니메이션 | useSpring 숫자 카운트업 | 제거 또는 즉시 표시 |

### 조건부 variants 예시

```tsx
import { motion } from 'framer-motion';

const IS_TOSS = process.env.NEXT_PUBLIC_BUILD_TARGET === 'toss';

// 페이지 진입 variant
const pageVariants = {
  hidden: { opacity: 0, y: IS_TOSS ? 0 : 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: IS_TOSS ? 0.3 : 0.5,
      ease: 'easeOut',
    },
  },
};

// 섹션 stagger container
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: IS_TOSS ? 0 : 0.1,
    },
  },
};

// 카드 진입
const cardVariants = {
  hidden: { opacity: 0, y: IS_TOSS ? 4 : 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// 사용
<motion.div
  variants={pageVariants}
  initial="hidden"
  animate="visible"
>
  <motion.div variants={containerVariants} initial="hidden" animate="visible">
    {items.map(item => (
      <motion.div key={item.id} variants={cardVariants}>
        <Card {...item} />
      </motion.div>
    ))}
  </motion.div>
</motion.div>
```

### 배경 글로우 (웹 전용)

```tsx
// 웹 빌드에서만 렌더링
{!IS_TOSS && (
  <>
    <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
    <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
  </>
)}
```

---

## 8. UX 라이팅 규칙 (토스 가이드)

토스 환경에서는 토스의 UX 라이팅 가이드를 따름. 웹 환경에서도 가급적 동일 기준 적용.

### 기본 원칙

| 규칙 | 틀린 예 | 올바른 예 |
|------|--------|---------|
| 해요체 통일 | "분석합니다" / "분석해" | "분석해요" |
| 능동형 선호 | "분석이 완료됐어요" | "분석을 완료했어요" |
| 축약형 선호 | "되어요", "하여" | "돼요", "해" |
| 높임말 제거 | "입력하시겠어요?" | "입력할 거예요?" |
| 명확한 CTA | "확인", "네" | "분석 시작하기", "결과 보기" |
| 오류 메시지 | "오류가 발생했습니다" | "잠시 문제가 생겼어요. 다시 시도해줘요" |

### CTA 라벨 예시

| 상황 | 좋은 예 | 피해야 할 예 |
|------|--------|------------|
| 다음 단계 진행 | "다음으로", "결과 보기" | "확인", "진행" |
| 제출 | "분석 시작하기", "저장하기" | "확인", "제출" |
| 취소 | "닫기", "나중에" | "취소", "아니요" |
| 에러 재시도 | "다시 시도하기" | "재시도", "OK" |

### 숫자/단위 표기

```
// 올바른 표기
"60개 문항"  →  "60문항"
"1 초"       →  "1초"
"약 5분"     →  "5분 정도"
```

---

## 9. 다크패턴 금지 5가지 (토스 필수)

토스 앱인토스 심사 필수 통과 조건. 위반 시 심사 반려.

| # | 금지 항목 | 설명 | 대안 |
|---|---------|------|------|
| 1 | 즉시 바텀시트 차단 | 페이지 진입 즉시 동의 요구 바텀시트 | 자연스러운 플로우 내 동의 절차 |
| 2 | 뒤로가기 가로채기 | `history.pushState` 조작으로 뒤로가기 막기 | 표준 네비게이션 허용 |
| 3 | 이탈 불가 구조 | 닫기/취소 버튼 숨김 또는 없음 | 항상 명시적 이탈 경로 제공 |
| 4 | 예고 없는 광고 | 콘텐츠로 위장한 광고, 팝업 | 광고 여부 명시 |
| 5 | 모호한 CTA 라벨 | "확인"으로 유료 구독 동의 | 결과를 명시하는 라벨 사용 |

**구체적 구현 체크:**

```tsx
// 금지: 진입 즉시 바텀시트
useEffect(() => {
  setShowConsentSheet(true); // 절대 금지
}, []);

// 허용: 사용자 액션 후 바텀시트
<button onClick={() => setShowConsentSheet(true)}>
  개인정보 처리방침 보기
</button>

// 금지: 뒤로가기 가로채기
window.history.pushState(null, '', window.location.href); // 절대 금지

// 금지: 닫기 버튼 없는 Dialog
<Dialog> {/* closeButton={false} 금지 */}

// 허용: 항상 닫기 수단 제공
<Dialog onOpenChange={setOpen}>
  <DialogContent>
    <button onClick={() => setOpen(false)}>닫기</button>
  </DialogContent>
</Dialog>
```

---

## 10. 새 페이지 작성 체크리스트

새 페이지(`app/[route]/page.tsx`)를 작성할 때 아래 항목을 순서대로 확인.

### 구조

- [ ] 파일 상단에 `const IS_TOSS = process.env.NEXT_PUBLIC_BUILD_TARGET === 'toss'` 선언
- [ ] Per-page `styles` 객체 정의 (웹/토스 양쪽)
- [ ] JSX에서 `styles.*` 클래스 참조 (인라인 삼항 연산자 최소화)

### 타이포그래피

- [ ] 토스: TDS 타이포 스케일 사용 (`text-t3`, `text-st8` 등)
- [ ] 웹: 기존 Tailwind 스케일 유지 (`text-2xl`, `text-sm` 등)

### 레이아웃

- [ ] 토스: `px-6` (24px) 좌우 패딩
- [ ] 토스: `BottomCTA` 패턴 적용 (CTA 버튼이 있을 경우)
- [ ] 토스: `pb-[calc(Xpx+env(safe-area-inset-bottom))]` 하단 여백

### 컴포넌트

- [ ] Button → `AdaptiveButton` 사용
- [ ] Input → `AdaptiveTextField` 사용
- [ ] Checkbox → `AdaptiveCheckbox` 사용
- [ ] ProgressBar → `AdaptiveProgressBar` 사용
- [ ] 하단 CTA → `AdaptiveBottomCTA` 사용

### 컬러

- [ ] 오행 색상 → `tailwind.config.ts` 토큰 사용 (`bg-wood`, `text-fire-dark` 등)
- [ ] `lib/theme/category-colors.ts`의 `CategoryColorTheme` / `getCategoryTheme()` 활용
- [ ] 인라인 `style={{ color: '#22c55e' }}` 직접 기입 금지 (동적 o행 카드 제외)

### 품질

- [ ] 인라인 `style={{}}` 최소화 (동적 색상 등 불가피한 경우만 허용)
- [ ] 다크패턴 금지 5가지 준수
- [ ] WCAG AA 대비 확인 (토스 라이트 배경: 흰 배경 위 텍스트 4.5:1 이상)
- [ ] 웹 빌드 회귀 확인 (`BUILD_TARGET` 미설정 상태에서 정상 렌더링)
- [ ] `apiUrl()` 함수 사용 (`lib/config.ts`) — 하드코딩 URL 금지

### 애니메이션

- [ ] 토스: 과도한 애니메이션 제거 (글로우, stagger, hover scale 등)
- [ ] 토스: 페이지 진입 애니메이션 0.3s 이하
- [ ] `whileTap: { scale: 0.97 }` 유지 (양쪽 공통)

---

*최종 수정: 2026-02-24*
