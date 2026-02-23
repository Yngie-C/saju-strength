import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, phone, sessionId } = await request.json();

    if (!email) {
      return NextResponse.json({ error: '이메일이 필요합니다.' }, { status: 400 });
    }

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
