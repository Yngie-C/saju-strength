import type { FourPillars, ElementDistribution, ElementRanks, FiveElement, EarthlyBranch } from '@/types/saju';
import { getBranchElementDistribution } from './jijanggan';

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

/**
 * 旺相休囚死 보정 편차 (1.0 기준)
 *
 * 전통 비율 10:7:5:3:1.5 → 정규화 2.0:1.4:1.0:0.6:0.3에 근사
 * 旺/死 비율 = 1.60/0.50 = 3.20x (전통 5~10x과 현대 SW 2.0x 사이 균형점)
 */
const JOHU_DELTA: Record<JohuState, number> = {
  wang:   0.60,   // 旺: +60%  (계절과 동일 — 한창 왕성)
  xiang:  0.25,   // 相: +25%  (계절이 생하는 오행 — 기세를 받음)
  xiu:    0.00,   // 休: ±0%   (계절을 생하는 오행 — 쉬는 상태, 기준선)
  qiu:   -0.30,   // 囚: -30%  (계절을 극하는 오행 — 갇힌 상태)
  si:    -0.50,   // 死: -50%  (계절에 극당하는 오행 — 힘을 잃음)
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

  /** 지지의 가중치를 지장간 비율로 분배 */
  const addBranch = (branch: EarthlyBranch, weight: number) => {
    const branchDist = getBranchElementDistribution(branch);
    const elements: FiveElement[] = ['wood', 'fire', 'earth', 'metal', 'water'];
    for (const el of elements) {
      if (branchDist[el] > 0) {
        dist[el] += branchDist[el] * weight;
      }
    }
  };

  if (fourPillars.hour !== null) {
    const w = WEIGHTS_WITH_HOUR;
    // 천간: 1:1 매핑 (변경 없음)
    add(fourPillars.year.stemElement,  w.yearStem);
    add(fourPillars.month.stemElement, w.monthStem);
    add(fourPillars.day.stemElement,   w.dayStem);
    add(fourPillars.hour.stemElement,  w.hourStem);
    // 지지: 지장간 비율 분배 (寅 → 甲木53% + 丙火23% + 戊土23%)
    addBranch(fourPillars.year.branch,  w.yearBranch);
    addBranch(fourPillars.month.branch, w.monthBranch);
    addBranch(fourPillars.day.branch,   w.dayBranch);
    addBranch(fourPillars.hour.branch,  w.hourBranch);
  } else {
    const w = WEIGHTS_WITHOUT_HOUR;
    add(fourPillars.year.stemElement,  w.yearStem);
    add(fourPillars.month.stemElement, w.monthStem);
    add(fourPillars.day.stemElement,   w.dayStem);
    addBranch(fourPillars.year.branch,  w.yearBranch);
    addBranch(fourPillars.month.branch, w.monthBranch);
    addBranch(fourPillars.day.branch,   w.dayBranch);
  }

  // 조후(調候) 보정 Phase 1 — 旺相休囚死 승수 보정
  const johuMod = calculateJohuModifiers(fourPillars);
  const allElements: FiveElement[] = ['wood', 'fire', 'earth', 'metal', 'water'];
  for (const el of allElements) {
    dist[el] *= johuMod[el];
  }

  // 조후(調候) 보정 Phase 2 — 계절 기운 가산(加算)
  // 전통 조후론: 계절의 기운은 사주 전체에 스며들어 있다.
  // 승수 보정만으로는 원시 점수가 낮은 오행의 계절 영향을 충분히 반영하지 못하므로,
  // 월지의 계절 오행에 flat bonus를 가산한다.
  const SEASONAL_QI_BONUS = fourPillars.hour !== null ? 1.5 : 1.2;
  const monthSeasonElement = fourPillars.month.branchElement;
  dist[monthSeasonElement] += SEASONAL_QI_BONUS;

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
