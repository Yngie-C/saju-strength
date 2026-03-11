'use client';

import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string';

/**
 * 공유 URL에 인코딩할 최소 페이로드
 * 총 ~112 bytes (압축 전) -> ~80-120 chars (압축 후)
 */
export interface SharePayload {
  v: 1;                    // version byte (향후 하위 호환성)
  pt: string;              // persona type
  tt: string;              // persona title
  tg: string;              // persona tagline
  de: string;              // dominant element
  dm: string;              // day master name
  tc: [string, number][];  // top 2 categories [name, score]
}

const CURRENT_VERSION = 1;
const MAX_DECOMPRESSED_SIZE = 2048; // 2KB guard

/**
 * SharePayload -> URL-safe 압축 문자열
 */
export function encodeShareData(payload: SharePayload): string {
  const json = JSON.stringify(payload);
  return compressToEncodedURIComponent(json);
}

/**
 * URL-safe 압축 문자열 -> SharePayload (실패 시 null)
 */
export function decodeShareData(encoded: string): SharePayload | null {
  try {
    const decompressed = decompressFromEncodedURIComponent(encoded);
    if (!decompressed) return null;

    // Size guard
    if (decompressed.length > MAX_DECOMPRESSED_SIZE) return null;

    const parsed = JSON.parse(decompressed) as SharePayload;

    // Version check
    if (parsed.v !== CURRENT_VERSION) return null;

    // Required fields validation
    if (
      typeof parsed.pt !== 'string' ||
      typeof parsed.tt !== 'string' ||
      typeof parsed.tg !== 'string' ||
      typeof parsed.de !== 'string' ||
      typeof parsed.dm !== 'string' ||
      !Array.isArray(parsed.tc)
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

/**
 * 공유 URL 전체 생성
 */
export function buildShareUrl(payload: SharePayload): string {
  const encoded = encodeShareData(payload);
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}/shared?d=${encoded}`;
}
