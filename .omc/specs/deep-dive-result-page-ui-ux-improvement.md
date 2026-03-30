# Deep Dive Spec: 결과 페이지 UI/UX 개선을 통한 가독성 확보

## Metadata
- Interview ID: dd-result-page-ui-ux
- Rounds: 8
- Final Ambiguity Score: 14.7%
- Type: brownfield
- Generated: 2026-03-30
- Threshold: 20%
- Status: PASSED

## Clarity Breakdown
| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Goal Clarity | 0.88 | 0.35 | 0.308 |
| Constraint Clarity | 0.88 | 0.25 | 0.22 |
| Success Criteria | 0.82 | 0.25 | 0.205 |
| Context Clarity | 0.80 | 0.15 | 0.12 |
| **Total Clarity** | | | **0.853** |
| **Ambiguity** | | | **14.7%** |

## Goal

**토스 빌드(IS_TOSS) 중심으로** 결과 페이지의 가독성을 개선한다. 두 가지 핵심 축:

1. **전체 타이포그래피 & 여백 체계 통일**: 현재 2단계(섹션 제목 22px → 본문 14px)로 압축된 텍스트 위계를 **최소 3단계**(섹션 제목 → 카드/서브섹션 제목 → 본문)로 확장하여 읽기 리듬을 확보. TDS 스케일 중심으로 통일.

2. **교차분석(CrossAnalysis) 섹션 중복 제거 및 통합 레이아웃**: 2×2 매트릭스와 축별 인사이트 카드의 정보 중복을 제거하고 하나로 통합. DualRadarChart의 색상 대비를 강화하여 사주/PSA 오버레이 구분 개선.

## Constraints

- **섹션 순서 변경 제외**: 현재 사주 → PSA → 교차분석 → 성장가이드 순서 유지
- **토스 빌드 우선**: 웹 빌드는 현재 비운영 상태. 토스 빌드(IS_TOSS=true) 경로 중심으로 작업. 웹은 빌드 깨짐 방지 수준으로 최소 대응.
- **TDS 스케일 중심 통일**: 토스 빌드의 타이포그래피는 TDS 스케일(t1~t7, st8~st13) 사용. TDS에 없는 값(예: `text-lg`) 제거.
- **나머지 3개 섹션(사주/PSA/성장가이드)**: 레이아웃 구조 변경 없이 타이포/여백/시각적 구분 개선만 적용
- **디자인 가이드 참조**: `~/Desktop/Github/app-in-toss` 디렉터리의 디자인 가이드를 계획 수립 시 참조

## Non-Goals

- 섹션 순서 재배치
- 새로운 섹션이나 기능 추가
- 데이터 흐름(useResultData 훅) 변경
- 웹 빌드 전용 UI 개선
- `app/p/[slug]` 프로필 페이지 수정

## Acceptance Criteria

### AC1: 타이포 계층 3단계 이상 확보
- [ ] 섹션 제목(TDS t3/22px 이상) → 카드/서브섹션 제목(TDS 중간 스케일, 예: t5/17px) → 본문 텍스트(st8/16px 또는 text-sm/14px) 3단계가 시각적으로 명확히 구분됨
- [ ] `cardTitle`(현재 text-sm 14px)과 `bodyText`(현재 text-sm 14px)가 서로 다른 크기를 가짐
- [ ] TDS 스케일에 없는 혼용 값(예: `text-lg` 18px)이 제거되고 TDS 토큰으로 대체됨

### AC2: 교차분석 섹션 중복 제거로 스크롤 감소
- [ ] 2×2 매트릭스와 축별 인사이트의 중복 정보가 하나의 통합 레이아웃으로 합쳐짐
- [ ] DualRadarChart의 두 레이더 색상이 명확히 구분됨 (유사 계열 파랑/청록 → 대비 강화)
- [ ] 통합 후 교차분석 섹션의 전체 높이가 감소

### AC3: 코드 품질 기준
- [ ] `tsc` 0 에러
- [ ] 기존 테스트 전체 통과
- [ ] `npm run build` 및 `npm run build:toss` 모두 성공
- [ ] `section-styles.ts`와 `design-tokens.ts`의 토큰 사용이 일관적

## Assumptions Exposed & Resolved
| Assumption | Challenge | Resolution |
|------------|-----------|------------|
| 가독성은 주관적이다 | Contrarian: 관찰 가능한 기준이 있는가? | 3개 복합 기준(타이포 3단계, 스크롤 감소, 코드 품질)으로 객체화 |
| 4개 섹션 모두 동등하다 | 어떤 섹션이 핵심인가? | 교차분석이 핵심(서비스 차별화 포인트), 나머지는 보조 |
| 웹+토스 동시 개선 필요 | 작업량 축소 가능한가? | 웹 비운영 → 토스 빌드 중심 축소 |
| 전면 재구성 필요 | Simplifier: 최소한의 개선은? | 나머지 3섹션은 타이포/여백 통일만, 교차분석만 구조 변경 |
| TDS/Tailwind 이중 스케일 유지 | 어떤 스케일로 통일? | TDS 스케일 중심 통일 |

## Technical Context

### 트레이스 기반 현황 (코드 분석 결과)

**타이포그래피 문제:**
- `section-styles.ts`에서 cardTitle(text-sm 14px) = bodyText(text-sm 14px) 동일 크기
- sectionSubtitle에 TDS에 없는 `text-lg`(18px) 사용
- `resultTokens`와 개별 섹션 스타일 객체 사이 bodyText 크기 불일치 (st8 16px vs text-sm 14px)
- 모바일 전용 텍스트 크기 오버라이드 없음

**정보 밀도 문제:**
- SectionDivider: `border-t border-tds-grey-200 my-8` — 1px 최연한 톤 선 하나
- 4개 섹션 헤더 모두 동일한 시각적 무게 (sectionLabel→sectionTitle→sectionSubtitle)
- Section A/B/C/D 라벨이 맥락 없는 알파벳 순서

**교차분석 중복:**
- CrossAnalysisSection: 2×2 매트릭스(line 128-182)와 축별 인사이트(line 184-225)가 동일 분류 정보를 이중 표시

**차트/레이아웃:**
- DualRadarChart: #3182f6(파랑) vs #06b6d4(청록) 유사 색상, fillOpacity 동일 0.3
- 사주 4주 카드: grid-cols-4 고정 (375px에서 카드당 ~85px)
- 카드 패딩 p-6(24px) 일관 적용 → 모바일 유효 콘텐츠 너비 제한

### 핵심 수정 대상 파일
- `lib/section-styles.ts` — 토큰 체계 통일 (primary)
- `lib/design-tokens.ts` — 디자인 토큰 정리
- `components/result/CrossAnalysisSection.tsx` — 중복 제거 및 통합
- `components/result/DualRadarChart.tsx` — 색상 대비 강화
- `components/result/SajuProfileSection.tsx` — 타이포 적용
- `components/result/PsaProfileSection.tsx` — 타이포 적용
- `components/result/GrowthGuideSection.tsx` — 타이포 적용
- `app/result/page.tsx` — SectionDivider 강화

## Trace Findings

트레이스는 3개 병렬 레인으로 실행되었으며, 모든 레인이 **"시각적 위계 체계의 부재"**라는 단일 메커니즘으로 수렴했다.

- **Lane 1 (정보 밀도 & 시각적 위계)**: High confidence, Strong evidence — 4개 섹션 동일 무게 헤더, 1px divider, 카드 타이틀=본문 동일 크기, GrowthGuide 최하단 과밀, CrossAnalysis 정보 중복
- **Lane 2 (타이포그래피 & 여백)**: High confidence, Strong evidence — TDS/Tailwind 혼용, 모바일 텍스트 오버라이드 전무, resultTokens vs section-styles 불일치
- **Lane 3 (차트/카드 레이아웃)**: Medium confidence, Moderate evidence — 레이더 클리핑 위험, 4주 카드 과밀, DualRadar 색상 유사성

**수렴 분석:** Lane 1(WHAT — 정보 아키텍처)과 Lane 2(HOW — 타이포 실행)는 같은 문제의 두 층위. Lane 3은 컴포넌트 수준 보조 요인으로, Lane 1+2 해결 시 자연 개선 가능한 부분이 많음.

**Per-lane critical unknowns (인터뷰에서 해소):**
- Lane 1: 사용자가 교차분석을 핵심 섹션으로 확인 → 섹션 우선순위 확정
- Lane 2: TDS 스케일 중심 통일 결정 + 토스 빌드 중심 범위 축소
- Lane 3: 색상 대비 강화로 DualRadar 구분 개선 포함

## Ontology (Key Entities)

| Entity | Type | Fields | Relationships |
|--------|------|--------|---------------|
| 결과 페이지 | core domain | page, sections, skeleton, error | 4개 섹션을 포함 |
| 교차분석 섹션 | core domain | dualRadar, matrix, insights, axes | 사주+PSA 데이터를 교차 분석 |
| 사주 프로필 | supporting | fourPillars, dayMaster, elementDist | 결과 페이지의 Section A |
| PSA 프로필 | supporting | radarChart, persona, categoryScores | 결과 페이지의 Section B |
| 성장 가이드 | supporting | summary, focusAreas, tips, branding | 결과 페이지의 Section D |
| 듀얼 레이더 차트 | component | colors, opacity, outerRadius, legend | 교차분석 섹션에 포함 |
| 2×2 매트릭스 | component | types(4), axes, colors | 교차분석 섹션에 포함 (통합 대상) |
| 축별 인사이트 | component | axisName, type, insight | 교차분석 섹션에 포함 (통합 대상) |
| 타이포 체계 | core domain | TDS scale, 3-level hierarchy | 전체 섹션에 적용 |
| 타이포 계층 체계 | supporting | sectionTitle, cardTitle, bodyText | 타이포 체계의 구현 구조 |

## Ontology Convergence

| Round | Entity Count | New | Changed | Stable | Stability Ratio |
|-------|-------------|-----|---------|--------|----------------|
| 1 | 8 | 8 | - | - | N/A |
| 2 | 8 | 0 | 0 | 8 | 100% |
| 3 | 9 | 1 | 0 | 8 | 89% |
| 4 | 10 | 1 | 0 | 9 | 90% |
| 5-8 | 10 | 0 | 0 | 10 | 100% |

온톨로지는 Round 4 이후 완전히 수렴(100% stability). 핵심 개념이 안정적.

## Interview Transcript
<details>
<summary>Full Q&A (8 rounds)</summary>

### Round 1
**Q:** 사용자가 가장 먼저/중요하게 봐야 하는 핵심 정보는 무엇인가?
**A:** 교차분석 (사주×PSA 통합) — 이 서비스의 차별화 포인트
**Ambiguity:** 73.5% (Goal: 0.40, Constraints: 0.10, Criteria: 0.10, Context: 0.50)

### Round 2
**Q:** 교차분석 섹션 개선 방향은?
**A:** 중복 제거 + 통합 레이아웃 — 2×2 매트릭스와 축별 인사이트를 하나로
**Ambiguity:** 65.8% (Goal: 0.60, Constraints: 0.10, Criteria: 0.10, Context: 0.55)

### Round 3
**Q:** 이번 개선의 범위는?
**A:** 전체 타이포/여백 + 교차분석 통합 동시 진행
**Ambiguity:** 54.5% (Goal: 0.65, Constraints: 0.45, Criteria: 0.10, Context: 0.60)

### Round 4 [Contrarian Mode]
**Q:** "가독성"이 성공했다는 관찰 가능한 기준은?
**A:** 복합 기준 — 타이포 3단계 + 스크롤 감소 + 코드 품질 모두 충족
**Ambiguity:** 38.3% (Goal: 0.70, Constraints: 0.50, Criteria: 0.60, Context: 0.65)

### Round 5
**Q:** 이번 개선에서 제외할 것은?
**A:** 섹션 순서 변경 제외 (접힘/탭은 가능)
**Ambiguity:** 32.9% (Goal: 0.72, Constraints: 0.65, Criteria: 0.62, Context: 0.68)

### Round 6 [Simplifier Mode]
**Q:** 나머지 3개 섹션은 타이포/여백 통일만으로 충분한가?
**A:** 충분. 전체적으로 텍스트 위계가 불명확하니 구분을 추가하여 가독성 향상
**Ambiguity:** 27.5% (Goal: 0.82, Constraints: 0.70, Criteria: 0.62, Context: 0.72)

### Round 7
**Q:** 타이포 3단계와 스크롤 감소 기준을 구체화하면?
**A:** 섹션 제목→카드 제목→본문 3단계 확인 + 중복 제거로 자연스러운 감소로 충분
**Ambiguity:** 21.0% (Goal: 0.85, Constraints: 0.72, Criteria: 0.80, Context: 0.75)

### Round 8
**Q:** 타이포 통일 시 TDS vs Tailwind 어느 쪽 중심?
**A:** TDS 스케일 중심. 웹은 비운영이므로 토스 빌드 중심으로 작업량 축소. ~/Desktop/Github/app-in-toss 디자인 가이드 참조.
**Ambiguity:** 14.7% (Goal: 0.88, Constraints: 0.88, Criteria: 0.82, Context: 0.80)

</details>
