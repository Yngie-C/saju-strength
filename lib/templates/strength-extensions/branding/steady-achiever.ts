import { PersonaType } from '@/types/survey';
import { BrandingMessageTemplate } from '../branding-messages';

export const STEADY_ACHIEVER_BRANDING: BrandingMessageTemplate[] = [
  {
    personaType: PersonaType.STEADY_ACHIEVER,
    variant: 'balanced',
    selfIntro: '시작한 일은 반드시 끝내는 완결자',
    linkedinHeadline: '강철의 완결자 | 어떤 역경에도 약속한 결과를 가져와요',
    elevatorPitch: '맡은 일은 반드시 완수해요. 단기적인 어려움에 흔들리지 않고, 끝까지 해내는 것이 저의 방식이에요. 끈기와 책임감을 바탕으로 팀이 안심하고 맡길 수 있는 사람, 그것이 저의 가장 큰 강점이에요.',
    hashtags: ['완결력', '책임감', '끈기', '신뢰', '목표달성'],
  },
  {
    personaType: PersonaType.STEADY_ACHIEVER,
    variant: 'spiked',
    selfIntro: '포기라는 단어를 모르는 완수자',
    linkedinHeadline: '강철의 완결자 | 불가능해 보여도 끝내는 사람이에요',
    elevatorPitch: '남들이 포기할 때 저는 방법을 찾아요. 장애물 앞에서 멈추는 대신, 우회로를 탐색하고 끝내 돌파해요. 어떤 난관도 끈기와 집중력으로 극복하고, 반드시 결과를 만들어내는 것이 저의 핵심 역량이에요.',
    hashtags: ['불굴의의지', '완수력', '난관돌파', '끈기왕'],
  },
  {
    personaType: PersonaType.STEADY_ACHIEVER,
    variant: 'mixed',
    selfIntro: '꾸준함으로 목표를 달성하는 실행가',
    linkedinHeadline: '강철의 완결자 | 끈기 있게 목표를 향해 나아가요',
    elevatorPitch: '하루하루 꾸준히 진전을 만들며 목표를 향해 나아가요. 화려한 한 방보다 매일의 작은 성장을 믿고, 그것이 모여 큰 결과를 이뤄요. 책임감 있게 맡은 일을 완수하며 팀에 안정감을 주는 것이 저의 강점이에요.',
    hashtags: ['꾸준함', '실행력', '책임감', '목표지향'],
  },
];
