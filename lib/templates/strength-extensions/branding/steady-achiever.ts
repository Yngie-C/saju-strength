import { PersonaType } from '@/types/survey';
import { BrandingMessageTemplate } from '../branding-messages';

export const STEADY_ACHIEVER_BRANDING: BrandingMessageTemplate[] = [
  {
    personaType: PersonaType.STEADY_ACHIEVER,
    variant: 'balanced',
    selfIntro: '시작한 일은 반드시 끝내는 완결자',
    linkedinHeadline: '강철의 완결자 | 어떤 역경에도 약속한 결과를 가져옵니다',
    elevatorPitch: '맡은 일은 반드시 완수합니다. 끈기와 책임감으로 어려운 상황에서도 흔들리지 않고 목표를 달성합니다.',
    hashtags: ['완결력', '책임감', '끈기', '신뢰', '목표달성'],
  },
  {
    personaType: PersonaType.STEADY_ACHIEVER,
    variant: 'spiked',
    selfIntro: '포기라는 단어를 모르는 완수자',
    linkedinHeadline: '강철의 완결자 | 불가능해 보여도 끝내는 사람입니다',
    elevatorPitch: '남들이 포기할 때 저는 방법을 찾습니다. 어떤 난관도 끈기와 집중력으로 돌파하고 반드시 결과를 만들어냅니다.',
    hashtags: ['불굴의의지', '완수력', '난관돌파', '끈기왕'],
  },
  {
    personaType: PersonaType.STEADY_ACHIEVER,
    variant: 'mixed',
    selfIntro: '꾸준함으로 목표를 달성하는 실행가',
    linkedinHeadline: '강철의 완결자 | 끈기 있게 목표를 향해 나아갑니다',
    elevatorPitch: '하루하루 꾸준히 진전을 만들며 목표를 향해 나아갑니다. 책임감 있게 맡은 일을 완수합니다.',
    hashtags: ['꾸준함', '실행력', '책임감', '목표지향'],
  },
];
