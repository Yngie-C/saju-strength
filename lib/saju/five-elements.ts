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

  // 토(Earth) 편향 보정
  dist.earth = dist.earth * EARTH_CORRECTION;

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
