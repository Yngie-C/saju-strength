// ==========================================
// PersonaType enum — isolated to break the
// circular dependency between survey.ts and persona-map.ts
// ==========================================

/**
 * Persona Types (10 combinations of top-2 PSA categories)
 */
export enum PersonaType {
  // Innovation + Execution
  ARCHITECT = 'architect',           // 전략적 설계자

  // Innovation + Influence
  DISRUPTOR = 'disruptor',           // 시장 파괴자

  // Innovation + Collaboration
  CREATIVE_CATALYST = 'creative_catalyst', // 창의적 촉매

  // Innovation + Resilience
  ADAPTIVE_PIONEER = 'adaptive_pioneer',   // 적응형 선구자

  // Execution + Influence
  AUTHORITATIVE_LEADER = 'authoritative_leader', // 권위적 리더

  // Execution + Collaboration
  THE_ANCHOR = 'the_anchor',         // 신뢰의 중추

  // Execution + Resilience
  STEADY_ACHIEVER = 'steady_achiever', // 꾸준한 달성자

  // Influence + Collaboration
  INSPIRATIONAL_CONNECTOR = 'inspirational_connector', // 영감을 주는 연결자

  // Influence + Resilience
  RESILIENT_INFLUENCER = 'resilient_influencer', // 회복력 있는 영향자

  // Collaboration + Resilience
  SUPPORTIVE_BACKBONE = 'supportive_backbone', // 지지적 백본
}
