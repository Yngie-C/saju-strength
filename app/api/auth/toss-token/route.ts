import { NextResponse } from 'next/server';
import { mtlsFetch } from '@/lib/mtls';
import { decryptTossUserData } from '@/lib/crypto';
import { isValidTossTokenBody } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: '유효하지 않은 요청 본문입니다.' }, { status: 400 });
    }

    if (!isValidTossTokenBody(body)) {
      return NextResponse.json({ error: 'authorizationCode가 필요합니다.' }, { status: 400 });
    }

    const { authorizationCode, referrer } = body;

    // 개발 환경 mock 응답
    if (process.env.NODE_ENV === 'development' || !process.env.TOSS_MTLS_CERT) {
      const mockUserId = `dev-user-${Date.now()}`;
      return NextResponse.json({
        userId: mockUserId,
        accessToken: `mock-access-${mockUserId}`,
        refreshToken: `mock-refresh-${mockUserId}`,
        expiresIn: 3600,
      });
    }

    // mTLS로 토큰 발급
    const tokenResponse = await mtlsFetch(
      '/api-partner/v1/apps-in-toss/user/oauth2/generate-token',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorizationCode, referrer: referrer || 'DEFAULT' }),
      }
    );

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: (error as { message?: string }).message || '토큰 발급 실패' },
        { status: tokenResponse.status }
      );
    }

    const tokenData = await tokenResponse.json() as {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };

    // mTLS로 사용자 정보 조회
    const userResponse = await mtlsFetch(
      '/api-partner/v1/apps-in-toss/user/oauth2/login-me',
      {
        headers: { Authorization: `Bearer ${tokenData.accessToken}` },
      }
    );

    if (!userResponse.ok) {
      return NextResponse.json({ error: '사용자 정보 조회 실패' }, { status: 500 });
    }

    const rawUserData = await userResponse.json() as { userKey: string; encryptedData?: string };

    // AES-256-GCM 복호화 (암호화된 사용자 데이터가 있는 경우)
    let userData: Record<string, unknown> = { userKey: rawUserData.userKey };
    if (rawUserData.encryptedData && process.env.TOSS_DECRYPT_KEY) {
      try {
        userData = {
          ...userData,
          ...decryptTossUserData(rawUserData.encryptedData),
        };
      } catch (e) {
        console.error('[toss-token] 사용자 데이터 복호화 실패:', e);
      }
    }

    return NextResponse.json({
      userId: rawUserData.userKey,
      accessToken: tokenData.accessToken,
      refreshToken: tokenData.refreshToken,
      expiresIn: tokenData.expiresIn,
      userData,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '인증 오류';
    console.error('[POST /api/auth/toss-token] Error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
