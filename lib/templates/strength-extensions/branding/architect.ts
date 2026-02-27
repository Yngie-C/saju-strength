import { PersonaType } from '@/types/survey';
import { BrandingMessageTemplate } from '../branding-messages';

export const ARCHITECT_BRANDING: BrandingMessageTemplate[] = [
  {
    personaType: PersonaType.ARCHITECT,
    variant: 'balanced',
    selfIntro: '아이디어를 시스템으로 만드는 전략 실행가',
    linkedinHeadline: '전략적 설계자 | 비전을 현실로 만드는 시스템 빌더',
    elevatorPitch: '저는 새로운 아이디어를 실행 가능한 시스템으로 설계합니다. 전략적 사고와 체계적 실행력으로 조직의 목표를 현실로 만듭니다.',
    hashtags: ['전략실행', '시스템설계', '혁신실현', '프로젝트리더십', '프로세스혁신'],
  },
  {
    personaType: PersonaType.ARCHITECT,
    variant: 'spiked',
    selfIntro: '복잡한 것을 단순하게, 불가능을 가능하게',
    linkedinHeadline: '전략적 설계자 | 비전에서 시스템까지 End-to-End 설계',
    elevatorPitch: '다른 사람들이 "복잡하다"고 말할 때, 저는 구조를 봅니다. 혁신적 아이디어를 체계적 시스템으로 전환해 실제 성과를 만들어냅니다.',
    hashtags: ['시스템아키텍트', '전략기획', '혁신설계', '복잡성해결'],
  },
  {
    personaType: PersonaType.ARCHITECT,
    variant: 'mixed',
    selfIntro: '전략과 실행을 연결하는 기획자',
    linkedinHeadline: '전략적 설계자 | 아이디어를 실행으로 연결합니다',
    elevatorPitch: '비전을 구체적인 실행 계획으로 전환하는 것이 제 역할입니다. 체계적인 접근으로 프로젝트의 성공 확률을 높입니다.',
    hashtags: ['전략기획', '실행력', '프로젝트관리', '시스템사고'],
  },
];
