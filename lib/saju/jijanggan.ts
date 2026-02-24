// 지장간(支藏干) — Hidden Stems within Earthly Branches
//
// 각 지지의 정기(正氣) 천간 오행은 element-map.ts의 BRANCH_ELEMENT과 일치해야 함
// 子→癸(水), 丑→己(土), 寅→甲(木), 卯→乙(木), 辰→戊(土), 巳→丙(火)
// 午→丁(火), 未→己(土), 申→庚(金), 酉→辛(金), 戌→戊(土), 亥→壬(水)

import type { HeavenlyStem, EarthlyBranch, FiveElement, ElementDistribution } from '@/types/saju';
import { STEM_ELEMENT } from './element-map';

export interface HiddenStem {
  stem: HeavenlyStem;
  element: FiveElement;
  ratio: number; // 일수/30 (0~1)
}

// 순서: 여기(餘氣) → 중기(中氣) → 정기(正氣)
export const JIJANGGAN_TABLE: Record<EarthlyBranch, HiddenStem[]> = {
  // 子: 壬(여기 10일) + 癸(정기 20일)
  '子': [
    { stem: '壬', element: STEM_ELEMENT['壬'], ratio: 10 / 30 },
    { stem: '癸', element: STEM_ELEMENT['癸'], ratio: 20 / 30 },
  ],

  // 丑: 癸(여기 9일) + 辛(중기 3일) + 己(정기 18일)
  '丑': [
    { stem: '癸', element: STEM_ELEMENT['癸'], ratio: 9 / 30 },
    { stem: '辛', element: STEM_ELEMENT['辛'], ratio: 3 / 30 },
    { stem: '己', element: STEM_ELEMENT['己'], ratio: 18 / 30 },
  ],

  // 寅: 戊(여기 7일) + 丙(중기 7일) + 甲(정기 16일)
  '寅': [
    { stem: '戊', element: STEM_ELEMENT['戊'], ratio: 7 / 30 },
    { stem: '丙', element: STEM_ELEMENT['丙'], ratio: 7 / 30 },
    { stem: '甲', element: STEM_ELEMENT['甲'], ratio: 16 / 30 },
  ],

  // 卯: 甲(여기 10일) + 乙(정기 20일)
  '卯': [
    { stem: '甲', element: STEM_ELEMENT['甲'], ratio: 10 / 30 },
    { stem: '乙', element: STEM_ELEMENT['乙'], ratio: 20 / 30 },
  ],

  // 辰: 乙(여기 9일) + 癸(중기 3일) + 戊(정기 18일)
  '辰': [
    { stem: '乙', element: STEM_ELEMENT['乙'], ratio: 9 / 30 },
    { stem: '癸', element: STEM_ELEMENT['癸'], ratio: 3 / 30 },
    { stem: '戊', element: STEM_ELEMENT['戊'], ratio: 18 / 30 },
  ],

  // 巳: 戊(여기 7일) + 庚(중기 7일) + 丙(정기 16일)
  '巳': [
    { stem: '戊', element: STEM_ELEMENT['戊'], ratio: 7 / 30 },
    { stem: '庚', element: STEM_ELEMENT['庚'], ratio: 7 / 30 },
    { stem: '丙', element: STEM_ELEMENT['丙'], ratio: 16 / 30 },
  ],

  // 午: 3기설 채택 — 丙(여기 10일) + 己(중기 9일) + 丁(정기 11일)
  // 출처: 연해자평(淵海子平) / 삼명통회(三命通會) 계통
  '午': [
    { stem: '丙', element: STEM_ELEMENT['丙'], ratio: 10 / 30 },
    { stem: '己', element: STEM_ELEMENT['己'], ratio: 9 / 30 },
    { stem: '丁', element: STEM_ELEMENT['丁'], ratio: 11 / 30 },
  ],

  // 未: 丁(여기 9일) + 乙(중기 3일) + 己(정기 18일)
  '未': [
    { stem: '丁', element: STEM_ELEMENT['丁'], ratio: 9 / 30 },
    { stem: '乙', element: STEM_ELEMENT['乙'], ratio: 3 / 30 },
    { stem: '己', element: STEM_ELEMENT['己'], ratio: 18 / 30 },
  ],

  // 申: 己(여기 7일) + 壬(중기 7일) + 庚(정기 16일)
  '申': [
    { stem: '己', element: STEM_ELEMENT['己'], ratio: 7 / 30 },
    { stem: '壬', element: STEM_ELEMENT['壬'], ratio: 7 / 30 },
    { stem: '庚', element: STEM_ELEMENT['庚'], ratio: 16 / 30 },
  ],

  // 酉: 庚(여기 10일) + 辛(정기 20일)
  '酉': [
    { stem: '庚', element: STEM_ELEMENT['庚'], ratio: 10 / 30 },
    { stem: '辛', element: STEM_ELEMENT['辛'], ratio: 20 / 30 },
  ],

  // 戌: 辛(여기 9일) + 丁(중기 3일) + 戊(정기 18일)
  '戌': [
    { stem: '辛', element: STEM_ELEMENT['辛'], ratio: 9 / 30 },
    { stem: '丁', element: STEM_ELEMENT['丁'], ratio: 3 / 30 },
    { stem: '戊', element: STEM_ELEMENT['戊'], ratio: 18 / 30 },
  ],

  // 亥: 戊(여기 7일) + 甲(중기 7일) + 壬(정기 16일)
  '亥': [
    { stem: '戊', element: STEM_ELEMENT['戊'], ratio: 7 / 30 },
    { stem: '甲', element: STEM_ELEMENT['甲'], ratio: 7 / 30 },
    { stem: '壬', element: STEM_ELEMENT['壬'], ratio: 16 / 30 },
  ],
};

/** 지지의 지장간 목록 반환 */
export function getHiddenStems(branch: EarthlyBranch): HiddenStem[] {
  return JIJANGGAN_TABLE[branch];
}

/** 지지 하나의 오행 분배 비율 반환 (합=1.0) */
export function getBranchElementDistribution(branch: EarthlyBranch): ElementDistribution {
  const dist: ElementDistribution = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  for (const hs of JIJANGGAN_TABLE[branch]) {
    dist[hs.element] += hs.ratio;
  }
  return dist;
}
