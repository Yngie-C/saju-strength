/** Five Elements */
export type FiveElement = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

/** Yin-Yang polarity */
export type YinYang = 'yang' | 'yin';

/** Ten Heavenly Stems */
export type HeavenlyStem = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';

/** Twelve Earthly Branches */
export type EarthlyBranch = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';

/** A single pillar (stem + branch) */
export interface Pillar {
  stem: HeavenlyStem;
  branch: EarthlyBranch;
  stemElement: FiveElement;
  branchElement: FiveElement;
  stemYinYang: YinYang;
}

/** Complete Four Pillars chart */
export interface FourPillars {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar | null; // null when birth hour unknown
}

/** Five Elements distribution (weighted counts) */
export interface ElementDistribution {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
}

/** Five Elements ranks (1=highest) */
export interface ElementRanks {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
}

/** Day Master archetype */
export interface DayMasterArchetype {
  stem: HeavenlyStem;
  element: FiveElement;
  yinYang: YinYang;
  name: string;       // e.g., "선구자"
  nameEn: string;     // e.g., "Pioneer"
  keywords: string[];
  description: string;
  strengths: string[];
  weaknesses: string[];
  image: string;      // Metaphorical image, e.g., "하늘을 향해 뻗는 거대한 나무"
}

/** Complete Saju analysis result */
export interface SajuAnalysis {
  sessionId: string;
  fourPillars: FourPillars;
  dayMaster: DayMasterArchetype;
  elementDistribution: ElementDistribution;
  elementRanks: ElementRanks;
  dominantElement: FiveElement;
  weakestElement: FiveElement;
  birthHourKnown: boolean;
  analyzedAt: Date;
}

/** Birth input from user */
export interface BirthInput {
  year: number;
  month: number;
  day: number;
  hour: number | null;  // null = unknown
  gender: 'male' | 'female';
  isLunar: boolean;
}

/** Cross-analysis type */
export type CrossAnalysisType = 'alignment' | 'potential' | 'developed' | 'undeveloped';

/** Single axis cross-analysis result */
export interface AxisAnalysis {
  element: FiveElement;
  psaCategory: string;
  elementRank: number;
  psaRank: number;
  type: CrossAnalysisType;
  insight: string;
}

/** Complete combined analysis */
export interface CombinedAnalysis {
  sessionId: string;
  axes: AxisAnalysis[];
  alignments: AxisAnalysis[];
  potentials: AxisAnalysis[];
  developed: AxisAnalysis[];
  undeveloped: AxisAnalysis[];
  growthGuide: string;
  analyzedAt: Date;
}
