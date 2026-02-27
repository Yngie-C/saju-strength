import { PersonaType } from '@/types/survey';
import { BrandingMessageTemplate } from '../branding-messages';

export const DISRUPTOR_BRANDING: BrandingMessageTemplate[] = [
  {
    personaType: PersonaType.DISRUPTOR,
    variant: 'balanced',
    selfIntro: '시장의 틀을 바꾸는 변화 주도자',
    linkedinHeadline: '시장 파괴자 | 새로운 관점으로 산업의 룰을 재정의합니다',
    elevatorPitch: '기존의 방식에 질문을 던지고 새로운 패러다임을 제시합니다. 변화를 이끌고 사람들을 설득해 혁신을 현실로 만듭니다.',
    hashtags: ['혁신가', '변화주도', '시장개척', '비전리더십', '디스럽터'],
  },
  {
    personaType: PersonaType.DISRUPTOR,
    variant: 'spiked',
    selfIntro: '불가능이라는 말이 싫은 혁신가',
    linkedinHeadline: '시장 파괴자 | 업계의 "불가능"을 "당연"으로 바꿉니다',
    elevatorPitch: '"원래 그렇게 하는 거야"라는 말을 듣지 않습니다. 시장의 관성을 깨고 새로운 표준을 만드는 것이 제가 하는 일입니다.',
    hashtags: ['게임체인저', '혁신주도', '파괴적혁신', '트렌드세터'],
  },
  {
    personaType: PersonaType.DISRUPTOR,
    variant: 'mixed',
    selfIntro: '새로운 관점을 전달하는 커뮤니케이터',
    linkedinHeadline: '시장 파괴자 | 혁신적 아이디어를 설득력 있게 전달합니다',
    elevatorPitch: '새로운 아이디어를 발굴하고, 이를 효과적으로 전달해 변화를 이끕니다. 시장의 흐름을 읽고 기회를 만듭니다.',
    hashtags: ['혁신기획', '영향력', '변화관리', '설득력'],
  },
];
