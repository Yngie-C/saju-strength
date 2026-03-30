# Result Page Readability Improvement Plan

**Created:** 2026-03-30
**Scope:** 토스 빌드(IS_TOSS) 결과 페이지 타이포그래피 계층 통일 + 교차분석 중복 제거
**Complexity:** MEDIUM
**Estimated Files:** 8 files

---

## RALPLAN-DR Summary

### Principles (4)

1. **TDS-First Design**: 모든 토스 빌드 텍스트 크기·색상은 TDS 스케일/팔레트 값만 사용 (text-lg, #fe9800 같은 비TDS 값 제거)
2. **3-Tier Hierarchy**: 섹션 제목(t3/22px) > 카드 제목(t5/17px) > 본문(st8/16px) 최소 3단계 시각 계층. t4(20px)는 t3(22px)과 2px 차이로 375px에서 구분 불충분하여 스킵.
3. **Web-Safe Refactoring**: 토스 분기(IS_TOSS)만 수정, 웹 분기는 그대로 유지하여 빌드 깨짐 방지
4. **Information Density**: 중복 정보 제거로 스크롤 감소, 한 화면에 더 많은 의미 전달

### Decision Drivers (Top 3)

1. **가독성 최우선**: 현재 cardTitle(14px)과 bodyText(14px)가 동일 크기로 시각 계층 부재
2. **토스 빌드 우선**: 375px WebView 환경에서의 최적화가 주 목표
3. **최소 변경 원칙**: section-styles.ts 토큰 값만 바꾸면 4개 섹션에 자동 전파

### Viable Options

#### Option A: section-styles.ts 토큰 일괄 변경 (CHOSEN)

- **방법**: `section-styles.ts`의 토스 분기 토큰 값만 수정하여 4개 섹션에 일괄 적용
- **Pros**: 변경점 집중 (1파일 토큰 + 1파일 교차분석 + 1파일 레이더), 회귀 위험 낮음
- **Cons**: 섹션별 세밀한 차이 적용 어려움 (but 통일이 목표이므로 문제 아님)

#### Option B: 각 섹션 컴포넌트에서 개별 오버라이드

- **방법**: 각 섹션 TSX 파일에서 styles 토큰을 인라인으로 덮어쓰기
- **Pros**: 섹션별 독립 제어 가능
- **Cons**: 토큰 시스템 우회, 일관성 깨짐, 변경점 산재 (4+ 파일), 유지보수 어려움
- **Invalidation**: 이번 작업의 핵심 목표가 "통일"이므로 토큰 시스템을 우회하는 것은 목적과 모순

---

## Context

### 현재 문제

| 요소 | 현재 값 (토스) | 문제 |
|------|---------------|------|
| sectionTitle | text-t3 (22px) | OK |
| sectionSubtitle | text-lg (18px) | 비TDS 값 |
| cardTitle | text-sm (14px) | 본문과 동일 크기 — 계층 부재 |
| bodyText/descriptions | text-sm (14px) | cardTitle과 구분 불가 |
| 교차분석 매트릭스+인사이트 | 2개 섹션 | 동일 분류(type) 정보 중복 표시 |
| DualRadar 색상 | #3182f6 vs #06b6d4 | 파란 계열끼리 대비 약함 |

### 목표 타이포 계층 (토스 빌드)

| 역할 | 토큰 | 크기 | 비고 |
|------|------|------|------|
| 섹션 제목 | text-t3 | 22px bold | 유지 |
| 섹션 부제 | text-st8 | 16px normal | text-lg(18px) → TDS 값으로 교체 |
| 카드/서브섹션 제목 | text-t5 | 17px semibold | text-sm(14px) → 승격 |
| 본문 | text-st8 | 16px normal | text-sm(14px) → 승격 |
| 보조/캡션 | text-st10 | 14px normal | 기존 text-sm 유지 (캡션 역할) |
| 소캡션 | text-st11 | 13px normal | 기존 text-xs 유지 |

---

## Work Objectives

1. 4개 결과 섹션의 토스 빌드 타이포그래피를 TDS 스케일 3단계 이상으로 통일
2. 교차분석 섹션의 2x2 매트릭스와 축별 인사이트 카드를 하나의 통합 리스트로 병합
3. DualRadarChart 두 레이더의 색상 대비를 강화

---

## Guardrails

### Must Have
- tsc 0 에러
- 기존 테스트 전부 통과
- `npm run build` + `npm run build:toss` 성공
- 토스 분기 토큰이 모두 TDS 스케일 값 (text-lg, text-sm 같은 비TDS 값 제거)
- 웹 분기 코드 무변경

### Must NOT Have
- 섹션 순서 변경 (사주 → PSA → 교차 → 성장가이드)
- useResultData 훅 변경
- 새 기능 추가
- app/p/[slug] 수정
- 웹 전용 스타일 변경

---

## Task Flow

```
Phase 1 (토큰 통일) → Phase 2 (교차분석 통합) → Phase 3 (검증)
     ↓                      ↓
 section-styles.ts     CrossAnalysisSection.tsx
 design-tokens.ts      DualRadarChart.tsx
```

**Phase 1 → Phase 2는 하드 의존성.** Phase 2의 교차분석 대체 마크업이 Phase 1에서 정의된 새 토큰 값(t5, st8)을 사용하므로, 반드시 Phase 1 완료 후 Phase 2 진행.

---

## Phase 1: 타이포그래피 & 여백 토큰 통일

### Task 1.1: section-styles.ts 토스 분기 토큰 변경 [S]

**파일:** `lib/section-styles.ts`

**변경 사항 (토스 분기만):**

4개 섹션 스타일 공통 변경:

| 토큰 키 | 현재 값 | 변경 값 | 이유 |
|---------|---------|---------|------|
| `sectionSubtitle` | `text-lg` (18px) | `text-st8` (16px) | 비TDS → TDS 스케일 |
| `cardTitle` | `text-sm` (14px) | `text-t5` (17px) | 본문과 분리, 카드 제목 역할 부여 |
| `dayMasterCardTitle` | `text-sm` (14px) | `text-t5` (17px) | cardTitle과 동일 |
| `bodyText` / `dayMasterDesc` / `summaryText` / `strengthsSummary` / `insightText` / `practiceText` / `tipText` / `brandingText` / `pitchText` | `text-sm` (14px) | `text-st8` (16px) | 본문 승격 |
| `insightTitle` | `text-sm` (14px) | `text-t5` (17px) | 카드 제목 역할 |
| `focusArea` | `text-sm` (14px) | `text-st8 font-semibold` (16px) | 본문 승격 + bold 유지 |
| `focusAdvice` | `text-sm` (14px) | `text-st8` (16px) | 본문 승격 |
| `sectionDesc` | `text-sm` (14px) | `text-st8` (16px) | 본문 승격 |

유지 (변경 없음):
- `sectionLabel`: text-xs — 소캡션 역할 OK
- `sectionTitle`: text-t3 — 섹션 제목 역할 OK
- `matrixDesc`: text-[11px] — 매트릭스 캡션 (Phase 2에서 통합 시 제거될 수 있음)
- `matrixItem`, `matrixEmpty`: text-xs — 보조 텍스트 OK
- `scoreLabel`: text-sm — 스코어바 라벨, 좁은 공간이라 유지

**세부 적용 (섹션별):**

**sajuProfileStyles (토스):**
```
sectionSubtitle: 'text-tds-grey-400 font-normal text-lg'
  → 'text-tds-grey-400 font-normal text-st8'

cardTitle: 'text-sm font-semibold text-tds-grey-500 mb-4'
  → 'text-t5 font-semibold text-tds-grey-500 mb-4'

dayMasterCardTitle: 'text-sm font-semibold text-tds-grey-500'
  → 'text-t5 font-semibold text-tds-grey-500'

dayMasterDesc: 'text-sm text-tds-grey-600 leading-relaxed'
  → 'text-st8 text-tds-grey-600 leading-relaxed'
```

**crossAnalysisStyles (토스):**
```
sectionSubtitle: 'text-tds-grey-400 font-normal text-lg'
  → 'text-tds-grey-400 font-normal text-st8'

cardTitle: 'text-sm font-semibold text-tds-grey-500 mb-4'
  → 'text-t5 font-semibold text-tds-grey-500 mb-4'

sectionDesc: 'text-sm text-tds-grey-500'
  → 'text-st8 text-tds-grey-500'

insightTitle: 'text-sm font-semibold text-tds-grey-500'
  → 'text-t5 font-semibold text-tds-grey-500'

insightText: 'text-sm text-tds-grey-600 leading-relaxed pl-5'
  → 'text-st8 text-tds-grey-600 leading-relaxed pl-5'
```

**psaProfileStyles (토스):**
```
sectionSubtitle: 'text-tds-grey-400 font-normal text-lg'
  → 'text-tds-grey-400 font-normal text-st8'

cardTitle: 'text-sm font-semibold text-tds-grey-500 mb-2'
  → 'text-t5 font-semibold text-tds-grey-500 mb-2'

personaCardTitle: 'text-sm font-semibold text-tds-grey-500'
  → 'text-t5 font-semibold text-tds-grey-500'

personaTagline: 'text-sm text-tds-grey-500 mt-1 italic'
  → 'text-st8 text-tds-grey-500 mt-1 italic'

strengthsSummary: 'text-sm text-tds-grey-600 leading-relaxed'
  → 'text-st8 text-tds-grey-600 leading-relaxed'

scoreLabel: 'text-sm text-tds-grey-600 w-20 flex-shrink-0'
  → 'text-st10 text-tds-grey-600 w-20 flex-shrink-0' (동일 14px, TDS 값으로 교체)

scoreCardTitle: 'text-sm font-semibold text-tds-grey-500'
  → 'text-t5 font-semibold text-tds-grey-500' (카드 제목 역할 — Architect 리뷰에서 추가)
```

**growthGuideStyles (토스):**
```
summaryText: 'text-sm text-tds-grey-600 leading-relaxed'
  → 'text-st8 text-tds-grey-600 leading-relaxed'

focusArea: 'text-sm font-semibold text-tds-grey-800'
  → 'text-st8 font-semibold text-tds-grey-800'

focusAdvice: 'text-sm text-tds-grey-500 leading-relaxed pl-8'
  → 'text-st8 text-tds-grey-500 leading-relaxed pl-8'

practiceText: 'text-sm text-tds-grey-600 leading-relaxed'
  → 'text-st8 text-tds-grey-600 leading-relaxed'

tipText: 'text-sm text-tds-grey-500 leading-relaxed'
  → 'text-st8 text-tds-grey-500 leading-relaxed'

brandingText: 'text-sm text-tds-grey-700 leading-relaxed'
  → 'text-st8 text-tds-grey-700 leading-relaxed'

pitchText: 'text-sm text-tds-grey-700 leading-relaxed'
  → 'text-st8 text-tds-grey-700 leading-relaxed'

summaryTitle: 'text-sm font-semibold text-tds-green-600 mb-3'
  → 'text-t5 font-semibold text-tds-green-600 mb-3'

focusTitle: 'text-sm font-semibold text-tds-grey-500'
  → 'text-t5 font-semibold text-tds-grey-500'

practiceTitle: 'text-sm font-semibold text-tds-grey-500 mb-2'
  → 'text-t5 font-semibold text-tds-grey-500 mb-2'

tipsTitle: 'text-sm font-semibold text-tds-grey-500'
  → 'text-t5 font-semibold text-tds-grey-500'

tipTitle: 'text-sm font-semibold text-tds-blue-600'
  → 'text-t5 font-semibold text-tds-blue-600'

brandingTitle: 'text-sm font-semibold text-tds-grey-500'
  → 'text-t5 font-semibold text-tds-grey-500'
```

**Acceptance Criteria:**
- [ ] 토스 분기에 `text-lg` 값이 0개
- [ ] 모든 cardTitle/서브섹션 제목이 text-t5 (17px)
- [ ] 모든 본문 텍스트가 text-st8 (16px)
- [ ] 웹 분기 코드 무변경
- [ ] tsc 0 에러

### Task 1.2: resultTokens 정리 [S]

**파일:** `lib/section-styles.ts` (resultTokens 블록)

현재 resultTokens 토스 분기는 이미 TDS 스케일을 사용하고 있어 변경 최소:
- `bodyText`: `text-st8` — 이미 OK
- `caption`: `text-st11` — 이미 OK

변경 없음 확인만 필요.

**Acceptance Criteria:**
- [ ] resultTokens 토스 분기가 TDS 스케일만 사용하는지 확인

---

## Phase 2: 교차분석 섹션 통합 + DualRadar 색상 강화

### Task 2.1: CrossAnalysisSection 매트릭스+인사이트 통합 [M]

**파일:** `components/result/CrossAnalysisSection.tsx`

**현재 구조 (3블록):**
1. DualRadarChart (유지)
2. 2x2 매트릭스 그리드 — 4개 유형별 축 나열
3. 축별 인사이트 카드 — 5축 각각 유형 뱃지 + 인사이트 텍스트

**문제:** 매트릭스와 인사이트 카드에서 "어떤 축이 어떤 유형인지" 정보가 중복

**통합 레이아웃 제안:**

매트릭스(2)와 인사이트 카드(3)를 제거하고, 하나의 **유형별 그룹 리스트**로 대체:

```
[DualRadarChart] (유지)

[유형별 통합 카드 리스트]
  ┌─────────────────────────────┐
  │ ★ 핵심 무기 — 선천·후천 모두 강함  │  ← 유형 헤더 (아이콘 + 라벨 + 설명)
  │                               │
  │  ● 혁신/목                     │  ← 축 이름 + 오행 색상 dot
  │    사주의 목 기운과 혁신 사고가    │  ← 인사이트 텍스트
  │    시너지를 발휘합니다...        │
  │                               │
  │  ● 실행/금                     │
  │    금 기운의 체계성과 실행력이...  │
  └─────────────────────────────┘
  ┌─────────────────────────────┐
  │ ◆ 숨겨진 보석 — 선천 강하나 미개발 │
  │  ...                          │
  └─────────────────────────────┘
  (빈 유형은 표시하지 않음)
```

**구현 상세:**
- `matrixTypes` 순회는 유지 (alignment → potential → developed → undeveloped)
- 빈 그룹(`items.length === 0`)은 렌더링 스킵 (현재 매트릭스는 "해당 없음" 표시 — 불필요)
- 각 유형 카드 안에서 해당 축들의 인사이트 텍스트를 바로 표시
- **하드코딩 금지**: 대체 마크업에서 `text-sm`, `text-lg` 등 비TDS 값 사용 불가. 모든 클래스는 아래 매핑 테이블 준수.

**통합 카드 TDS 클래스 매핑 (반드시 준수):**

| 요소 | TDS 클래스 | 비고 |
|------|-----------|------|
| 유형 아이콘 (★◆↑✿) | `text-t5` | 기존 text-lg(비TDS) → TDS 값으로 교체 |
| 유형 라벨 (핵심 무기 등) | `text-t5 font-semibold` | color는 TYPE_CONFIG.color 인라인 유지 |
| 유형 설명 (선천·후천 모두 강함) | `text-st10 text-tds-grey-400` | 캡션 역할 |
| 축 이름 (혁신/목 등) | `text-st8 font-semibold` | color는 ELEMENT_COLORS 인라인 유지 |
| 축 인사이트 텍스트 | `text-st8 text-tds-grey-600 leading-relaxed` | 본문 역할 |
| 오행 색상 dot | `w-2 h-2 rounded-full flex-shrink-0` | background는 ELEMENT_COLORS 인라인 유지 |
| 카드 컨테이너 | `rounded-2xl border p-5 space-y-4` | borderColor/background는 TYPE_CONFIG.color 인라인 유지 |

**삭제되는 코드:**
- 2x2 `grid grid-cols-2` 매트릭스 블록 전체
- "축별 인사이트" 제목 + 5개 인사이트 카드 블록 전체

**추가되는 코드:**
- 유형별 통합 카드 리스트 (빈 그룹 스킵, 유형 헤더 + 축별 인사이트 인라인)

**section-styles.ts 토큰 정리:**
- `matrixDesc`, `matrixEmpty`, `matrixItem` 토큰 **제거** (dead code 방지). crossAnalysisStyles 타입에서도 제거하여 미사용 토큰이 남지 않도록 한다.

**Acceptance Criteria:**
- [ ] 2x2 매트릭스 그리드 제거됨
- [ ] 별도 "축별 인사이트" 섹션 제거됨
- [ ] 통합 카드에서 유형별 축 + 인사이트가 한번에 표시됨
- [ ] 빈 유형은 렌더링되지 않음
- [ ] 기존 5축 인사이트 텍스트가 모두 보존됨 (정보 손실 없음)
- [ ] tsc 0 에러

### Task 2.2: DualRadarChart 색상 대비 강화 [S]

**파일:** `components/result/DualRadarChart.tsx`

**현재 색상:**
- 사주 오행 (선천): `#3182f6` (TDS blue) + fillOpacity 0.3
- PSA 강점 (후천): `#06b6d4` (cyan) + fillOpacity 0.3

**문제:** 둘 다 파란 계열이라 겹치는 영역에서 구분 어려움

**변경:**
- 사주 오행 (선천): `#3182f6` (TDS blue) 유지 + fillOpacity 0.25
- PSA 강점 (후천): `#fe9800` (orange-500) + fillOpacity 0.25

**이유:** 블루 vs 오렌지는 보색 관계로 최대 대비. TDS 팔레트에서도 orange를 보조색으로 사용. fillOpacity를 0.25로 약간 낮춰 겹침 영역의 혼탁함 감소.

**Acceptance Criteria:**
- [ ] 두 레이더 색상이 보색 대비 (파랑 vs 오렌지)
- [ ] 범례(Legend)에서도 색상 구분 명확
- [ ] tsc 0 에러

---

## Phase 3: 검증

### Task 3.1: 빌드 검증 [S]

```bash
npx tsc --noEmit          # 0 에러
npm test                   # 전체 통과
npm run build              # 웹 빌드 성공
npm run build:toss         # 토스 빌드 성공
```

**Acceptance Criteria:**
- [ ] tsc 0 에러
- [ ] 테스트 전부 통과
- [ ] 웹 빌드 성공
- [ ] 토스 빌드 성공

### Task 3.2: 375px 시각적 검증 [S]

Chrome DevTools에서 375px 뷰포트로 결과 페이지를 렌더링하여 확인:
- [ ] 섹션 제목(22px) → 카드 제목(17px semibold) → 본문(16px normal) 3단계가 시각적으로 구분됨
- [ ] 교차분석 통합 카드에서 유형 헤더/축 이름/인사이트가 명확히 구분됨
- [ ] DualRadarChart 두 레이더(파랑/오렌지)가 색상으로 확실히 구분됨
- [ ] 카드 내부 텍스트가 375px에서 넘치거나 잘리지 않음

### Task 3.3: 토큰 일관성 확인 [S]

토스 분기 결과 페이지 관련 스타일에서 비TDS 값 검색:

```bash
grep -n 'text-lg\|text-base\|text-xl' lib/section-styles.ts
# 토스 분기에서 0건이어야 함 (웹 분기에는 있을 수 있음)
```

**Acceptance Criteria:**
- [ ] 토스 분기 section-styles에 text-lg, text-base 등 비TDS 값 0건
- [ ] 결과 페이지 4개 섹션의 타이포 계층: t3(22px) > t5(17px) > st8(16px) > st10/st11(14/13px)

---

## Rollback Strategy

- **Phase 1만 문제 시**: section-styles.ts 토스 분기 토큰 값만 원복 (`git diff lib/section-styles.ts`로 확인)
- **Phase 2만 문제 시**: CrossAnalysisSection.tsx + DualRadarChart.tsx만 원복 (Phase 1 타이포 개선은 유지)
- **전체 롤백**: `git stash` 또는 `git revert` — 웹 분기 무변경이므로 안전

## Success Criteria (AC 매핑)

| AC | 검증 방법 |
|----|----------|
| AC1: 타이포 계층 3단계 이상 | sectionTitle=t3/22px, cardTitle=t5/17px, bodyText=st8/16px, caption=st10-11/14-13px = 4단계 |
| AC2: 교차분석 중복 제거 + DualRadar 대비 | 매트릭스+인사이트 → 통합 카드, 레이더 블루 vs 오렌지 |
| AC3: 빌드/테스트/토큰 일관성 | tsc 0, tests pass, build+build:toss, 비TDS 값 0건 |

---

## Summary

| Phase | Tasks | Files | Complexity |
|-------|-------|-------|------------|
| Phase 1 | 1.1, 1.2 | section-styles.ts | S |
| Phase 2 | 2.1, 2.2 | CrossAnalysisSection.tsx, DualRadarChart.tsx | M + S |
| Phase 3 | 3.1, 3.2, 3.3 | (verification only) | S |

**Total: 6 tasks across 3 files + verification**

## Revision History

- **v1** (2026-03-30): Initial plan by Planner
- **v2** (2026-03-30): Architect + Critic 피드백 반영
  - `scoreCardTitle` Task 1.1에 추가 (Architect REQUIRED)
  - `scoreLabel` text-sm → text-st10 (TDS 일관성)
  - DualRadar 색상 #f97316 → #fe9800 (TDS orange, Critic MAJOR)
  - Task 2.1 통합 카드 TDS 클래스 매핑 테이블 추가 (Critic MAJOR)
  - `matrixDesc`/`matrixEmpty`/`matrixItem` 토큰 제거 결정 (Critic MINOR)
  - Phase 1→2 하드 의존성 명시 (Critic MINOR)
  - t4 스킵 사유 Principle에 문서화 (Architect OPTIONAL)
  - Task 3.2 375px 시각적 검증 추가 (Critic missing)
  - Rollback Strategy 섹션 추가 (Critic missing)
