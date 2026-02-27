import { PersonaType } from '@/types/survey';
import { TemplateVariant } from '../template-selector';

/**
 * 브랜딩 메시지 인터페이스
 */
export interface BrandingMessages {
  selfIntro: string;         // 한 줄 자기소개 (30-50자)
  linkedinHeadline: string;  // LinkedIn 헤드라인 (60-80자)
  elevatorPitch: string;     // 2문장 소개 (80-120자)
  hashtags: string[];        // 3-5개
}

export interface BrandingMessageTemplate extends BrandingMessages {
  personaType: PersonaType;
  variant: TemplateVariant;
}

import { ARCHITECT_BRANDING } from './branding/architect';
import { DISRUPTOR_BRANDING } from './branding/disruptor';
import { CREATIVE_CATALYST_BRANDING } from './branding/creative-catalyst';
import { ADAPTIVE_PIONEER_BRANDING } from './branding/adaptive-pioneer';
import { AUTHORITATIVE_LEADER_BRANDING } from './branding/authoritative-leader';
import { THE_ANCHOR_BRANDING } from './branding/the-anchor';
import { STEADY_ACHIEVER_BRANDING } from './branding/steady-achiever';
import { INSPIRATIONAL_CONNECTOR_BRANDING } from './branding/inspirational-connector';
import { RESILIENT_INFLUENCER_BRANDING } from './branding/resilient-influencer';
import { SUPPORTIVE_BACKBONE_BRANDING } from './branding/supportive-backbone';

/**
 * 30개 브랜딩 메시지 템플릿 (10 페르소나 × 3 variants)
 *
 * Variant 설명:
 * - balanced: 균형잡힌 톤, 전반적으로 강점이 고른 경우
 * - spiked: 뾰족한 톤, 특정 강점이 두드러지는 경우
 * - mixed: 보통 톤, 일반적인 경우
 */
export const BRANDING_MESSAGE_TEMPLATES: BrandingMessageTemplate[] = [
  ...ARCHITECT_BRANDING,
  ...DISRUPTOR_BRANDING,
  ...CREATIVE_CATALYST_BRANDING,
  ...ADAPTIVE_PIONEER_BRANDING,
  ...AUTHORITATIVE_LEADER_BRANDING,
  ...THE_ANCHOR_BRANDING,
  ...STEADY_ACHIEVER_BRANDING,
  ...INSPIRATIONAL_CONNECTOR_BRANDING,
  ...RESILIENT_INFLUENCER_BRANDING,
  ...SUPPORTIVE_BACKBONE_BRANDING,
];
