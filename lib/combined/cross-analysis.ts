import { FiveElement, ElementRanks, CrossAnalysisType, AxisAnalysis } from '@/types/saju';
import { CategoryScore, SurveyCategory } from '@/types/survey';
import { ALIGNMENT_TEMPLATES } from './alignment-templates';

// 오행-PSA 카테고리 매핑
const ELEMENT_TO_CATEGORY: Record<FiveElement, SurveyCategory> = {
  wood: SurveyCategory.INNOVATION,
  fire: SurveyCategory.INFLUENCE,
  earth: SurveyCategory.COLLABORATION,
  metal: SurveyCategory.EXECUTION,
  water: SurveyCategory.RESILIENCE,
};

// 4유형 판정 (rank: 1=최고, 5=최저; ≤2 = 강함, >2 = 약함)
function classifyAxis(elementRank: number, psaRank: number): CrossAnalysisType {
  if (elementRank <= 2 && psaRank <= 2) return 'alignment';
  if (elementRank <= 2 && psaRank > 2) return 'potential';
  if (elementRank > 2 && psaRank <= 2) return 'developed';
  return 'undeveloped';
}

function getInsightTemplate(element: FiveElement, type: CrossAnalysisType): string {
  const template = ALIGNMENT_TEMPLATES.find(t => t.element === element && t.type === type);
  return template?.insight ?? '';
}

// 5축 교차 분석 수행
export function performCrossAnalysis(
  elementRanks: ElementRanks,
  categoryScores: CategoryScore[]
): AxisAnalysis[] {
  const elements: FiveElement[] = ['wood', 'fire', 'earth', 'metal', 'water'];

  return elements.map(element => {
    const psaCategory = ELEMENT_TO_CATEGORY[element];
    const psaCatScore = categoryScores.find(s => s.category === psaCategory);
    const psaRank = psaCatScore?.rank ?? 5;
    const elRank = elementRanks[element];
    const type = classifyAxis(elRank, psaRank);
    const insight = getInsightTemplate(element, type);

    return {
      element,
      psaCategory,
      elementRank: elRank,
      psaRank,
      type,
      insight,
    };
  });
}
