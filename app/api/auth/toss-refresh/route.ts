import { NextResponse } from 'next/server';
import { mtlsFetch } from '@/lib/mtls';
import { isValidTossRefreshBody } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: '유효하지 않은 요청 본문입니다.' }, { status: 400 });
    }

    if (!isValidTossRefreshBody(body)) {
      return NextResponse.json({ error: 'refreshToken이 필요합니다.' }, { status: 400 });
    }

    const { refreshToken } = body;

    // 개발 환경 mock
    if (process.env.NODE_ENV === 'development' || !process.env.TOSS_MTLS_CERT) {
      return NextResponse.json({
        accessToken: `mock-access-${Date.now()}`,
        refreshToken: `mock-refresh-${Date.now()}`,
        expiresIn: 3600,
      });
    }

    const response = await mtlsFetch(
      '/api-partner/v1/apps-in-toss/user/oauth2/refresh-token',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: (error as { message?: string }).message || '토큰 갱신 실패' },
        { status: response.status }
      );
    }

    const data = await response.json() as {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };

    return NextResponse.json({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '토큰 갱신 오류';
    console.error('[POST /api/auth/toss-refresh] Error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
