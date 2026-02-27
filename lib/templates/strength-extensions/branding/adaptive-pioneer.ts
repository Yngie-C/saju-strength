import { PersonaType } from '@/types/survey';
import { BrandingMessageTemplate } from '../branding-messages';

export const ADAPTIVE_PIONEER_BRANDING: BrandingMessageTemplate[] = [
  {
    personaType: PersonaType.ADAPTIVE_PIONEER,
    variant: 'balanced',
    selfIntro: '불확실성 속에서 길을 찾는 탐험가',
    linkedinHeadline: '적응형 선구자 | 변화를 기회로 만드는 혁신가',
    elevatorPitch: '변화를 두려워하지 않습니다. 불확실한 환경에서 빠르게 학습하고 적응하며, 새로운 기회를 만들어냅니다.',
    hashtags: ['변화적응', '혁신탐색', '애자일마인드', '선구자', '기회포착'],
  },
  {
    personaType: PersonaType.ADAPTIVE_PIONEER,
    variant: 'spiked',
    selfIntro: '위기를 기회로, 변화를 성장으로',
    linkedinHeadline: '적응형 선구자 | 다른 사람이 멈출 때 앞으로 나아갑니다',
    elevatorPitch: '위기 상황에서 저의 진가가 발휘됩니다. 빠른 적응력과 혁신적 사고로 남들이 보지 못하는 기회를 포착합니다.',
    hashtags: ['위기극복', '기회창출', '변화선도', '레질리언스'],
  },
  {
    personaType: PersonaType.ADAPTIVE_PIONEER,
    variant: 'mixed',
    selfIntro: '새로운 시도를 두려워하지 않는 도전자',
    linkedinHeadline: '적응형 선구자 | 변화에 유연하게 대응합니다',
    elevatorPitch: '새로운 환경에서 빠르게 적응하고, 혁신적인 방법을 시도합니다. 변화를 성장의 기회로 만듭니다.',
    hashtags: ['유연성', '도전정신', '적응력', '혁신시도'],
  },
];
