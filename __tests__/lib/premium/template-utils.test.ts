import { describe, it, expect } from 'vitest';
import { resolveTemplateKey, getFamousArchetypes } from '@/lib/premium/template-utils';
import { PERSONA_TEMPLATES } from '@/lib/premium/templates/index';

describe('template-utils', () => {
  describe('resolveTemplateKey', () => {
    it('정상 케이스: topCategories=[innovation, execution] → 유효한 키 반환', () => {
      const key = resolveTemplateKey(['innovation', 'execution']);
      expect(key).toBe('innovation-execution');
      expect(PERSONA_TEMPLATES[key]).toBeDefined();
    });

    it('역순: topCategories=[execution, innovation] → 동일한 키 반환', () => {
      const key = resolveTemplateKey(['execution', 'innovation']);
      expect(key).toBe('innovation-execution');
    });

    it('폴백: topCategories=undefined → 첫 번째 키 반환', () => {
      const key = resolveTemplateKey(undefined);
      const firstKey = Object.keys(PERSONA_TEMPLATES)[0];
      expect(key).toBe(firstKey);
    });

    it('빈 배열: topCategories=[] → 첫 번째 키 반환', () => {
      const key = resolveTemplateKey([]);
      const firstKey = Object.keys(PERSONA_TEMPLATES)[0];
      expect(key).toBe(firstKey);
    });

    it('1개 요소: topCategories=[innovation] → 첫 번째 키 반환', () => {
      const key = resolveTemplateKey(['innovation']);
      const firstKey = Object.keys(PERSONA_TEMPLATES)[0];
      expect(key).toBe(firstKey);
    });

    it('알 수 없는 조합: 매칭 키 없으면 첫 번째 키 반환', () => {
      const key = resolveTemplateKey(['unknown', 'category']);
      const firstKey = Object.keys(PERSONA_TEMPLATES)[0];
      expect(key).toBe(firstKey);
    });
  });

  describe('getFamousArchetypes', () => {
    it('항상 string[] 반환, 길이 3', () => {
      const archetypes = getFamousArchetypes(['innovation', 'execution']);
      expect(Array.isArray(archetypes)).toBe(true);
      expect(archetypes).toHaveLength(3);
      archetypes.forEach((a) => expect(typeof a).toBe('string'));
    });

    it('폴백: undefined 전달 시에도 3개 반환', () => {
      const archetypes = getFamousArchetypes(undefined);
      expect(Array.isArray(archetypes)).toBe(true);
      expect(archetypes).toHaveLength(3);
    });

    it('빈 배열 전달 시에도 3개 반환', () => {
      const archetypes = getFamousArchetypes([]);
      expect(Array.isArray(archetypes)).toBe(true);
      expect(archetypes).toHaveLength(3);
    });

    it('다른 유효한 조합에서도 3개 반환', () => {
      const archetypes = getFamousArchetypes(['influence', 'collaboration']);
      expect(Array.isArray(archetypes)).toBe(true);
      expect(archetypes).toHaveLength(3);
    });
  });
});
