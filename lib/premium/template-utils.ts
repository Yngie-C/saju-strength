import { PERSONA_TEMPLATES } from './templates';

/**
 * PSA topCategories 기반 PersonaTemplate 키 결정
 * analyzer.ts:177-190 로직 추출
 */
export function resolveTemplateKey(topCategories?: string[]): string {
  if (topCategories && topCategories.length >= 2) {
    const key = Object.keys(PERSONA_TEMPLATES).find(
      (k) =>
        k === `${topCategories[0]}-${topCategories[1]}` ||
        k === `${topCategories[1]}-${topCategories[0]}`
    );
    if (key) return key;
  }
  return Object.keys(PERSONA_TEMPLATES)[0];
}

/**
 * 유명인 아키타입 3명 반환
 */
export function getFamousArchetypes(topCategories?: string[]): string[] {
  const key = resolveTemplateKey(topCategories);
  return PERSONA_TEMPLATES[key].famousArchetypes;
}
