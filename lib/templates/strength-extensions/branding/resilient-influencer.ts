import { PersonaType } from '@/types/survey';
import { BrandingMessageTemplate } from '../branding-messages';

export const RESILIENT_INFLUENCER_BRANDING: BrandingMessageTemplate[] = [
  {
    personaType: PersonaType.RESILIENT_INFLUENCER,
    variant: 'balanced',
    selfIntro: '위기에서 더 빛나는 커뮤니케이터',
    linkedinHeadline: '흔들리지 않는 대변인 | 어려운 상황에서도 메시지를 전달합니다',
    elevatorPitch: '위기 상황에서 침착하게 메시지를 전달하는 것이 제 역할입니다. 역경 속에서도 흔들리지 않고 사람들을 이끕니다.',
    hashtags: ['위기커뮤니케이션', '회복력', '영향력', '침착함', '리더십'],
  },
  {
    personaType: PersonaType.RESILIENT_INFLUENCER,
    variant: 'spiked',
    selfIntro: '폭풍 속에서도 목소리를 내는 사람',
    linkedinHeadline: '흔들리지 않는 대변인 | 위기가 클수록 더 담대해집니다',
    elevatorPitch: '모두가 당황할 때 저는 마이크를 잡습니다. 위기 상황에서 명확한 메시지로 팀을 안정시키고 방향을 제시합니다.',
    hashtags: ['위기리더십', '담대함', '스포크스퍼슨', '침착한영향력'],
  },
  {
    personaType: PersonaType.RESILIENT_INFLUENCER,
    variant: 'mixed',
    selfIntro: '역경을 딛고 메시지를 전하는 전달자',
    linkedinHeadline: '흔들리지 않는 대변인 | 회복력과 영향력을 겸비합니다',
    elevatorPitch: '어려운 상황에서도 포기하지 않고 메시지를 전달합니다. 회복력을 바탕으로 지속적인 영향력을 발휘합니다.',
    hashtags: ['회복력', '영향력', '메시지전달', '지속성'],
  },
];
