import { PersonaType } from '@/types/survey';
import { BrandingMessageTemplate } from '../branding-messages';

export const RESILIENT_INFLUENCER_BRANDING: BrandingMessageTemplate[] = [
  {
    personaType: PersonaType.RESILIENT_INFLUENCER,
    variant: 'balanced',
    selfIntro: '위기에서 더 빛나는 커뮤니케이터',
    linkedinHeadline: '흔들리지 않는 대변인 | 어려운 상황에서도 메시지를 전달해요',
    elevatorPitch: '위기 상황에서 침착하게 메시지를 전달하는 것이 제 역할이에요. 주변이 혼란스러울수록 더 명확하게 사고하고, 팀에 안정감을 줘요. 역경 속에서도 흔들리지 않는 소통 능력으로 사람들을 이끌고, 함께 위기를 극복해요.',
    hashtags: ['위기커뮤니케이션', '회복력', '영향력', '침착함', '리더십'],
  },
  {
    personaType: PersonaType.RESILIENT_INFLUENCER,
    variant: 'spiked',
    selfIntro: '폭풍 속에서도 목소리를 내는 사람',
    linkedinHeadline: '흔들리지 않는 대변인 | 위기가 클수록 더 담대해져요',
    elevatorPitch: '모두가 당황할 때 저는 마이크를 잡아요. 불확실한 상황에서도 핵심을 짚어내고, 팀이 나아갈 방향을 명확히 제시해요. 위기가 클수록 더 담대해지는 소통 능력과 회복력이 저의 가장 큰 무기예요.',
    hashtags: ['위기리더십', '담대함', '스포크스퍼슨', '침착한영향력'],
  },
  {
    personaType: PersonaType.RESILIENT_INFLUENCER,
    variant: 'mixed',
    selfIntro: '역경을 딛고 메시지를 전하는 전달자',
    linkedinHeadline: '흔들리지 않는 대변인 | 회복력과 영향력을 겸비해요',
    elevatorPitch: '어려운 상황에서도 포기하지 않고 메시지를 전달해요. 실패나 역경을 겪어도 빠르게 회복하고, 오히려 그 경험을 성장의 자양분으로 삼아요. 회복력을 바탕으로 꾸준히 영향력을 발휘하며 주변에 긍정적인 변화를 만들어요.',
    hashtags: ['회복력', '영향력', '메시지전달', '지속성'],
  },
];
