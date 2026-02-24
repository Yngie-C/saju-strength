import type { FourPillars, ElementDistribution, ElementRanks, FiveElement } from '@/types/saju';

/** 시주 있을 때 가중치 */
const WEIGHTS_WITH_HOUR = {
  yearStem:    1,
  yearBranch:  1,
  monthStem:   2,
  monthBranch: 1.5,
  dayStem:     3,
  dayBranch:   2,
  hourStem:    1.5,
  hourBranch:  1,
} as const;

/** 시주 없을 때 가중치 (시주 제거 후 비율 재조정) */
const WEIGHTS_WITHOUT_HOUR = {
  yearStem:    1,
  yearBranch:  1,
  monthStem:   2.5,
  monthBranch: 2,
  dayStem:     4,
  dayBranch:   2.5,
} as const;

/** 토(Earth) 편향 보정 계수 */
const EARTH_CORRECTION = 0.85;

// ─── 조후(調候) 보정 ──────────────────────────────────
// 계절(지지)에 따른 오행 강약 — 旺相休囚死 이론 기반

/** 오행 상생(生): X → GENERATION[X] */
const GENERATION: Record<FiveElement, FiveElement> = {
  wood: 'fire',   // 木生火
  fire: 'earth',  // 火生土
  earth: 'metal', // 土生金
  metal: 'water', // 金生水
  water: 'wood',  // 水生木
};

/** 역방향 상생: PARENT[X] 生 X */
const PARENT: Record<FiveElement, FiveElement> = {
  fire: 'wood',
  earth: 'fire',
  metal: 'earth',
  water: 'metal',
  wood: 'water',
};

/** 역방향 상극: CONTROLLED_BY[X] 克 X */
const CONTROLLED_BY: Record<FiveElement, FiveElement> = {
  earth: 'wood',  // 木克土
  water: 'earth', // 土克水
  fire: 'water',  // 水克火
  metal: 'fire',  // 火克金
  wood: 'metal',  // 金克木
};

/**
 * 旺相休囚死 상태 판정
 * - 旺(wang):  계절과 동일한 오행 — 한창 왕성
 * - 相(xiang): 계절이 생하는 오행 — 기세를 받음
 * - 休(xiu):   계절을 생하는 오행 — 할 일을 마치고 쉼
 * - 囚(qiu):   계절을 극하는 오행 — 시절을 거스르니 갇힘
 * - 死(si):    계절에 극당하는 오행 — 힘을 잃음
 */
type JohuState = 'wang' | 'xiang' | 'xiu' | 'qiu' | 'si';

function getJohuState(seasonElement: FiveElement, target: FiveElement): JohuState {
  if (target === seasonElement)               return 'wang';
  if (target === GENERATION[seasonElement])    return 'xiang';
  if (target === PARENT[seasonElement])        return 'xiu';
  if (target === CONTROLLED_BY[seasonElement]) return 'qiu';
  return 'si';
}

/** 旺相休囚死 보정 편차 (1.0 기준) */
const JOHU_DELTA: Record<JohuState, number> = {
  wang:   0.15,   // 旺: +15%
  xiang:  0.07,   // 相: +7%
  xiu:    0.00,   // 休: ±0% (기준선)
  qiu:   -0.10,   // 囚: -10%
  si:    -0.20,   // 死: -20%
};

/** 조후 위치 가중치 — 시주 있을 때 (월지 >> 일지 > 연지 > 시지) */
const JOHU_POS_WITH_HOUR = { month: 0.50, day: 0.25, year: 0.15, hour: 0.10 } as const;

/** 조후 위치 가중치 — 시주 없을 때 (시주 몫을 월지에 합산) */
const JOHU_POS_WITHOUT_HOUR = { month: 0.60, day: 0.25, year: 0.15 } as const;

/**
 * 사주 지지 기반 조후 보정 승수를 오행별로 계산
 *
 * 각 지지가 나타내는 "국소 계절"의 旺相休囚死를 구한 뒤,
 * 위치별 가중치(월지 >> 일지 > 연지 > 시지)로 혼합하여
 * 최종 승수(modifier)를 반환한다.
 */
export function calculateJohuModifiers(fourPillars: FourPillars): ElementDistribution {
  const elements: FiveElement[] = ['wood', 'fire', 'earth', 'metal', 'water'];

  const branches = fourPillars.hour !== null
    ? [
        { season: fourPillars.month.branchElement, w: JOHU_POS_WITH_HOUR.month },
        { season: fourPillars.day.branchElement,   w: JOHU_POS_WITH_HOUR.day },
        { season: fourPillars.year.branchElement,  w: JOHU_POS_WITH_HOUR.year },
        { season: fourPillars.hour.branchElement,  w: JOHU_POS_WITH_HOUR.hour },
      ]
    : [
        { season: fourPillars.month.branchElement, w: JOHU_POS_WITHOUT_HOUR.month },
        { season: fourPillars.day.branchElement,   w: JOHU_POS_WITHOUT_HOUR.day },
        { season: fourPillars.year.branchElement,  w: JOHU_POS_WITHOUT_HOUR.year },
      ];

  const modifiers: ElementDistribution = { wood: 1, fire: 1, earth: 1, metal: 1, water: 1 };

  for (const el of elements) {
    let delta = 0;
    for (const b of branches) {
      delta += b.w * JOHU_DELTA[getJohuState(b.season, el)];
    }
    modifiers[el] = 1 + delta;
  }

  return modifiers;
}

export function calculateElementDistribution(fourPillars: FourPillars): ElementDistribution {
  const dist: ElementDistribution = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };

  const add = (element: FiveElement, weight: number) => {
    dist[element] += weight;
  };

  if (fourPillars.hour !== null) {
    const w = WEIGHTS_WITH_HOUR;
    add(fourPillars.year.stemElement,    w.yearStem);
    add(fourPillars.year.branchElement,  w.yearBranch);
    add(fourPillars.month.stemElement,   w.monthStem);
    add(fourPillars.month.branchElement, w.monthBranch);
    add(fourPillars.day.stemElement,     w.dayStem);
    add(fourPillars.day.branchElement,   w.dayBranch);
    add(fourPillars.hour.stemElement,    w.hourStem);
    add(fourPillars.hour.branchElement,  w.hourBranch);
  } else {
    const w = WEIGHTS_WITHOUT_HOUR;
    add(fourPillars.year.stemElement,    w.yearStem);
    add(fourPillars.year.branchElement,  w.yearBranch);
    add(fourPillars.month.stemElement,   w.monthStem);
    add(fourPillars.month.branchElement, w.monthBranch);
    add(fourPillars.day.stemElement,     w.dayStem);
    add(fourPillars.day.branchElement,   w.dayBranch);
  }

  // 1) 토(Earth) 구조적 편향 보정 (지지 12개 중 토가 4개 — 통계적 과대 대표)
  dist.earth = dist.earth * EARTH_CORRECTION;

  // 2) 조후(調候) 보정 — 계절(지지)에 따른 오행 강약 반영
  const johuMod = calculateJohuModifiers(fourPillars);
  const allElements: FiveElement[] = ['wood', 'fire', 'earth', 'metal', 'water'];
  for (const el of allElements) {
    dist[el] *= johuMod[el];
  }

  return dist;
}

export function calculateElementRanks(distribution: ElementDistribution): ElementRanks {
  const elements: FiveElement[] = ['wood', 'fire', 'earth', 'metal', 'water'];

  // 내림차순 정렬 후 순위 부여 (동점이면 동일 순위)
  const sorted = [...elements].sort((a, b) => distribution[b] - distribution[a]);

  const ranks: ElementRanks = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  let currentRank = 1;

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && distribution[sorted[i]] < distribution[sorted[i - 1]]) {
      currentRank = i + 1;
    }
    ranks[sorted[i]] = currentRank;
  }

  return ranks;
}

export function getDominantElement(ranks: ElementRanks): FiveElement {
  const elements: FiveElement[] = ['wood', 'fire', 'earth', 'metal', 'water'];
  return elements.reduce((prev, curr) =>
    ranks[curr] < ranks[prev] ? curr : prev
  );
}

export function getWeakestElement(ranks: ElementRanks): FiveElement {
  const elements: FiveElement[] = ['wood', 'fire', 'earth', 'metal', 'water'];
  return elements.reduce((prev, curr) =>
    ranks[curr] > ranks[prev] ? curr : prev
  );
}
