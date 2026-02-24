// ==========================================
// Premium Report Type Definitions
// ==========================================

export interface PremiumReport {
  sessionId: string;
  personaDeepDive: PersonaDeepDive;
  growthRoadmap: GrowthRoadmap;
  brandingProfile: BrandingProfile;
  detailedAxes: DetailedAxisAnalysis[];
  strengthScenarios: StrengthScenario[];
  generatedAt: Date;
}

export interface PersonaDeepDive {
  personaType: string;
  personaTitle: string;
  coreIdentity: string;          // 핵심 정체성 설명
  hiddenStrengths: string[];     // 숨겨진 강점 3가지
  blindSpots: string[];          // 주의할 맹점 2가지
  idealEnvironment: string;      // 최적 환경
  famousArchetypes: string[];    // 비슷한 유형의 유명인/캐릭터 (fictional)
}

export interface GrowthRoadmap {
  weeklyPlan: Array<{
    week: number;
    theme: string;
    actions: string[];
    reflection: string;
  }>;
  longTermVision: string;
}

export interface BrandingProfile {
  tagline: string;              // 한 줄 자기소개
  elevatorPitch: string;        // 30초 자기소개
  keywords: string[];           // 5개 핵심 키워드
  strengthStatement: string;    // "나는 ___하는 사람입니다"
}

export interface DetailedAxisAnalysis {
  element: string;
  psaCategory: string;
  type: string;
  basicInsight: string;
  detailedInsight: string;      // 2-3문장 확장 해설
  actionTip: string;            // 구체적 실천 팁
}

export interface StrengthScenario {
  scenario: string;             // 상황 설명
  strengthUsed: string;         // 활용되는 강점
  approach: string;             // 접근 방법
  expectedOutcome: string;      // 기대 결과
}
