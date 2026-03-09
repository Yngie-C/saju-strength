import { describe, it, expect } from 'vitest';
import {
  encodeShareData,
  decodeShareData,
  buildShareUrl,
  type SharePayload,
} from '@/lib/share-encoder';

const samplePayload: SharePayload = {
  v: 1,
  pt: 'analytical_strategist',
  tt: '혁신적 전략가',
  tg: '분석과 직관을 결합하는 전략적 사고가',
  de: 'water',
  dm: '壬水',
  tc: [
    ['innovation', 82],
    ['execution', 76],
  ],
};

describe('share-encoder', () => {
  describe('encodeShareData / decodeShareData', () => {
    it('라운드트립 무결성: 인코딩 후 디코딩하면 원본과 동일', () => {
      const encoded = encodeShareData(samplePayload);
      const decoded = decodeShareData(encoded);

      expect(decoded).toEqual(samplePayload);
    });

    it('인코딩 결과는 URI component safe 문자로 구성', () => {
      const encoded = encodeShareData(samplePayload);

      // lz-string compressToEncodedURIComponent 출력은 URI-safe
      // +는 lz-string이 사용하는 유효 문자
      expect(encoded).toMatch(/^[A-Za-z0-9+/=$\-_.!~*'() ]+$/);
      expect(encoded.length).toBeGreaterThan(0);
    });

    it('인코딩 후 길이가 250자 이내', () => {
      const encoded = encodeShareData(samplePayload);

      // 한글 포함 페이로드 기준 ~230자, 여유분 포함 250자 이내
      expect(encoded.length).toBeLessThan(250);
    });

    it('전체 URL 길이가 300자 이내', () => {
      // origin 시뮬레이션
      const encoded = encodeShareData(samplePayload);
      const url = `https://saju-strength.vercel.app/shared?d=${encoded}`;

      expect(url.length).toBeLessThan(300);
    });
  });

  describe('decodeShareData 에러 핸들링', () => {
    it('빈 문자열 입력 시 null 반환', () => {
      expect(decodeShareData('')).toBeNull();
    });

    it('잘못된 문자열 입력 시 null 반환', () => {
      expect(decodeShareData('not-valid-encoded-data')).toBeNull();
    });

    it('유효한 JSON이지만 버전이 다르면 null 반환', () => {
      const wrongVersion = { ...samplePayload, v: 2 };
      const encoded = encodeShareData(wrongVersion as unknown as SharePayload);

      expect(decodeShareData(encoded)).toBeNull();
    });

    it('필수 필드 누락 시 null 반환', () => {
      // pt 필드 누락
      const incomplete = { v: 1, tt: 'test', tg: 'test', de: 'water', dm: '壬水', tc: [] };
      const { compressToEncodedURIComponent } = require('lz-string');
      const encoded = compressToEncodedURIComponent(JSON.stringify(incomplete));

      expect(decodeShareData(encoded)).toBeNull();
    });

    it('decompression size guard: 2KB 초과 시 null 반환', () => {
      // 2KB 초과 데이터 생성
      const hugePayload = {
        ...samplePayload,
        tg: 'x'.repeat(3000),
      };
      const { compressToEncodedURIComponent } = require('lz-string');
      const encoded = compressToEncodedURIComponent(JSON.stringify(hugePayload));

      expect(decodeShareData(encoded)).toBeNull();
    });
  });

  describe('buildShareUrl', () => {
    it('/shared?d= 형태의 URL을 생성', () => {
      const url = buildShareUrl(samplePayload);

      // window.location.origin이 없으므로 빈 문자열 + /shared?d=...
      expect(url).toContain('/shared?d=');
    });

    it('생성된 URL의 d 파라미터를 디코딩하면 원본 데이터 복원', () => {
      const url = buildShareUrl(samplePayload);
      const dParam = url.split('?d=')[1];
      const decoded = decodeShareData(dParam);

      expect(decoded).toEqual(samplePayload);
    });
  });
});
