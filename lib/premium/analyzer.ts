import { SajuAnalysis, AxisAnalysis } from '@/types/saju';
import { BriefAnalysis } from '@/types/survey';
import {
  PremiumReport,
  PersonaDeepDive,
  GrowthRoadmap,
  BrandingProfile,
  DetailedAxisAnalysis,
  StrengthScenario,
} from '@/types/premium';
import { PERSONA_TEMPLATES } from './templates';

// Detailed insights per element × cross-analysis type
const DETAILED_INSIGHTS: Record<string, Record<string, { detailedInsight: string; actionTip: string }>> = {
  wood: {
    alignment: {
      detailedInsight:
        '목(木) 기운과 혁신 사고 역량이 완벽하게 일치합니다. 당신의 사주에서 타고난 창조적 에너지가 현재 삶에서 실제 혁신 역량으로 꽃피고 있습니다. 이 정렬은 당신이 새로운 아이디어를 내는 것이 억지로 하는 노력이 아닌, 본능적인 행동임을 의미합니다.',
      actionTip:
        '이 강점을 더 큰 무대에서 발휘하세요. 팀 내 혁신 프로젝트의 리더가 되거나, 새로운 방법론을 제안하는 역할을 자청해보세요.',
    },
    potential: {
      detailedInsight:
        '목(木) 기운이 강하여 혁신적 아이디어를 내는 타고난 잠재력을 가지고 있지만, 현재 PSA 점수는 이 잠재력이 아직 충분히 발현되지 않았음을 보여줍니다. 이것은 황금 기회 구간입니다. 내면의 창조성을 깨워낼 환경과 자극이 필요합니다.',
      actionTip:
        '매주 새로운 분야의 책이나 강의를 접하고, 아이디어 노트를 만들어보세요. 처음에는 어색하더라도 창의적 실험을 두려워하지 마세요.',
    },
    developed: {
      detailedInsight:
        '사주 상 목(木) 기운은 상대적으로 약하지만, 노력으로 혁신 사고 역량을 상위권으로 끌어올렸습니다. 이것은 타고난 강점이 아닌 후천적 의지로 만들어낸 진짜 실력입니다. 그 과정에서 쌓인 끈기와 학습 능력 자체가 또 다른 강점입니다.',
      actionTip:
        '이 역량을 유지하기 위해 지속적인 학습과 도전이 필요합니다. 안주하는 순간 약해질 수 있으므로, 정기적으로 새로운 자극을 찾아보세요.',
    },
    undeveloped: {
      detailedInsight:
        '목(木) 기운이 약하고 혁신 사고 역량도 상대적으로 낮게 나타납니다. 하지만 이것은 능력의 부재가 아닌, 아직 개발되지 않은 영역입니다. 작은 창의적 시도를 통해 점진적으로 이 영역을 성장시킬 수 있습니다.',
      actionTip:
        '주 1회 익숙한 문제를 전혀 다른 방식으로 풀어보는 시간을 만들어보세요. 처음에는 이상하게 느껴져도 괜찮습니다.',
    },
  },
  fire: {
    alignment: {
      detailedInsight:
        '화(火) 기운과 대인 영향 역량이 완벽하게 일치합니다. 당신의 사주에서 타고난 열정적 에너지가 실제 영향력과 카리스마로 발현되고 있습니다. 사람들이 당신에게 이끌리는 것은 우연이 아닌, 타고난 기운과 후천적 역량의 완벽한 정렬에서 나오는 것입니다.',
      actionTip:
        '더 큰 무대에서 이 영향력을 발휘하세요. 강연, 멘토링, 팀 리더십 역할이 당신에게 최적입니다.',
    },
    potential: {
      detailedInsight:
        '화(火) 기운이 강하여 사람들을 이끌고 영향을 미칠 타고난 잠재력을 가지고 있습니다. 아직 그 열정이 대인 영향력으로 충분히 전환되지 않았을 뿐, 내면에 강력한 카리스마의 씨앗이 있습니다.',
      actionTip:
        '소규모 발표나 팀 내 의견 제시 기회를 적극적으로 찾아보세요. 목소리를 내는 연습을 통해 내면의 영향력이 자연스럽게 피어납니다.',
    },
    developed: {
      detailedInsight:
        '사주 상 화(火) 기운은 상대적으로 약하지만, 후천적 노력으로 강한 대인 영향력을 만들어냈습니다. 타고난 것이 아닌 만큼, 그 영향력에는 겸손함과 진정성이 담겨 있어 오히려 더 깊은 신뢰를 얻습니다.',
      actionTip:
        '이 역량은 꾸준한 관계 투자로 유지됩니다. 정기적으로 새로운 사람을 만나고 진심 어린 대화를 나누는 습관을 이어가세요.',
    },
    undeveloped: {
      detailedInsight:
        '화(火) 기운이 약하고 대인 영향력도 아직 개발이 필요한 영역입니다. 하지만 영향력은 타고나는 것이 아니라 키울 수 있는 역량입니다. 진정성 있는 소통에서 시작하면 됩니다.',
      actionTip:
        '매일 한 명에게 진심을 담은 메시지를 보내거나 직접 대화를 나눠보세요. 작은 연결이 쌓여 강한 영향력이 됩니다.',
    },
  },
  earth: {
    alignment: {
      detailedInsight:
        '토(土) 기운과 협업 공감 역량이 완벽하게 일치합니다. 당신의 사주에서 타고난 안정적이고 포용적인 에너지가 실제 협업 역량으로 발현되고 있습니다. 팀원들이 당신 곁에서 안정감을 느끼는 것은 이 기운이 만들어내는 자연스러운 결과입니다.',
      actionTip:
        '팀 빌딩, 갈등 중재, 문화 형성에서 더 적극적인 역할을 맡아보세요. 당신의 협업 강점이 팀 전체를 바꿀 수 있습니다.',
    },
    potential: {
      detailedInsight:
        '토(土) 기운이 강하여 협업과 공감의 타고난 잠재력을 가지고 있습니다. 아직 이 포용력이 팀 내에서 충분히 발휘되지 않았을 뿐, 내면에 사람들을 모으고 연결하는 강한 기운이 있습니다.',
      actionTip:
        '다음 팀 프로젝트에서 조율자나 연결자 역할을 자청해보세요. 타고난 포용력이 발현되는 순간을 경험할 수 있습니다.',
    },
    developed: {
      detailedInsight:
        '사주 상 토(土) 기운은 상대적으로 약하지만, 의식적인 노력으로 협업 공감 역량을 키워냈습니다. 이것은 더 깊이 이해하고 더 의식적으로 실천하는 진정성 있는 협업 능력입니다.',
      actionTip:
        '이 역량을 유지하기 위해 팀원들과의 정기적인 피드백 세션을 만들어보세요. 관계는 관리할 때 더 강해집니다.',
    },
    undeveloped: {
      detailedInsight:
        '토(土) 기운이 약하고 협업 공감 역량도 아직 성장 가능한 영역입니다. 협업은 사람을 좋아하는 것에서 시작하지 않아도 됩니다. 상대방의 입장을 이해하려는 작은 시도에서 시작하세요.',
      actionTip:
        '팀원의 이야기를 끝까지 듣고 요약해주는 습관을 들여보세요. 경청이 협업의 첫 번째 단계입니다.',
    },
  },
  metal: {
    alignment: {
      detailedInsight:
        '금(金) 기운과 철저 실행 역량이 완벽하게 일치합니다. 당신의 사주에서 타고난 정밀하고 단호한 에너지가 실제 실행력으로 발현되고 있습니다. 당신이 맡은 일이 반드시 완수되는 것은 타고난 기운과 역량의 완벽한 정렬 덕분입니다.',
      actionTip:
        '이 실행력을 팀 전체의 자산으로 만드세요. 당신의 실행 프로세스를 문서화하여 공유하면 팀 전체의 역량이 올라갑니다.',
    },
    potential: {
      detailedInsight:
        '금(金) 기운이 강하여 체계적이고 철저하게 실행할 타고난 잠재력을 가지고 있습니다. 아직 이 잠재력이 실행 역량으로 충분히 발현되지 않았을 뿐, 내면에 강한 정밀함과 완수의 에너지가 있습니다.',
      actionTip:
        '하루 하나씩 작은 목표를 설정하고 반드시 완수하는 루틴을 시작하세요. 실행의 근육은 반복으로 만들어집니다.',
    },
    developed: {
      detailedInsight:
        '사주 상 금(金) 기운은 상대적으로 약하지만, 훈련으로 철저한 실행력을 키워냈습니다. 그 과정에서 만들어진 자기 규율과 책임감은 타고난 것보다 더 단단한 강점입니다.',
      actionTip:
        '실행 루틴과 시스템을 꾸준히 점검하고 개선하세요. 이 역량은 계속 정교화될수록 더 강해집니다.',
    },
    undeveloped: {
      detailedInsight:
        '금(金) 기운이 약하고 철저 실행 역량도 성장이 필요한 영역입니다. 완벽한 실행보다 작은 완수의 경험을 쌓는 것이 먼저입니다. 시작이 가장 중요합니다.',
      actionTip:
        '오늘 할 일 3가지를 정하고 반드시 완수하는 것부터 시작하세요. 작은 완주 경험이 실행력의 기반이 됩니다.',
    },
  },
  water: {
    alignment: {
      detailedInsight:
        '수(水) 기운과 상황 회복 역량이 완벽하게 일치합니다. 당신의 사주에서 타고난 유연하고 깊은 에너지가 실제 회복력으로 발현되고 있습니다. 위기 상황에서 당신이 흔들리지 않는 것은 타고난 수(水) 기운이 당신의 내면 깊은 곳에서 지탱해주기 때문입니다.',
      actionTip:
        '이 회복력을 개인을 넘어 팀의 자산으로 만드세요. 위기 상황에서 팀원들을 안정시키는 역할을 적극적으로 맡아보세요.',
    },
    potential: {
      detailedInsight:
        '수(水) 기운이 강하여 어떤 상황에서도 유연하게 대응하고 회복할 타고난 잠재력을 가지고 있습니다. 아직 이 깊은 회복력이 현실에서 충분히 발휘되지 않았을 뿐, 내면에 강한 적응력과 회복의 씨앗이 있습니다.',
      actionTip:
        '어려운 상황을 성장의 기회로 재해석하는 일기를 써보세요. 내면의 회복력이 점점 더 선명하게 발현됩니다.',
    },
    developed: {
      detailedInsight:
        '사주 상 수(水) 기운은 상대적으로 약하지만, 경험과 의지로 강한 상황 회복 역량을 키워냈습니다. 역경을 통해 단련된 회복력은 타고난 것보다 더 실제적이고 신뢰할 수 있습니다.',
      actionTip:
        '이 역량은 어려운 경험에서 더욱 단단해집니다. 도전적인 상황을 회피하지 말고, 그것이 당신을 더 강하게 만든다는 것을 기억하세요.',
    },
    undeveloped: {
      detailedInsight:
        '수(水) 기운이 약하고 상황 회복 역량도 아직 개발이 필요한 영역입니다. 회복력은 타고나는 것이 아닙니다. 어려운 상황을 다루는 방식을 의식적으로 연습함으로써 키울 수 있습니다.',
      actionTip:
        '실패와 어려움을 기록하고 거기서 배운 점을 적어두는 습관을 만들어보세요. 회복력은 실패를 다루는 방식에서 자랍니다.',
    },
  },
};

function buildDetailedAxes(axes: AxisAnalysis[]): DetailedAxisAnalysis[] {
  return axes.map((axis) => {
    const elementInsights = DETAILED_INSIGHTS[axis.element];
    const typeInsight = elementInsights?.[axis.type] ?? {
      detailedInsight: axis.insight,
      actionTip: `${axis.psaCategory} 영역에서 꾸준한 성장을 이어가세요.`,
    };

    return {
      element: axis.element,
      psaCategory: axis.psaCategory,
      type: axis.type,
      basicInsight: axis.insight,
      detailedInsight: typeInsight.detailedInsight,
      actionTip: typeInsight.actionTip,
    };
  });
}

export function generatePremiumReport(
  sessionId: string,
  sajuResult: SajuAnalysis,
  psaResult: BriefAnalysis,
  axes: AxisAnalysis[]
): PremiumReport {
  const personaType = psaResult.persona.type as string;

  // Resolve template — map PersonaType enum value to PersonaMap key
  // PersonaMap uses keys like 'innovation-execution', persona.type uses enum like 'architect'
  // We need to find the matching key by checking psaResult.topCategories
  let templateKey = Object.keys(PERSONA_TEMPLATES).find((key) => {
    const cats = psaResult.topCategories;
    if (cats && cats.length >= 2) {
      return key === `${cats[0]}-${cats[1]}` || key === `${cats[1]}-${cats[0]}`;
    }
    return false;
  });

  // Fallback: try matching by persona type string directly
  if (!templateKey) {
    templateKey = Object.keys(PERSONA_TEMPLATES)[0];
  }

  const template = PERSONA_TEMPLATES[templateKey];

  // Build PersonaDeepDive
  const personaDeepDive: PersonaDeepDive = {
    personaType,
    personaTitle: psaResult.persona.title,
    coreIdentity: template.coreIdentity,
    hiddenStrengths: template.hiddenStrengths,
    blindSpots: template.blindSpots,
    idealEnvironment: template.idealEnvironment,
    famousArchetypes: template.famousArchetypes,
  };

  // Personalize coreIdentity with dayMaster
  const dayMasterName = sajuResult.dayMaster.name;
  if (dayMasterName) {
    personaDeepDive.coreIdentity =
      `${dayMasterName} 기질을 가진 당신은 ${template.coreIdentity}`;
  }

  // Build GrowthRoadmap
  const growthRoadmap: GrowthRoadmap = {
    weeklyPlan: template.weeklyPlan,
    longTermVision: template.longTermVision,
  };

  // Build BrandingProfile
  const brandingProfile: BrandingProfile = {
    tagline: template.tagline,
    elevatorPitch: template.elevatorPitch,
    keywords: template.keywords,
    strengthStatement: template.strengthStatement,
  };

  // Build DetailedAxisAnalysis
  const detailedAxes: DetailedAxisAnalysis[] = buildDetailedAxes(axes);

  // Build StrengthScenarios
  const strengthScenarios: StrengthScenario[] = template.scenarios;

  return {
    sessionId,
    personaDeepDive,
    growthRoadmap,
    brandingProfile,
    detailedAxes,
    strengthScenarios,
    generatedAt: new Date(),
  };
}
