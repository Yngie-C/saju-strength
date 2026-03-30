# Deep Dive Trace: result-page-ui-ux-improvement

## Observed Result
결과 페이지(app/result/page.tsx)가 4개 섹션(사주/PSA/교차분석/성장가이드) + 8개 하위 컴포넌트로 구성되어 있으나, 가독성이 부족하여 사용자가 핵심 정보를 빠르게 파악하기 어렵다.

## Ranked Hypotheses
| Rank | Hypothesis | Confidence | Evidence Strength | Why it leads |
|------|------------|------------|-------------------|--------------|
| 1 | 타이포그래피 & 여백 체계 혼란 | High | Strong | TDS/Tailwind 이중 스케일 혼용, cardTitle=bodyText 동일 14px, 모바일 텍스트 오버라이드 전무 — 읽기 리듬의 물리적 기반이 무너져 있음 |
| 2 | 정보 밀도 & 시각적 위계 부재 | High | Strong | 4개 섹션 헤더 동일 무게, 1px divider, Section A/B/C/D 라벨, GrowthGuide 최하단 과밀 — 정보 아키텍처 수준의 구조적 문제 |
| 3 | 차트·카드 레이아웃 비최적화 | Medium | Moderate | 레이더 클리핑 위험, 4주 카드 85px 과밀, DualRadar 색상 유사성 — 컴포넌트 수준 문제로 1,2번 해결 시 자연 개선 가능 |

## Evidence Summary by Hypothesis

### Hypothesis 1: 타이포그래피 & 여백 체계
- **이중 타이포 스케일 혼용**: `resultTokens.sectionTitle`(text-2xl)과 `sajuProfileStyles.sectionTitle`(text-t3)이 공존하면서 권위 있는 소스가 불명확 (`section-styles.ts:267` vs `:6`)
- **h3 = body 동일 크기**: cardTitle(text-sm font-semibold, 14px) ≈ bodyText(text-sm, 14px) — weight 차이만으로 계층 표현 (`section-styles.ts:13,70,41,113`)
- **TDS 스케일 밖 값 사용**: sectionSubtitle에 `text-lg`(18px) — TDS 계단(22→20→17→16)에 없는 값 (`section-styles.ts:8,67,39`)
- **lineHeight 불일치**: designTokens.headingXl — 토스 `t4`(lineHeight 1.45) vs 웹 `text-xl`(lineHeight 1.75) (`design-tokens.ts:62-63`)
- **모바일 텍스트 오버라이드 전무**: 4개 섹션 모두 `sm:`/`md:` 반응형이 그리드에만 적용, 텍스트 크기·패딩은 데스크탑과 동일
- **resultTokens vs section-styles 불일치**: resultTokens.bodyText(text-st8, 16px) ≠ growthGuideStyles.summaryText(text-sm, 14px)

### Hypothesis 2: 정보 밀도 & 시각적 위계
- **SectionDivider 시각적 무게 부족**: `border-t border-tds-grey-200 my-8` — 1px 최연한 톤 선 하나 (`section-styles.ts:273`)
- **섹션 헤더 4개 모두 동일 무게**: sectionLabel(xs) → sectionTitle(t3/2xl) → sectionSubtitle(lg) 패턴 반복, 주/부 구분 없음
- **카드 타이틀 모두 text-sm font-semibold**: 섹션 제목(t3)과 카드 제목(sm) 사이 중간 레벨 부재 — 2단계 계층으로 압축
- **GrowthGuide 최하단 과밀**: 5개 서브섹션, 10+ 카드가 스크롤 최하단에 집중 (`GrowthGuideSection.tsx:61-161`)
- **CrossAnalysis 정보 중복**: 2×2 Matrix와 축별 인사이트가 동일 분류 정보를 두 번 노출 (`CrossAnalysisSection.tsx:128-225`)
- **Section A/B/C/D 라벨**: 맥락 없는 알파벳 순서만 나열

### Hypothesis 3: 차트·카드 레이아웃
- **DualRadarChart**: height=300, outerRadius=100, Legend 위치 미지정 → 레이블 클리핑 위험 (`DualRadarChart.tsx:33-34,57-61`)
- **사주 4주 grid-cols-4 고정**: 375px에서 카드당 ~85px, 반응형 breakpoint 없음 (`SajuProfileSection.tsx:62`)
- **DualRadar 색상 유사성**: #3182f6(파랑) vs #06b6d4(청록), fillOpacity 동일 0.3 → 겹침 시 구분 어려움 (`DualRadarChart.tsx:47,53`)
- **2×2 매트릭스 grid-cols-2 고정**: 375px에서 셀당 ~180px, 내부 3단계 텍스트 과밀 (`CrossAnalysisSection.tsx:129`)
- **p-6 일관 적용**: 모바일 유효 콘텐츠 너비 = 375 - 48(카드 패딩) - 32(페이지 패딩) = 295px (`section-styles.ts:12,41,69`)

## Evidence Against / Missing Evidence

### Hypothesis 1 (타이포그래피)
- 섹션 헤더 3단 구조 자체는 4개 섹션에서 일관 적용됨
- IS_TOSS 분기가 명확하여 런타임 스케일 혼용은 없음
- TDS 폰트 스케일(t1~t7, st8~st13)이 tailwind.config.ts에 체계적으로 정의됨

### Hypothesis 2 (정보 밀도)
- 섹션별 색상 코딩 시도됨 (GrowthGuide만 green 계열 차별화)
- whileInView 애니메이션이 스크롤 시 섹션 경계 인지 보조
- PSA 섹션의 레이더→페르소나→점수바 흐름은 추상→구체 계층이 명확

### Hypothesis 3 (차트/카드)
- FiveElementsChart 도넛(w-48 h-48 고정)은 안정적 렌더링
- 점수 바 flex 레이아웃이 잘 설계됨 (flex-shrink-0 + flex-1)
- md:grid-cols-2 breakpoint가 적용된 섹션은 태블릿 이상에서 문제 없음

## Per-Lane Critical Unknowns
- **Lane 1 (정보 밀도)**: 모바일 375px에서 `space-y-12 + SectionDivider(my-8)` = 112px 간격이 실제로 "섹션 전환"으로 인식되는지 — 두 섹션의 카드가 동시에 뷰포트에 들어오는지 실측 미확인
- **Lane 2 (타이포그래피)**: cardTitle(14px semibold)→bodyText(14px regular) 전환과 `pl-8` 들여쓰기가 375px WebView에서 실제 읽기를 얼마나 방해하는지 실측 미확인
- **Lane 3 (차트/카드)**: PolarAngleAxis 레이블이 SVG 컨테이너 경계를 벗어날 때 클리핑되는지 overflow로 노출되는지, DualRadar 색상 구분 가능 여부

## Rebuttal Round

**Leader: Lane 2 (타이포그래피 & 여백)**
**Strongest alternative: Lane 1 (정보 밀도 & 시각적 위계)**

**Best rebuttal to leader:**
Lane 1 주장: "타이포 수정만으로는 불충분하다. 4개 섹션의 동일 무게 헤더, 1px divider, Section A/B/C/D 라벨은 타이포 스케일과 무관한 정보 아키텍처 문제다. 텍스트 크기를 아무리 정교하게 조정해도 '어떤 섹션이 핵심인가'라는 구조적 질문에는 답할 수 없다."

**Why leader held:**
두 가설은 사실상 **같은 근본 원인의 다른 층위**다. Lane 2(타이포)는 micro-level 실행 문제(px 단위 일관성), Lane 1(정보 밀도)은 macro-level 구조 문제(섹션 우선순위). 둘 다 "시각적 위계 부재"라는 하나의 메커니즘으로 수렴한다. Leader가 유지되는 이유는 타이포 체계가 정보 위계의 **물리적 기반**이기 때문 — 구조를 아무리 잘 설계해도 실행 도구(타이포)가 망가져 있으면 위계가 전달되지 않는다.

## Convergence / Separation Notes

**수렴 감지:** Lane 1과 Lane 2는 "시각적 위계 부재"라는 동일 메커니즘의 두 층위(구조 vs 실행)로 수렴한다.
- Lane 1 = **WHAT** 문제: 어떤 정보를 어떤 우선순위로 보여줄 것인가 (정보 아키텍처)
- Lane 2 = **HOW** 문제: 그 우선순위를 어떤 타이포/여백으로 시각화할 것인가 (실행 체계)
- 두 레인 모두 해결해야 완전한 개선이 달성됨

**분리 유지:** Lane 3은 Lane 1+2와 독립적인 컴포넌트 수준 문제를 포함한다 (레이더 차트 색상, SVG 클리핑, 그리드 고정값). 이들은 위계 문제와 직교하는 렌더링 최적화 영역이다.

## Most Likely Explanation

결과 페이지 가독성 문제의 근본 원인은 **"시각적 위계 체계의 부재"**로, 두 층위에서 동시에 발생한다:

1. **정보 아키텍처 층위**: 4개 섹션이 동일한 시각적 무게로 나열되어 핵심 정보(일간 아키타입, 페르소나, 성장 가이드)와 보조 정보(세부 점수, 축별 인사이트)의 구분이 없음. SectionDivider가 1px 선으로 무력하고, Section A/B/C/D 라벨이 맥락 없는 순서 번호에 불과함.

2. **타이포그래피 실행 층위**: TDS/Tailwind 이중 스케일이 혼용되면서 일관된 계층 표현이 불가능. 특히 cardTitle(14px)=bodyText(14px) 동일 크기 문제와 모바일 전용 오버라이드 부재가 375px WebView에서 정보 과밀을 야기함.

3. **컴포넌트 수준 보조 요인**: 레이더 차트 색상 유사성, 4주 그리드 고정 레이아웃, p-6 일관 패딩이 모바일 가독성을 추가로 저하시킴.

## Critical Unknown

실제 375px 모바일 뷰포트에서 렌더링된 결과 페이지의 **섹션 간 시각적 분리도와 텍스트 계층 인식도** — 코드 분석으로 구조적 문제는 확인했으나, 사용자가 실제로 스크롤하며 소비할 때 어떤 섹션에서 가장 큰 인지 부하가 발생하는지는 실측 데이터(스크린샷, 히트맵, 사용자 피드백) 없이 단정할 수 없다.

## Recommended Discriminating Probe

Chrome DevTools 375px 뷰포트에서 결과 페이지를 풀 렌더링하고:
1. 각 섹션 경계에서 스크롤 없이 보이는 카드 수를 세어 정보 밀도 체감
2. cardTitle→bodyText 전환 구간에서 계층 인식 가능 여부 확인
3. DualRadarChart 레이블 클리핑 여부 직접 확인

이 한 번의 실측으로 3개 레인의 critical unknown을 동시에 해소할 수 있다.
