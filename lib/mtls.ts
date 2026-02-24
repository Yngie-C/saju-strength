import https from 'https';

/**
 * mTLS Agent 생성
 * 환경변수에서 Base64 인코딩된 인증서/키를 읽어 https.Agent 생성
 */
export function createMtlsAgent(): https.Agent | undefined {
  const cert = process.env.TOSS_MTLS_CERT;
  const key = process.env.TOSS_MTLS_KEY;

  if (!cert || !key) {
    console.warn('[mTLS] TOSS_MTLS_CERT/KEY not configured');
    return undefined;
  }

  return new https.Agent({
    cert: Buffer.from(cert, 'base64').toString('utf8'),
    key: Buffer.from(key, 'base64').toString('utf8'),
    rejectUnauthorized: true,
  });
}

const TOSS_API_BASE = 'https://api-partner.toss.im';

/**
 * mTLS fetch wrapper
 * mTLS agent가 있으면 node-fetch with agent, 없으면 일반 fetch
 */
export async function mtlsFetch(path: string, init?: RequestInit): Promise<Response> {
  const url = `${TOSS_API_BASE}${path}`;
  const agent = createMtlsAgent();

  if (!agent) {
    // Development fallback
    return fetch(url, init);
  }

  // Use node:https for mTLS — Vercel serverless에서 https.Agent 지원
  const nodeFetch = (await import('node-fetch')).default;
  return nodeFetch(url, { ...init, agent }) as unknown as Response;
}
