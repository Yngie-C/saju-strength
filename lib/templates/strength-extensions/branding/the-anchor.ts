import { PersonaType } from '@/types/survey';
import { BrandingMessageTemplate } from '../branding-messages';

export const THE_ANCHOR_BRANDING: BrandingMessageTemplate[] = [
  {
    personaType: PersonaType.THE_ANCHOR,
    variant: 'balanced',
    selfIntro: '팀의 안정과 신뢰를 만드는 든든한 중심',
    linkedinHeadline: '신뢰의 중추 | 일관된 품질과 협업으로 조직을 지탱합니다',
    elevatorPitch: '맡은 일은 반드시 약속한 품질로 완수합니다. 안정적인 실행력과 협업 능력으로 팀에 신뢰를 제공합니다.',
    hashtags: ['신뢰', '협업', '안정성', '팀서포트', '품질관리'],
  },
  {
    personaType: PersonaType.THE_ANCHOR,
    variant: 'spiked',
    selfIntro: '흔들릴 때 더 단단해지는 팀의 닻',
    linkedinHeadline: '신뢰의 중추 | 팀이 가장 힘들 때 빛나는 서포터',
    elevatorPitch: '화려한 스포트라이트보다 팀의 성공을 만드는 든든한 기반이 되고 싶습니다. 묵묵히 일하고, 결과로 증명합니다.',
    hashtags: ['팀앵커', '신뢰구축', '조직안정', '서포터십'],
  },
  {
    personaType: PersonaType.THE_ANCHOR,
    variant: 'mixed',
    selfIntro: '팀과 함께 성장하는 협업 전문가',
    linkedinHeadline: '신뢰의 중추 | 체계적 실행과 팀워크로 기여합니다',
    elevatorPitch: '팀원들과 협력하여 목표를 달성합니다. 안정적인 업무 처리와 신뢰 관계 구축이 제 강점입니다.',
    hashtags: ['팀워크', '안정성', '협업', '신뢰관계'],
  },
];
