import { FiveElement, CrossAnalysisType } from '@/types/saju';

export interface AlignmentTemplate {
  element: FiveElement;
  type: CrossAnalysisType;
  title: string;
  insight: string;
}

export const ALIGNMENT_TEMPLATES: AlignmentTemplate[] = [
  // Wood (혁신) - 4가지 유형
  {
    element: 'wood',
    type: 'alignment',
    title: '혁신의 개화',
    insight:
      '당신은 타고난 창의적 에너지(목)와 현재의 혁신 역량이 완벽하게 조화를 이루고 있습니다. 새로운 아이디어를 구상하고 실현하는 것이 당신의 핵심 무기입니다. 이 강점을 더욱 갈고닦아 혁신적 리더로서의 입지를 확고히 하세요.',
  },
  {
    element: 'wood',
    type: 'potential',
    title: '숨겨진 창의력',
    insight:
      '목(木)의 에너지가 강하지만 아직 혁신 역량으로 충분히 발현되지 않았습니다. 창의적 프로젝트에 더 도전해보세요. 타고난 잠재력이 빛날 것입니다.',
  },
  {
    element: 'wood',
    type: 'developed',
    title: '노력으로 키운 혁신',
    insight:
      '타고난 목 에너지는 크지 않지만, 후천적 노력으로 강력한 혁신 역량을 구축했습니다. 이는 당신의 성장 의지와 학습 능력을 보여주는 증거입니다. 이 역량은 더욱 단단하게 발전할 것입니다.',
  },
  {
    element: 'wood',
    type: 'undeveloped',
    title: '혁신의 씨앗',
    insight:
      '혁신 영역은 아직 개발의 여지가 큰 분야입니다. 작은 변화부터 시도하며 창의적 사고를 조금씩 확장해보세요. 새로운 관점을 받아들이는 연습이 당신을 다음 단계로 이끌 것입니다.',
  },

  // Fire (영향) - 4가지 유형
  {
    element: 'fire',
    type: 'alignment',
    title: '영향력의 정점',
    insight:
      '화(火)의 열정적 에너지와 현재의 대인 영향력이 완벽하게 맞닿아 있습니다. 사람들을 이끌고 설득하는 능력이 타고난 기질과 어우러져 강력한 시너지를 만들어냅니다. 이 에너지로 더 큰 무대를 향해 나아가세요.',
  },
  {
    element: 'fire',
    type: 'potential',
    title: '잠든 카리스마',
    insight:
      '화(火)의 빛나는 기질을 갖고 있지만 아직 대인 영향력으로 충분히 발휘되지 않고 있습니다. 더 많은 사람들 앞에 서는 기회를 만들어 보세요. 당신 안의 카리스마가 꽃피울 준비가 되어 있습니다.',
  },
  {
    element: 'fire',
    type: 'developed',
    title: '연마된 설득력',
    insight:
      '화의 기질은 강하지 않지만 꾸준한 노력으로 강력한 대인 영향력을 키워냈습니다. 이는 경험과 의지의 산물로, 매우 단단한 역량입니다. 앞으로도 이 능력은 더욱 빛날 것입니다.',
  },
  {
    element: 'fire',
    type: 'undeveloped',
    title: '영향력의 여백',
    insight:
      '대인 영향력 영역은 아직 발전 여지가 큰 분야입니다. 소규모 그룹에서 먼저 자신의 생각을 표현하는 연습을 시작해보세요. 한 사람의 마음을 움직이는 것에서부터 큰 영향력이 시작됩니다.',
  },

  // Earth (협업) - 4가지 유형
  {
    element: 'earth',
    type: 'alignment',
    title: '협업의 중심',
    insight:
      '토(土)의 포용적 기질과 현재의 협업 역량이 완벽히 일치합니다. 사람들을 하나로 묶고 팀의 시너지를 이끌어내는 것이 당신의 천성입니다. 이 강점으로 조직의 없어서는 안 될 핵심 인재가 되세요.',
  },
  {
    element: 'earth',
    type: 'potential',
    title: '숨은 공감 능력',
    insight:
      '토(土)의 따뜻한 포용력을 갖고 있지만 협업 역량으로 아직 충분히 발현되지 않았습니다. 팀 프로젝트에 더 적극적으로 참여하고 타인의 의견을 경청하는 역할을 맡아보세요. 당신 안의 공감 능력이 팀을 변화시킬 것입니다.',
  },
  {
    element: 'earth',
    type: 'developed',
    title: '쌓아올린 신뢰',
    insight:
      '타고난 토의 기질은 크지 않지만, 꾸준한 노력으로 탄탄한 협업 역량을 만들었습니다. 이 신뢰는 하루아침에 만들어지지 않은 당신의 진정한 자산입니다. 함께하는 사람들에게 당신은 든든한 버팀목입니다.',
  },
  {
    element: 'earth',
    type: 'undeveloped',
    title: '협업의 가능성',
    insight:
      '협업 영역은 앞으로 더 키워나갈 수 있는 분야입니다. 먼저 주변 사람들의 이야기에 귀를 기울이는 것부터 시작해보세요. 작은 공감 하나가 강력한 협력 관계의 씨앗이 됩니다.',
  },

  // Metal (실행) - 4가지 유형
  {
    element: 'metal',
    type: 'alignment',
    title: '실행의 완성자',
    insight:
      '금(金)의 단단하고 날카로운 기질과 현재의 철저한 실행력이 완벽하게 맞아떨어집니다. 목표를 정하면 반드시 완수하는 당신의 방식은 가장 강력한 경쟁 우위입니다. 이 역량으로 어떤 도전도 두려움 없이 마주하세요.',
  },
  {
    element: 'metal',
    type: 'potential',
    title: '잠재된 완결 능력',
    insight:
      '금(金)의 예리한 기질을 갖고 있지만 아직 실행력으로 충분히 발현되지 않았습니다. 구체적인 마감일과 결과물을 설정하는 습관을 들여보세요. 타고난 집중력이 강력한 실행력으로 변환될 것입니다.',
  },
  {
    element: 'metal',
    type: 'developed',
    title: '단련된 실행력',
    insight:
      '금의 기질이 강하지 않아도, 끊임없는 단련으로 탁월한 실행 역량을 구축했습니다. 이 능력은 의지와 훈련의 결정체입니다. 지속적인 결과물이 당신의 신뢰성을 높이고 있습니다.',
  },
  {
    element: 'metal',
    type: 'undeveloped',
    title: '실행력의 여지',
    insight:
      '실행 역량은 훈련을 통해 키울 수 있는 분야입니다. 작은 목표부터 완수하는 습관을 만들어보세요. 매일 하나씩 약속을 지키다 보면 어느새 강력한 실행력이 쌓여 있을 것입니다.',
  },

  // Water (회복) - 4가지 유형
  {
    element: 'water',
    type: 'alignment',
    title: '회복의 달인',
    insight:
      '수(水)의 유연하고 깊은 기질과 현재의 상황 회복력이 완벽하게 조화를 이룹니다. 어떤 역경에서도 본래의 자리로 돌아오는 당신의 능력은 위기 상황에서 가장 빛나는 강점입니다. 이 회복력으로 어떤 폭풍도 헤쳐나갈 수 있습니다.',
  },
  {
    element: 'water',
    type: 'potential',
    title: '깊은 내면의 힘',
    insight:
      '수(水)의 깊고 유연한 기질을 갖고 있지만 아직 상황 회복력으로 충분히 발현되지 않았습니다. 어려운 상황을 성장의 기회로 재해석하는 연습을 해보세요. 내면의 깊은 힘이 당신을 더 강하게 만들어줄 것입니다.',
  },
  {
    element: 'water',
    type: 'developed',
    title: '단련된 회복력',
    insight:
      '수의 기질이 강하지 않지만, 여러 경험을 통해 강력한 회복력을 키워냈습니다. 이 역량은 책에서 배울 수 없는 삶의 지혜입니다. 당신의 회복력은 주변 사람들에게도 용기를 줍니다.',
  },
  {
    element: 'water',
    type: 'undeveloped',
    title: '회복력의 씨앗',
    insight:
      '상황 회복 역량은 앞으로 더 발전시킬 수 있는 분야입니다. 어려운 상황에서 잠시 멈추고 다시 시작하는 연습을 해보세요. 작은 도전을 극복할 때마다 내면의 회복력은 조금씩 더 강해집니다.',
  },
];
