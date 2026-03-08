import { PersonaType } from '@/types/survey';
import { BrandingMessageTemplate } from '../branding-messages';

export const AUTHORITATIVE_LEADER_BRANDING: BrandingMessageTemplate[] = [
  {
    personaType: PersonaType.AUTHORITATIVE_LEADER,
    variant: 'balanced',
    selfIntro: '결과로 증명하는 성과 중심 리더',
    linkedinHeadline: '퍼포먼스 드라이버 | 목표를 설정하고 반드시 달성해요',
    elevatorPitch: '명확한 목표와 체계적 실행으로 팀을 이끌어요. 방향을 제시하고 팀원 각자의 역할을 조율하며, 함께 결과를 만들어가요. 말보다 성과로 신뢰를 쌓고, 조직의 목표를 현실로 만드는 것이 저의 리더십이에요.',
    hashtags: ['성과주도', '리더십', '목표달성', '실행력', 'KPI관리'],
  },
  {
    personaType: PersonaType.AUTHORITATIVE_LEADER,
    variant: 'spiked',
    selfIntro: '목표를 말하지 않고 달성해요',
    linkedinHeadline: '퍼포먼스 드라이버 | 압도적인 성과로 스스로를 증명해요',
    elevatorPitch: '저는 숫자로 이야기해요. 목표를 설정하면 반드시 달성하고, 그 과정에서 팀의 역량까지 끌어올려요. 압도적인 집중력과 실행력으로 기대 이상의 결과를 만들어내고, 팀 전체가 성장하는 선순환을 이끌어요.',
    hashtags: ['성과창출', '실적주도', '목표초과달성', '하이퍼포머'],
  },
  {
    personaType: PersonaType.AUTHORITATIVE_LEADER,
    variant: 'mixed',
    selfIntro: '목표 달성에 집중하는 추진력 있는 리더',
    linkedinHeadline: '퍼포먼스 드라이버 | 실행력으로 성과를 만들어요',
    elevatorPitch: '명확한 방향을 제시하고 팀과 함께 목표를 달성해요. 우선순위를 명확히 정하고, 핵심에 집중하는 실행력이 강점이에요. 체계적인 관리와 추진력으로 팀이 최고의 성과를 낼 수 있도록 이끌어요.',
    hashtags: ['목표관리', '팀리더십', '성과관리', '추진력'],
  },
];
