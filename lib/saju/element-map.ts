import type { FiveElement, YinYang, HeavenlyStem, EarthlyBranch } from '@/types/saju';

export const STEM_ELEMENT: Record<HeavenlyStem, FiveElement> = {
  '甲': 'wood', '乙': 'wood',
  '丙': 'fire', '丁': 'fire',
  '戊': 'earth', '己': 'earth',
  '庚': 'metal', '辛': 'metal',
  '壬': 'water', '癸': 'water',
};

export const BRANCH_ELEMENT: Record<EarthlyBranch, FiveElement> = {
  '子': 'water', '丑': 'earth',
  '寅': 'wood',  '卯': 'wood',
  '辰': 'earth', '巳': 'fire',
  '午': 'fire',  '未': 'earth',
  '申': 'metal', '酉': 'metal',
  '戌': 'earth', '亥': 'water',
};

export const STEM_YINYANG: Record<HeavenlyStem, YinYang> = {
  '甲': 'yang', '乙': 'yin',
  '丙': 'yang', '丁': 'yin',
  '戊': 'yang', '己': 'yin',
  '庚': 'yang', '辛': 'yin',
  '壬': 'yang', '癸': 'yin',
};

export function getStemElement(stem: HeavenlyStem): FiveElement {
  return STEM_ELEMENT[stem];
}

export function getBranchElement(branch: EarthlyBranch): FiveElement {
  return BRANCH_ELEMENT[branch];
}

export function getStemYinYang(stem: HeavenlyStem): YinYang {
  return STEM_YINYANG[stem];
}
