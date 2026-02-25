import type { FourPillars, FiveElement } from '@/types/saju';
import {
  calculateElementDistribution,
  calculateJohuModifiers,
  calculateElementRanks,
  getDominantElement,
  getWeakestElement,
} from '../five-elements';

// 테스트용 사주 1: 甲寅年 丙午月 庚申日 壬子時
// 천간: 甲(목) 丙(화) 庚(금) 壬(수)
// 지지: 寅(목) 午(화) 申(금) 子(수)
const testPillars1: FourPillars = {
  year:  { stem: '甲', branch: '寅', stemElement: 'wood',  branchElement: 'wood',  stemYinYang: 'yang' },
  month: { stem: '丙', branch: '午', stemElement: 'fire',  branchElement: 'fire',  stemYinYang: 'yang' },
  day:   { stem: '庚', branch: '申', stemElement: 'metal', branchElement: 'metal', stemYinYang: 'yang' },
  hour:  { stem: '壬', branch: '子', stemElement: 'water', branchElement: 'water', stemYinYang: 'yang' },
};

// 테스트용 사주 2: 시주 없음 — 甲寅年 丙午月 庚申日
const testPillars2: FourPillars = {
  year:  { stem: '甲', branch: '寅', stemElement: 'wood',  branchElement: 'wood',  stemYinYang: 'yang' },
  month: { stem: '丙', branch: '午', stemElement: 'fire',  branchElement: 'fire',  stemYinYang: 'yang' },
  day:   { stem: '庚', branch: '申', stemElement: 'metal', branchElement: 'metal', stemYinYang: 'yang' },
  hour:  null,
};

// 테스트용 사주 3: 오행 순위 검증 — 木이 압도적으로 강한 사주
// 甲寅年 乙卯月 甲寅日 乙卯時
const testPillars3: FourPillars = {
  year:  { stem: '甲', branch: '寅', stemElement: 'wood', branchElement: 'wood', stemYinYang: 'yang' },
  month: { stem: '乙', branch: '卯', stemElement: 'wood', branchElement: 'wood', stemYinYang: 'yin'  },
  day:   { stem: '甲', branch: '寅', stemElement: 'wood', branchElement: 'wood', stemYinYang: 'yang' },
  hour:  { stem: '乙', branch: '卯', stemElement: 'wood', branchElement: 'wood', stemYinYang: 'yin'  },
};

// 타겟 사주: 1991.5.14 미시 — 辛未年 癸巳月 甲申日 辛未時 (일간: 甲木)
const targetPillars: FourPillars = {
  year:  { stem: '辛', branch: '未', stemElement: 'metal', branchElement: 'earth', stemYinYang: 'yin'  },
  month: { stem: '癸', branch: '巳', stemElement: 'water', branchElement: 'fire',  stemYinYang: 'yin'  },
  day:   { stem: '甲', branch: '申', stemElement: 'wood',  branchElement: 'metal', stemYinYang: 'yang' },
  hour:  { stem: '辛', branch: '未', stemElement: 'metal', branchElement: 'earth', stemYinYang: 'yin'  },
};

describe('calculateElementDistribution()', () => {
  describe('시주 있는 사주 (甲寅丙午庚申壬子)', () => {
    let dist: ReturnType<typeof calculateElementDistribution>;

    beforeEach(() => {
      dist = calculateElementDistribution(testPillars1);
    });

    test('모든 오행 값이 0 이상', () => {
      const elements: FiveElement[] = ['wood', 'fire', 'earth', 'metal', 'water'];
      for (const el of elements) {
        expect(dist[el]).toBeGreaterThanOrEqual(0);
      }
    });

    test('오행 총합이 양수 범위 내 (> 0)', () => {
      const total = dist.wood + dist.fire + dist.earth + dist.metal + dist.water;
      expect(total).toBeGreaterThan(0);
    });

    test('조후 보정 + 계절 기운 가산 후 총합이 합리적 범위 내', () => {
      // 시주 있을 때 원시 가중치 총합: 13 + 계절 기운 가산(1.5) = 14.5 기준
      // 조후 보정으로 변동 가능하므로 넉넉한 범위 설정
      const total = dist.wood + dist.fire + dist.earth + dist.metal + dist.water;
      expect(total).toBeGreaterThan(5);
      expect(total).toBeLessThan(25);
    });

    test('4 사주가 균등 배분이라 특정 오행이 극단적으로 높지 않음 (< 총합의 60%)', () => {
      const total = dist.wood + dist.fire + dist.earth + dist.metal + dist.water;
      const elements: FiveElement[] = ['wood', 'fire', 'earth', 'metal', 'water'];
      for (const el of elements) {
        expect(dist[el]).toBeLessThan(total * 0.6);
      }
    });
  });

  describe('시주 없는 사주 (甲寅丙午庚申)', () => {
    let dist: ReturnType<typeof calculateElementDistribution>;

    beforeEach(() => {
      dist = calculateElementDistribution(testPillars2);
    });

    test('에러 없이 계산 완료', () => {
      expect(dist).toBeDefined();
    });

    test('모든 오행 값이 0 이상', () => {
      const elements: FiveElement[] = ['wood', 'fire', 'earth', 'metal', 'water'];
      for (const el of elements) {
        expect(dist[el]).toBeGreaterThanOrEqual(0);
      }
    });

    test('총합이 양수', () => {
      const total = dist.wood + dist.fire + dist.earth + dist.metal + dist.water;
      expect(total).toBeGreaterThan(0);
    });

    test('시주 있을 때와 개별 오행 분포가 다름 (가중치 다름)', () => {
      const distWithHour = calculateElementDistribution(testPillars1);
      // 동일한 연/월/일 기둥이지만 가중치 차이로 최소 하나의 오행 값이 달라야 함
      const elements: FiveElement[] = ['wood', 'fire', 'earth', 'metal', 'water'];
      const hasDifference = elements.some(
        (el) => Math.abs(distWithHour[el] - dist[el]) > 0.001
      );
      expect(hasDifference).toBe(true);
    });
  });

  describe('목(木) 강한 사주 (甲寅乙卯甲寅乙卯)', () => {
    test('목(wood)이 가장 높은 값을 가짐', () => {
      const dist = calculateElementDistribution(testPillars3);
      const elements: FiveElement[] = ['fire', 'earth', 'metal', 'water'];
      for (const el of elements) {
        expect(dist.wood).toBeGreaterThan(dist[el]);
      }
    });
  });

  describe('巳月 타겟 사주 (辛未癸巳甲申辛未 — 1991.5.14 미시)', () => {
    test('fire와 metal이 모두 상위권 (각각 3위 이내)', () => {
      const dist = calculateElementDistribution(targetPillars);
      const ranks = calculateElementRanks(dist);
      expect(ranks.fire).toBeLessThanOrEqual(3);
      expect(ranks.metal).toBeLessThanOrEqual(2);
    });

    test('metal이 1위', () => {
      const dist = calculateElementDistribution(targetPillars);
      const ranks = calculateElementRanks(dist);
      expect(ranks.metal).toBe(1);
    });

    test('fire가 꼴찌(5위)가 아님', () => {
      const dist = calculateElementDistribution(targetPillars);
      const ranks = calculateElementRanks(dist);
      expect(ranks.fire).not.toBe(5);
    });

    test('fire 절대값이 계절 기운 가산으로 의미 있는 수준', () => {
      const dist = calculateElementDistribution(targetPillars);
      // 巳月 계절 기운 가산(1.5)이 적용되어 fire가 2.5 이상이어야 함
      expect(dist.fire).toBeGreaterThan(2.5);
    });
  });
});

describe('calculateJohuModifiers()', () => {
  test('시주 있는 사주 — 모든 승수가 이론적 범위 [0.50, 1.60] 내', () => {
    const mods = calculateJohuModifiers(testPillars1);
    const elements: FiveElement[] = ['wood', 'fire', 'earth', 'metal', 'water'];
    for (const el of elements) {
      expect(mods[el]).toBeGreaterThanOrEqual(0.50);
      expect(mods[el]).toBeLessThanOrEqual(1.60);
    }
  });

  test('시주 없는 사주 — 모든 승수가 이론적 범위 [0.50, 1.60] 내', () => {
    const mods = calculateJohuModifiers(testPillars2);
    const elements: FiveElement[] = ['wood', 'fire', 'earth', 'metal', 'water'];
    for (const el of elements) {
      expect(mods[el]).toBeGreaterThanOrEqual(0.50);
      expect(mods[el]).toBeLessThanOrEqual(1.60);
    }
  });

  test('반환값이 5개의 오행 키를 모두 포함', () => {
    const mods = calculateJohuModifiers(testPillars1);
    expect(mods).toHaveProperty('wood');
    expect(mods).toHaveProperty('fire');
    expect(mods).toHaveProperty('earth');
    expect(mods).toHaveProperty('metal');
    expect(mods).toHaveProperty('water');
  });

  test('午月(화) 기준: 화(fire) 승수가 1.15 이상 (旺 상태)', () => {
    // 午月이 가장 높은 가중치(0.50)를 가지며 fire는 旺(+0.60) → 승수 최소 1.15+
    const mods = calculateJohuModifiers(testPillars1);
    expect(mods.fire).toBeGreaterThanOrEqual(1.15);
  });

  test('巳月 타겟 사주 — fire 승수 > 1.0 (旺 상태)', () => {
    const mods = calculateJohuModifiers(targetPillars);
    expect(mods.fire).toBeGreaterThan(1.0);
  });

  test('巳月 타겟 사주 — metal 승수 < 1.0 (巳月 火克金으로 약화)', () => {
    const mods = calculateJohuModifiers(targetPillars);
    expect(mods.metal).toBeLessThan(1.0);
  });
});

describe('4계절 교차 검증 — 계절 오행이 상위권', () => {
  // 봄(卯月): wood가 旺
  const springPillars: FourPillars = {
    year:  { stem: '甲', branch: '寅', stemElement: 'wood',  branchElement: 'wood',  stemYinYang: 'yang' },
    month: { stem: '丙', branch: '卯', stemElement: 'fire',  branchElement: 'wood',  stemYinYang: 'yang' },
    day:   { stem: '庚', branch: '申', stemElement: 'metal', branchElement: 'metal', stemYinYang: 'yang' },
    hour:  { stem: '壬', branch: '子', stemElement: 'water', branchElement: 'water', stemYinYang: 'yang' },
  };

  // 가을(酉月): metal이 旺
  const autumnPillars: FourPillars = {
    year:  { stem: '甲', branch: '辰', stemElement: 'wood',  branchElement: 'earth', stemYinYang: 'yang' },
    month: { stem: '癸', branch: '酉', stemElement: 'water', branchElement: 'metal', stemYinYang: 'yin'  },
    day:   { stem: '丙', branch: '午', stemElement: 'fire',  branchElement: 'fire',  stemYinYang: 'yang' },
    hour:  { stem: '戊', branch: '戌', stemElement: 'earth', branchElement: 'earth', stemYinYang: 'yang' },
  };

  // 겨울(子月): water가 旺
  const winterPillars: FourPillars = {
    year:  { stem: '庚', branch: '申', stemElement: 'metal', branchElement: 'metal', stemYinYang: 'yang' },
    month: { stem: '戊', branch: '子', stemElement: 'earth', branchElement: 'water', stemYinYang: 'yang' },
    day:   { stem: '乙', branch: '卯', stemElement: 'wood',  branchElement: 'wood',  stemYinYang: 'yin'  },
    hour:  { stem: '丁', branch: '亥', stemElement: 'fire',  branchElement: 'water', stemYinYang: 'yin'  },
  };

  test('봄(卯月) — wood 승수 > 1.0, metal 승수 < 1.0', () => {
    const mods = calculateJohuModifiers(springPillars);
    expect(mods.wood).toBeGreaterThan(1.0);
    expect(mods.metal).toBeLessThan(1.0);
  });

  test('여름(巳月) — fire 승수 > 1.0', () => {
    const mods = calculateJohuModifiers(targetPillars);
    expect(mods.fire).toBeGreaterThan(1.0);
  });

  test('가을(酉月) — metal 승수 > 1.0, wood 승수 < 1.0', () => {
    const mods = calculateJohuModifiers(autumnPillars);
    expect(mods.metal).toBeGreaterThan(1.0);
    expect(mods.wood).toBeLessThan(1.0);
  });

  test('겨울(子月) — water 승수 > 1.0, fire 승수 < 1.0', () => {
    const mods = calculateJohuModifiers(winterPillars);
    expect(mods.water).toBeGreaterThan(1.0);
    expect(mods.fire).toBeLessThan(1.0);
  });

  test('봄(卯月) — 계절 기운 가산으로 wood가 상위권', () => {
    const dist = calculateElementDistribution(springPillars);
    const ranks = calculateElementRanks(dist);
    expect(ranks.wood).toBeLessThanOrEqual(2);
  });

  test('가을(酉月) — 계절 기운 가산으로 metal이 상위권 (3위 이내)', () => {
    const dist = calculateElementDistribution(autumnPillars);
    const ranks = calculateElementRanks(dist);
    // 이 사주는 丙(화) 일간 + 午(화) 일지로 fire가 본래 강하므로 metal은 3위까지 허용
    expect(ranks.metal).toBeLessThanOrEqual(3);
  });

  test('겨울(子月) — 계절 기운 가산으로 water가 상위권', () => {
    const dist = calculateElementDistribution(winterPillars);
    const ranks = calculateElementRanks(dist);
    expect(ranks.water).toBeLessThanOrEqual(2);
  });
});

describe('calculateElementRanks()', () => {
  test('모든 오행에 순위 1~5 부여', () => {
    const dist = calculateElementDistribution(testPillars1);
    const ranks = calculateElementRanks(dist);
    const elements: FiveElement[] = ['wood', 'fire', 'earth', 'metal', 'water'];
    for (const el of elements) {
      expect(ranks[el]).toBeGreaterThanOrEqual(1);
      expect(ranks[el]).toBeLessThanOrEqual(5);
    }
  });

  test('목(木) 강한 사주에서 wood 순위 = 1', () => {
    const dist = calculateElementDistribution(testPillars3);
    const ranks = calculateElementRanks(dist);
    expect(ranks.wood).toBe(1);
  });

  test('동점인 오행은 동일 순위', () => {
    const equalDist = { wood: 5, fire: 5, earth: 3, metal: 3, water: 1 };
    const ranks = calculateElementRanks(equalDist);
    expect(ranks.wood).toBe(ranks.fire);  // 동점 1위
    expect(ranks.earth).toBe(ranks.metal); // 동점 3위
    expect(ranks.water).toBe(5);
  });
});

describe('getDominantElement() / getWeakestElement()', () => {
  test('목(木) 강한 사주 — getDominantElement = wood', () => {
    const dist = calculateElementDistribution(testPillars3);
    const ranks = calculateElementRanks(dist);
    expect(getDominantElement(ranks)).toBe('wood');
  });

  test('목(木) 강한 사주 — getWeakestElement는 wood가 아님', () => {
    const dist = calculateElementDistribution(testPillars3);
    const ranks = calculateElementRanks(dist);
    expect(getWeakestElement(ranks)).not.toBe('wood');
  });

  test('단일 오행만 존재하는 분포 — dominant와 weakest 반환', () => {
    const singleDist = { wood: 10, fire: 0, earth: 0, metal: 0, water: 0 };
    const ranks = calculateElementRanks(singleDist);
    expect(getDominantElement(ranks)).toBe('wood');
  });

  test('getDominantElement와 getWeakestElement는 서로 다른 오행 (분포가 고르지 않을 때)', () => {
    const dist = calculateElementDistribution(testPillars1);
    const ranks = calculateElementRanks(dist);
    expect(getDominantElement(ranks)).not.toBe(getWeakestElement(ranks));
  });
});
