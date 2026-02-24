import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { authorizationCode, referrer } = await request.json();

    if (!authorizationCode) {
      return NextResponse.json({ error: 'authorizationCode가 필요합니다.' }, { status: 400 });
    }

    // mTLS 인증서가 설정된 후 실제 토스 서버 API 호출
    // 현재는 개발 환경용 placeholder
    const TOSS_API_BASE = 'https://api-partner.toss.im';
    const tokenEndpoint = `${TOSS_API_BASE}/api-partner/v1/apps-in-toss/user/oauth2/generate-token`;

    // TODO: mTLS 인증서 설정 후 활성화
    // const https = require('https');
    // const agent = new https.Agent({
    //   cert: process.env.TOSS_MTLS_CERT,
    //   key: process.env.TOSS_MTLS_KEY,
    // });

    // Placeholder: 개발 환경에서는 mock 응답 반환
    if (process.env.NODE_ENV === 'development' || !process.env.TOSS_MTLS_CERT) {
      const mockUserId = `dev-user-${Date.now()}`;
      return NextResponse.json({
        userId: mockUserId,
        accessToken: `mock-token-${mockUserId}`,
        expiresIn: 3600,
      });
    }

    // Production: 실제 토스 API 호출
    const tokenResponse = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authorizationCode, referrer: referrer || 'DEFAULT' }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: (error as { message?: string }).message || '토큰 발급 실패' },
        { status: tokenResponse.status }
      );
    }

    const tokenData = await tokenResponse.json();

    // 사용자 정보 조회
    const userResponse = await fetch(
      `${TOSS_API_BASE}/api-partner/v1/apps-in-toss/user/oauth2/login-me`,
      {
        headers: { Authorization: `Bearer ${tokenData.accessToken}` },
      }
    );

    if (!userResponse.ok) {
      return NextResponse.json({ error: '사용자 정보 조회 실패' }, { status: 500 });
    }

    const userData = await userResponse.json();

    return NextResponse.json({
      userId: userData.userKey,
      accessToken: tokenData.accessToken,
      expiresIn: tokenData.expiresIn,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '인증 오류';
    console.error('[POST /api/auth/toss-token] Error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
