import { PersonaType } from '@/types/survey';
import { BrandingMessageTemplate } from '../branding-messages';

export const ADAPTIVE_PIONEER_BRANDING: BrandingMessageTemplate[] = [
  {
    personaType: PersonaType.ADAPTIVE_PIONEER,
    variant: 'balanced',
    selfIntro: '불확실성 속에서 길을 찾는 탐험가',
    linkedinHeadline: '적응형 선구자 | 변화를 기회로 만드는 혁신가',
    elevatorPitch: '변화를 두려워하지 않아요. 불확실한 환경에서 빠르게 학습하고 적응하며, 남들이 보지 못하는 기회를 포착해요. 실패에서도 배움을 얻고 다시 도전하는 회복력으로, 새로운 길을 개척하는 것이 저의 강점이에요.',
    hashtags: ['변화적응', '혁신탐색', '애자일마인드', '선구자', '기회포착'],
  },
  {
    personaType: PersonaType.ADAPTIVE_PIONEER,
    variant: 'spiked',
    selfIntro: '위기를 기회로, 변화를 성장으로',
    linkedinHeadline: '적응형 선구자 | 다른 사람이 멈출 때 앞으로 나아가요',
    elevatorPitch: '위기 상황에서 저의 진가가 발휘돼요. 다른 사람들이 멈추거나 후퇴할 때, 저는 오히려 앞으로 나아가요. 빠른 적응력과 혁신적 사고로 남들이 보지 못하는 기회를 포착하고, 이를 구체적인 성과로 연결해요.',
    hashtags: ['위기극복', '기회창출', '변화선도', '레질리언스'],
  },
  {
    personaType: PersonaType.ADAPTIVE_PIONEER,
    variant: 'mixed',
    selfIntro: '새로운 시도를 두려워하지 않는 도전자',
    linkedinHeadline: '적응형 선구자 | 변화에 유연하게 대응해요',
    elevatorPitch: '새로운 환경에서 빠르게 적응하고, 혁신적인 방법을 시도해요. 익숙한 방식에 안주하기보다 더 나은 방법을 탐구하는 것을 즐겨요. 변화를 성장의 기회로 바꾸고, 그 과정에서 주변에도 도전의 영감을 전해요.',
    hashtags: ['유연성', '도전정신', '적응력', '혁신시도'],
  },
];
