import { NextResponse } from 'next/server';
import { isValidWaitlistJoinBody } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: '유효하지 않은 요청 본문입니다.' }, { status: 400 });
    }

    if (!isValidWaitlistJoinBody(body)) {
      return NextResponse.json({ error: '유효한 이메일이 필요합니다.' }, { status: 400 });
    }

    const { email, phone, sessionId } = body;

    // MVP: DB 없이 성공 응답 반환 (Supabase 설정 후 waitlist 테이블에 INSERT)
    void phone;
    void sessionId;

    return NextResponse.json({
      data: {
        message: '대기자 등록이 완료되었습니다.',
        position: Math.floor(Math.random() * 100) + 50, // placeholder
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    console.error('[POST /api/waitlist/join] Error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
