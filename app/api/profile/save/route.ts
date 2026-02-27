import { NextResponse } from 'next/server';
import { isValidProfileSaveBody } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: '유효하지 않은 요청 본문입니다.' }, { status: 400 });
    }

    if (!isValidProfileSaveBody(body)) {
      return NextResponse.json({ error: 'sessionId가 필요합니다.' }, { status: 400 });
    }

    const { sessionId, email, sajuResult, psaResult, combinedResult } = body;

    // slug: sessionId 앞 8자리
    const slug = String(sessionId).substring(0, 8);

    // MVP: DB 없이 응답 반환 (Supabase 설정 후 web_profiles 테이블에 INSERT)
    void email;
    void sajuResult;
    void psaResult;
    void combinedResult;

    return NextResponse.json({
      data: {
        slug,
        profileUrl: `/p/${slug}`,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    console.error('[POST /api/profile/save] Error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
