import { PersonaType } from '@/types/survey';
import { BrandingMessageTemplate } from '../branding-messages';

export const INSPIRATIONAL_CONNECTOR_BRANDING: BrandingMessageTemplate[] = [
  {
    personaType: PersonaType.INSPIRATIONAL_CONNECTOR,
    variant: 'balanced',
    selfIntro: '사람을 연결하고 영감을 주는 리더',
    linkedinHeadline: '공감형 리더 | 관계를 통해 팀과 조직을 하나로 만듭니다',
    elevatorPitch: '사람의 마음을 이해하고 연결하는 것이 제 강점입니다. 진심 어린 소통과 협업으로 팀의 시너지를 만듭니다.',
    hashtags: ['공감리더십', '네트워킹', '관계구축', '팀빌딩', '영감'],
  },
  {
    personaType: PersonaType.INSPIRATIONAL_CONNECTOR,
    variant: 'spiked',
    selfIntro: '사람을 움직이는 힘, 공감',
    linkedinHeadline: '공감형 리더 | 마음을 얻어 함께 승리합니다',
    elevatorPitch: '저와 이야기하면 마음이 열립니다. 진정성 있는 관계를 바탕으로 팀원들의 잠재력을 끌어내고 함께 성장합니다.',
    hashtags: ['인플루언서', '공감능력', '관계의달인', '팀스피릿'],
  },
  {
    personaType: PersonaType.INSPIRATIONAL_CONNECTOR,
    variant: 'mixed',
    selfIntro: '소통으로 팀을 이끄는 협업 리더',
    linkedinHeadline: '공감형 리더 | 소통과 협업으로 성과를 만듭니다',
    elevatorPitch: '팀원들과의 열린 소통을 통해 협업을 촉진합니다. 관계를 기반으로 팀의 목표 달성을 이끕니다.',
    hashtags: ['소통', '협업리더', '관계형성', '팀매니지먼트'],
  },
];
