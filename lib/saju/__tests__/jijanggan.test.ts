import type { EarthlyBranch } from '@/types/saju';
import { getHiddenStems, getBranchElementDistribution } from '../jijanggan';
import { BRANCH_ELEMENT } from '../element-map';

describe('지장간(支藏干) 테이블 검증', () => {
  const allBranches: EarthlyBranch[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  // 1. 12지지 ratio 합 검증
  describe('ratio 합 = 1.0', () => {
    test.each(allBranches)('지지 %s의 지장간 ratio 합 = 1.0', (branch) => {
      const stems = getHiddenStems(branch);
      const sum = stems.reduce((s, hs) => s + hs.ratio, 0);
      expect(sum).toBeCloseTo(1.0, 10);
    });
  });

  // 2. 정기-BRANCH_ELEMENT 일치성
  describe('정기 오행 = BRANCH_ELEMENT', () => {
    test.each(allBranches)('지지 %s의 정기 오행 = BRANCH_ELEMENT', (branch) => {
      const stems = getHiddenStems(branch);
      const junggi = stems[stems.length - 1]; // 마지막 항목 = 정기
      expect(junggi.element).toBe(BRANCH_ELEMENT[branch]);
    });
  });

  // 3. 왕지/생지/고지 천간 개수
  describe('지지 종류별 지장간 개수', () => {
    // 왕지(子午卯酉): 子=2개, 午=3개(3기설), 卯=2개, 酉=2개
    test('왕지 子는 지장간 2개', () => {
      expect(getHiddenStems('子').length).toBe(2);
    });
    test('왕지 午는 지장간 3개 (3기설)', () => {
      expect(getHiddenStems('午').length).toBe(3);
    });
    test('왕지 卯는 지장간 2개', () => {
      expect(getHiddenStems('卯').length).toBe(2);
    });
    test('왕지 酉는 지장간 2개', () => {
      expect(getHiddenStems('酉').length).toBe(2);
    });

    // 생지(寅申巳亥): 모두 3개
    test.each(['寅', '申', '巳', '亥'] as EarthlyBranch[])('생지 %s는 지장간 3개', (branch) => {
      expect(getHiddenStems(branch).length).toBe(3);
    });

    // 고지(辰戌丑未): 모두 3개
    test.each(['辰', '戌', '丑', '未'] as EarthlyBranch[])('고지 %s는 지장간 3개', (branch) => {
      expect(getHiddenStems(branch).length).toBe(3);
    });
  });

  // 4. getBranchElementDistribution 스냅샷
  describe('getBranchElementDistribution 스냅샷', () => {
    test('寅 → wood:16/30, fire:7/30, earth:7/30, metal:0, water:0', () => {
      const dist = getBranchElementDistribution('寅');
      expect(dist.wood).toBeCloseTo(16 / 30, 10);
      expect(dist.fire).toBeCloseTo(7 / 30, 10);
      expect(dist.earth).toBeCloseTo(7 / 30, 10);
      expect(dist.metal).toBeCloseTo(0, 10);
      expect(dist.water).toBeCloseTo(0, 10);
    });

    test('子 → water:1.0, 나머지 0', () => {
      const dist = getBranchElementDistribution('子');
      expect(dist.wood).toBeCloseTo(0, 10);
      expect(dist.fire).toBeCloseTo(0, 10);
      expect(dist.earth).toBeCloseTo(0, 10);
      expect(dist.metal).toBeCloseTo(0, 10);
      expect(dist.water).toBeCloseTo(1.0, 10);
    });

    test('午 → fire:21/30, earth:9/30, 나머지 0 (3기설)', () => {
      const dist = getBranchElementDistribution('午');
      expect(dist.wood).toBeCloseTo(0, 10);
      expect(dist.fire).toBeCloseTo(21 / 30, 10);
      expect(dist.earth).toBeCloseTo(9 / 30, 10);
      expect(dist.metal).toBeCloseTo(0, 10);
      expect(dist.water).toBeCloseTo(0, 10);
    });
  });

  // 5. 모든 지지의 분포 합도 1.0
  describe('getBranchElementDistribution 오행 합 = 1.0', () => {
    test.each(allBranches)('지지 %s의 오행 분포 합 = 1.0', (branch) => {
      const dist = getBranchElementDistribution(branch);
      const sum = dist.wood + dist.fire + dist.earth + dist.metal + dist.water;
      expect(sum).toBeCloseTo(1.0, 10);
    });
  });
});
