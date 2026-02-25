# 조후(調候) 보정 강화 계획서

## 1. 문제 분석

### 1.1 테스트 케이스: 1991.5.14 미시

**사주:** 辛未 癸巳 甲申 辛未 (일간: 甲木)

다른 사주 프로그램에서는 화(火) 기운이 높게 나오지만,
현재 시스템에서는 **화가 5위(꼴찌)**로 나온다.

```
현재 결과 (조후 보정 후):
  Metal:  3.74  ← 1위
  Wood:   2.96  ← 2위
  Water:  2.26  ← 3위
  Earth:  2.16  ← 4위
  Fire:   1.47  ← 5위 (꼴찌!)
```

**5월(巳月)에 태어났는데 화가 꼴찌** — 직관에 어긋나며, 전통 이론과도 맞지 않음.

### 1.2 원인 진단

현재 조후 보정의 구조적 한계 3가지:

#### (1) JOHU_DELTA 값이 너무 작음

```
현재: 旺 +15%,  相 +7%,  休 ±0%,  囚 -10%,  死 -20%
범위: 旺 대비 死 = 1.15 / 0.80 = 1.44배 차이
```

전통 旺相休囚死 이론에서 旺과 死의 차이는 **2.5~5배** 수준인데,
현재 시스템은 겨우 1.44배로 계절 영향이 거의 무의미함.

#### (2) 4개 지지 평균으로 계절 신호가 희석됨

```
이 사주의 지지별 계절원소:
  월지 巳 = fire  (0.50)  → 화에 +7.5%
  일지 申 = metal (0.25)  → 화에 -2.5% (상쇄!)
  연지 未 = earth (0.15)  → 화에 0%
  시지 未 = earth (0.10)  → 화에 0%
  ─────────────────────────
  최종 화 보정: 겨우 +5%
```

월지(巳=fire)가 계절을 나타내는 핵심인데, 일지(申=metal)가 부분적으로 상쇄.

#### (3) 곱셈 방식의 한계

raw 화 분포가 1.4밖에 안 되는 상황에서:
- 1.4 × 1.05 = 1.47 (겨우 +0.07)
- 1.4 × 1.50 = 2.10 (50% 증가해도 여전히 금속 3.7보다 훨씬 낮음)

**raw 값이 작으면 곱셈 보정으로는 순위를 뒤집을 수 없음.**

---

## 2. 조후 이론 조사 결과

### 2.1 旺相休囚死 (왕상휴수사) 이론

전통 명리학에서 계절에 따른 오행 강약을 나타내는 핵심 체계:

| 상태 | 의미 | 관계 |
|------|------|------|
| 旺(왕) | 한창 왕성 | 계절과 동일한 오행 |
| 相(상) | 기세를 받음 | 계절이 생하는 오행 (상생 자식) |
| 休(휴) | 쉬는 상태 | 계절을 생하는 오행 (상생 부모) |
| 囚(수) | 갇힌 상태 | 계절을 극하는 오행 |
| 死(사) | 힘을 잃음 | 계절에 극당하는 오행 |

> 원문: "得時我旺、我生者相、生我者休、克我者囚、我克者死"

### 2.2 계절별 旺相休囚死 표

| 계절 | 월지 | 旺 | 相 | 休 | 囚 | 死 |
|------|------|----|----|----|----|-----|
| 봄 | 寅卯辰 | 木 | 火 | 水 | 金 | 土 |
| 여름 | 巳午未 | 火 | 土 | 木 | 水 | 金 |
| 가을 | 申酉戌 | 金 | 水 | 土 | 火 | 木 |
| 겨울 | 亥子丑 | 水 | 木 | 金 | 土 | 火 |

> 참고: 辰未戌丑(토용월)은 土가 旺이 되는 변형이 있으나,
> 현재 시스템에서는 `BRANCH_ELEMENT` 매핑(辰→earth, 未→earth 등)으로 이미 반영됨.

### 2.3 정량적 접근 — 전통/현대 프로그램의 수치 체계

조사 결과, 주요 3가지 수치 체계가 존재:

| 체계 | 旺 | 相 | 休 | 囚 | 死 | 旺/死 비율 |
|------|------|------|------|------|------|-----------|
| **퍼센트형** | 100% | 80% | 60% | 40% | 20% | 5.0x |
| **승수형 (현대 SW)** | 1.2 | 1.1 | 1.0 | 0.8 | 0.6 | 2.0x |
| **포인트형** | 5 | 4 | 3 | 2 | 1 | 5.0x |
| **현재 시스템** | 1.15 | 1.07 | 1.0 | 0.90 | 0.80 | 1.44x |

**현재 시스템의 旺/死 비율(1.44x)은 가장 보수적인 승수형(2.0x)보다도 훨씬 약함.**

---

## 3. 개선 방안

### 핵심 변경: 2단계 조후 보정

기존의 "최종 결과에 곱셈" 방식을 **"개별 기여도 승수 + 계절 기운 가산"** 2단계로 전환.

### 3.1 Phase 1 — 개별 기여도 승수 (Per-Contribution Multiplier)

**변경 전 (현재):**
```
각 천간/지장간 기여도를 raw 합산 → 최종 합계에 조후 modifier 곱셈
```

**변경 후:**
```
각 천간/지장간 기여도를 합산할 때, 월지(月支) 계절에 따른
旺相休囚死 승수를 개별 적용
```

**계절 판정:** 월지(月支)의 오행만 사용 (전통적 접근)
- 4개 지지 평균 → 월지 단일 기준으로 변경
- 월지가 곧 계절 ("월령이 사주의 제강")

**승수 값:**

| 상태 | 승수 | 현재 대비 |
|------|------|----------|
| 旺 | 1.4 | +15% → ×1.4 |
| 相 | 1.2 | +7% → ×1.2 |
| 休 | 1.0 | ±0% → ×1.0 (변경 없음) |
| 囚 | 0.7 | -10% → ×0.7 |
| 死 | 0.5 | -20% → ×0.5 |

**旺/死 비율: 2.8x** (현재 1.44x → 2.8x, 약 2배 강화)

### 3.2 Phase 2 — 계절 기운 가산 (Seasonal Qi Bonus)

곱셈만으로는 raw 값이 작은 오행의 순위를 뒤집기 어려움.
전통 이론에서 "계절의 기운이 사주 전체에 스며든다"는 개념을 **가산 보너스**로 모델링.

**계산:**
```
rawTotal = 모든 오행의 보정 전 원래 가중치 합계 (시주 포함 시 13, 미포함 시 13)

가산 보너스:
  旺 원소: + rawTotal × 0.15  (약 +1.95)
  相 원소: + rawTotal × 0.05  (약 +0.65)
  休 원소: 0
  囚 원소: - rawTotal × 0.03  (약 -0.39)
  死 원소: - rawTotal × 0.06  (약 -0.78)
```

이 가산 보너스는 사주 팔자에 해당 오행이 전혀 없어도
"계절의 기운"으로 일정량이 존재함을 반영한다.

### 3.3 최종 공식

```
최종_분포[오행] = Σ(개별_기여도 × 位置가중치 × 계절승수) + 계절기운가산
                = max(0, 위 계산결과)  // 음수 방지
```

---

## 4. 테스트 케이스 검증

### 4.1 검증: 1991.5.14 미시 (辛未 癸巳 甲申 辛未)

월지: 巳 → fire 계절
- Fire: 旺(×1.4), Earth: 相(×1.2), Wood: 休(×1.0), Water: 囚(×0.7), Metal: 死(×0.5)

#### Phase 1: 개별 승수 적용

**천간:**
| 위치 | 한자 | 오행 | 가중치 | 계절상태 | 승수 | 보정값 |
|------|------|------|--------|---------|------|--------|
| 연간 | 辛 | metal | 1.0 | 死 | 0.5 | 0.50 |
| 월간 | 癸 | water | 2.0 | 囚 | 0.7 | 1.40 |
| 일간 | 甲 | wood | 3.0 | 休 | 1.0 | 3.00 |
| 시간 | 辛 | metal | 1.5 | 死 | 0.5 | 0.75 |

**지지 (지장간):**
| 위치 | 지지 | 지장간 | 비율 | 가중치 | 승수 | 보정값 |
|------|------|--------|------|--------|------|--------|
| 연지 | 未 | 丁(fire) | 0.30 | 1.0 | 1.4 | 0.42 |
| | | 乙(wood) | 0.10 | 1.0 | 1.0 | 0.10 |
| | | 己(earth) | 0.60 | 1.0 | 1.2 | 0.72 |
| 월지 | 巳 | 戊(earth) | 0.233 | 1.5 | 1.2 | 0.42 |
| | | 庚(metal) | 0.233 | 1.5 | 0.5 | 0.175 |
| | | 丙(fire) | 0.533 | 1.5 | 1.4 | 1.12 |
| 일지 | 申 | 己(earth) | 0.233 | 2.0 | 1.2 | 0.56 |
| | | 壬(water) | 0.233 | 2.0 | 0.7 | 0.326 |
| | | 庚(metal) | 0.533 | 2.0 | 0.5 | 0.533 |
| 시지 | 未 | 丁(fire) | 0.30 | 1.0 | 1.4 | 0.42 |
| | | 乙(wood) | 0.10 | 1.0 | 1.0 | 0.10 |
| | | 己(earth) | 0.60 | 1.0 | 1.2 | 0.72 |

**Phase 1 소계:**
```
Wood:   3.00 + 0.10 + 0.10       = 3.20
Fire:   0.42 + 1.12 + 0.42       = 1.96
Earth:  0.72 + 0.42 + 0.56 + 0.72 = 2.42
Metal:  0.50 + 0.75 + 0.175 + 0.533 = 1.96
Water:  1.40 + 0.326             = 1.73
```

#### Phase 2: 계절 기운 가산

rawTotal = 13 (위치 가중치 합계)

```
Fire  (旺): +13 × 0.15 = +1.95
Earth (相): +13 × 0.05 = +0.65
Wood  (休): 0
Water (囚): -13 × 0.03 = -0.39
Metal (死): -13 × 0.06 = -0.78
```

#### 최종 결과

```
개선 후:                          현재:
  Fire:   1.96 + 1.95 = 3.91 ★1위     Fire:   1.47  5위
  Wood:   3.20 + 0    = 3.20  2위     Metal:  3.74  1위
  Earth:  2.42 + 0.65 = 3.07  3위     Wood:   2.96  2위
  Water:  1.73 - 0.39 = 1.34  4위     Water:  2.26  3위
  Metal:  1.96 - 0.78 = 1.18  5위     Earth:  2.16  4위
```

**화(火)가 1위로, 5월(巳月) 여름 출생에 부합!**

순위 해석:
- 火(旺): 여름에 가장 왕성 → 1위 ✓
- 木(休): 일간 甲木 + 화를 생하고 쉬는 상태 → 2위 ✓
- 土(相): 화가 생하는 원소, 기세를 받음 → 3위 ✓
- 水(囚): 화를 극하지만 계절에 갇힘 → 4위 ✓
- 金(死): 화에 극당하여 힘을 잃음 → 5위 ✓

### 4.2 추가 검증: 겨울 출생 (예시)

월지: 子 → water 계절
- Water: 旺(×1.4), Wood: 相(×1.2), Metal: 休(×1.0), Earth: 囚(×0.7), Fire: 死(×0.5)

예상 동작:
- 水가 강화되고, 火가 약화됨 → 겨울 직관에 부합
- 가산: 水 +1.95, 木 +0.65, 土 -0.39, 火 -0.78

### 4.3 추가 검증: 토용월 (未月 = earth 계절)

월지: 未 → earth 계절
- Earth: 旺(×1.4), Metal: 相(×1.2), Fire: 休(×1.0), Wood: 囚(×0.7), Water: 死(×0.5)

예상 동작:
- 土가 강화, 계절 전환기 특성 반영
- 火는 休(1.0)로 중립 → 환절기에 화 기운이 쉬어감을 반영

---

## 5. 상세 설계

### 5.1 수정 대상 파일

| 파일 | 변경 내용 |
|------|----------|
| `lib/saju/five-elements.ts` | 조후 보정 로직 전면 개편 |

### 5.2 코드 변경 상세

#### A. 새로운 계절 승수 상수

```typescript
/** 旺相休囚死 개별 기여도 승수 (월지 기준) */
const SEASONAL_MULTIPLIER: Record<JohuState, number> = {
  wang:  1.4,   // 旺: ×1.4
  xiang: 1.2,   // 相: ×1.2
  xiu:   1.0,   // 休: ×1.0
  qiu:   0.7,   // 囚: ×0.7
  si:    0.5,   // 死: ×0.5
};

/** 계절 기운 가산 비율 (rawTotal 대비) */
const SEASONAL_QI_RATIO: Record<JohuState, number> = {
  wang:   0.15,  // 旺: +15%
  xiang:  0.05,  // 相: +5%
  xiu:    0.00,  // 休: ±0%
  qiu:   -0.03,  // 囚: -3%
  si:    -0.06,  // 死: -6%
};
```

#### B. `calculateElementDistribution` 함수 변경

```typescript
export function calculateElementDistribution(fourPillars: FourPillars): ElementDistribution {
  const dist: ElementDistribution = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };

  // 월지(月支)에서 계절 원소 결정
  const seasonElement = fourPillars.month.branchElement;

  // 계절 승수 조회 헬퍼
  const sm = (element: FiveElement): number =>
    SEASONAL_MULTIPLIER[getJohuState(seasonElement, element)];

  // 천간: 계절 승수 적용
  const addStem = (element: FiveElement, weight: number) => {
    dist[element] += weight * sm(element);
  };

  // 지지: 지장간 × 계절 승수 적용
  const addBranch = (branch: EarthlyBranch, weight: number) => {
    const branchDist = getBranchElementDistribution(branch);
    for (const el of ELEMENTS) {
      if (branchDist[el] > 0) {
        dist[el] += branchDist[el] * weight * sm(el);
      }
    }
  };

  // 위치별 가중치 적용 (기존과 동일)
  if (fourPillars.hour !== null) {
    const w = WEIGHTS_WITH_HOUR;
    addStem(fourPillars.year.stemElement, w.yearStem);
    addStem(fourPillars.month.stemElement, w.monthStem);
    addStem(fourPillars.day.stemElement, w.dayStem);
    addStem(fourPillars.hour.stemElement, w.hourStem);
    addBranch(fourPillars.year.branch, w.yearBranch);
    addBranch(fourPillars.month.branch, w.monthBranch);
    addBranch(fourPillars.day.branch, w.dayBranch);
    addBranch(fourPillars.hour.branch, w.hourBranch);
  } else {
    const w = WEIGHTS_WITHOUT_HOUR;
    addStem(fourPillars.year.stemElement, w.yearStem);
    addStem(fourPillars.month.stemElement, w.monthStem);
    addStem(fourPillars.day.stemElement, w.dayStem);
    addBranch(fourPillars.year.branch, w.yearBranch);
    addBranch(fourPillars.month.branch, w.monthBranch);
    addBranch(fourPillars.day.branch, w.dayBranch);
  }

  // 계절 기운(季節氣韻) 가산 — 월지 계절의 ambient energy
  const rawTotal = fourPillars.hour !== null ? 13 : 13;
  for (const el of ELEMENTS) {
    const state = getJohuState(seasonElement, el);
    dist[el] += rawTotal * SEASONAL_QI_RATIO[state];
    dist[el] = Math.max(0, dist[el]); // 음수 방지
  }

  return dist;
}
```

#### C. 제거 대상

- `calculateJohuModifiers()` 함수: 더 이상 사용하지 않음 (새 로직으로 대체)
- `JOHU_DELTA`, `JOHU_POS_WITH_HOUR`, `JOHU_POS_WITHOUT_HOUR` 상수: 삭제
- `saju-analyzer.ts` 등에서 `calculateJohuModifiers` 호출부가 있으면 제거

### 5.3 영향 범위

| 영향 받는 항목 | 변경 필요 |
|---------------|----------|
| 오행 분포 계산 (`five-elements.ts`) | 핵심 변경 |
| 사주 분석 에이전트 (`saju-analyzer.ts`) | `calculateJohuModifiers` 호출 제거 확인 |
| 교차 분석 (`cross-analysis.ts`) | 변경 없음 (순위 기반이라 자동 반영) |
| 결과 페이지 UI | 변경 없음 (분포 값만 바뀜) |
| 테스트 (`five-elements.test.ts`) | 기대값 업데이트 필요 |

---

## 6. 승수 튜닝 가이드

나중에 미세 조정이 필요할 경우:

| 변경 목적 | 조정 대상 |
|----------|----------|
| 계절 효과를 더 극적으로 | `SEASONAL_MULTIPLIER`의 旺↑ 死↓ |
| 계절 효과를 더 완만하게 | `SEASONAL_MULTIPLIER`의 범위 축소 |
| 사주에 없는 오행도 계절에 의해 등장 | `SEASONAL_QI_RATIO`의 旺 비율 ↑ |
| 곱셈 vs 가산 비중 조절 | 두 상수 세트의 상대적 크기 조절 |

**권장 旺/死 비율 범위:** 2.0x ~ 4.0x (현재 제안: 2.8x)

---

## 7. 테스트 케이스에서 화(火)가 높아야 하는 이유 (상세)

### 7.1 사주 구성: 辛未 癸巳 甲申 辛未

**Factor 1: 월지 巳 = 화(火) 계절**
- 巳는 여름의 첫 달 (사월/양력 5월)
- 旺相休囚死에서 火가 旺 — 계절적으로 가장 왕성한 상태
- 巳의 지장간: 丙火 53.3%, 戊土 23.3%, 庚金 23.3% → 과반이 화

**Factor 2: 연지·시지 未 = 화의 숨겨진 보급원**
- 未는 토(土)이지만 지장간에 丁火 30% 포함
- 연지(未)와 시지(未), 두 곳에서 화 에너지 공급
- 巳午未 방합(南方火局) 중 巳+未가 있어 화의 방향성 강화

**Factor 3: 계절 증폭**
- 巳月에 화는 旺 → 모든 화 기여도가 1.4배 증폭
- 동시에 금(金)은 死 → 0.5배로 감소
- 천간의 辛金 2개(연간+시간)가 계절에 의해 크게 약화됨

**Factor 4: 조후용신 관점**
- 궁통보감(窮通寶鑑) 기준: 甲木 일간 巳月생은 화 기운이 과다
- 조후용신으로 壬水(양수)가 급하게 필요한 사주
- 이는 곧 화가 압도적으로 강하다는 전제를 의미

---

## 8. 구현 단계

1. `five-elements.ts`에 새 상수 추가 (`SEASONAL_MULTIPLIER`, `SEASONAL_QI_RATIO`)
2. `calculateElementDistribution()` 함수 개편 (월지 기준 계절 승수 + 가산)
3. 기존 `calculateJohuModifiers()` 및 관련 상수 제거
4. 테스트 케이스 업데이트 및 검증
5. 1991.5.14 미시 포함 여러 케이스로 결과 확인
6. 빌드 확인 후 커밋/푸시

---

## 9. 참고 자료

- 궁통보감(窮通寶鑑) — 조후용신의 원전, 10천간 × 12월 = 120 조합 체계
- 연해자평(淵海子平) / 삼명통회(三命通會) — 지장간 3기설 근거
- 적천수(滴天髓) — 任鐵樵 주해, "相이 旺보다 묘하다" 원문
- [사주 오행 점수 분석 — 旺相休囚死 계절 보정](https://m.cafe.daum.net/1poetry/7NdS/493)
- [八字旺衰精算法 — 중국 현대 정량 사주 분석](https://zhuanlan.zhihu.com/p/661797450)
- [사주 득령 개념·조건·강도](https://sajuyukhyo.co.kr/사주-득령-개념-조건-강도/)
- [五行旺相休囚死 — 百度百科](https://baike.baidu.com/item/五行旺相休囚死/15406432)
