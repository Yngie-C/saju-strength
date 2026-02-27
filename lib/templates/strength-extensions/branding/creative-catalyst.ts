import { PersonaType } from '@/types/survey';
import { BrandingMessageTemplate } from '../branding-messages';

export const CREATIVE_CATALYST_BRANDING: BrandingMessageTemplate[] = [
  {
    personaType: PersonaType.CREATIVE_CATALYST,
    variant: 'balanced',
    selfIntro: '팀의 아이디어를 폭발시키는 촉매',
    linkedinHeadline: '창의적 촉매 | 집단지성을 활용해 최고의 답을 찾습니다',
    elevatorPitch: '혼자보다 함께가 더 좋은 답을 만든다고 믿습니다. 팀의 다양한 관점을 연결해 혁신적인 해결책을 이끌어냅니다.',
    hashtags: ['창의성', '팀시너지', '협업혁신', '브레인스토밍', '집단지성'],
  },
  {
    personaType: PersonaType.CREATIVE_CATALYST,
    variant: 'spiked',
    selfIntro: '평범한 팀을 창의적 팀으로 바꾸는 사람',
    linkedinHeadline: '창의적 촉매 | 팀의 숨겨진 창의성을 끌어냅니다',
    elevatorPitch: '저와 함께하면 회의가 달라집니다. 모든 팀원의 아이디어를 끌어내고 연결해서 아무도 예상 못한 답을 만들어냅니다.',
    hashtags: ['창의적문제해결', '아이디어촉진', '팀빌딩', '브레이크스루'],
  },
  {
    personaType: PersonaType.CREATIVE_CATALYST,
    variant: 'mixed',
    selfIntro: '아이디어를 연결하고 발전시키는 기획자',
    linkedinHeadline: '창의적 촉매 | 협업을 통해 혁신적 결과를 만듭니다',
    elevatorPitch: '다양한 의견을 종합하고 발전시켜 더 나은 해결책을 찾습니다. 팀의 창의성을 이끌어내는 것이 제 강점입니다.',
    hashtags: ['협업', '창의력', '아이디어기획', '팀워크'],
  },
];
