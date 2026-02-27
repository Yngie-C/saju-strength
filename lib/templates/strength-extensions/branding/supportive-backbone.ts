import { PersonaType } from '@/types/survey';
import { BrandingMessageTemplate } from '../branding-messages';

export const SUPPORTIVE_BACKBONE_BRANDING: BrandingMessageTemplate[] = [
  {
    personaType: PersonaType.SUPPORTIVE_BACKBONE,
    variant: 'balanced',
    selfIntro: '팀을 지지하고 갈등을 풀어내는 중재자',
    linkedinHeadline: '회복탄력적 중재자 | 어려울 때 팀을 하나로 묶습니다',
    elevatorPitch: '팀이 힘들 때 옆에서 지지하고, 갈등이 생기면 중재합니다. 회복력과 포용력으로 팀의 결속을 만듭니다.',
    hashtags: ['중재자', '팀서포터', '회복력', '포용', '갈등해결'],
  },
  {
    personaType: PersonaType.SUPPORTIVE_BACKBONE,
    variant: 'spiked',
    selfIntro: '무너진 팀을 다시 일으켜 세우는 사람',
    linkedinHeadline: '회복탄력적 중재자 | 팀의 위기를 극복하고 관계를 재건합니다',
    elevatorPitch: '팀이 가장 어려울 때 저의 역할이 시작됩니다. 흩어진 마음을 모으고, 다시 함께 나아갈 수 있도록 돕습니다.',
    hashtags: ['팀재건', '갈등중재', '관계회복', '위기극복'],
  },
  {
    personaType: PersonaType.SUPPORTIVE_BACKBONE,
    variant: 'mixed',
    selfIntro: '팀의 화합을 이끄는 서포터',
    linkedinHeadline: '회복탄력적 중재자 | 협업과 회복력으로 팀을 지원합니다',
    elevatorPitch: '팀원들을 지지하고 협업을 촉진합니다. 어려운 상황에서도 긍정적인 분위기를 유지하며 팀의 화합을 이끕니다.',
    hashtags: ['팀화합', '서포터', '협업', '긍정에너지'],
  },
];
