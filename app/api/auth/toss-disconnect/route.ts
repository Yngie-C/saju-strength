import { NextResponse } from 'next/server';
import { isValidTossDisconnectBody } from '@/lib/validation';

/**
 * 토스 로그인 연결 해제 콜백
 * 사용자가 토스 앱에서 "사주강점" 연결 해제 시 호출됨
 * Basic Auth 검증 후 사용자 데이터 삭제
 */
export async function POST(request: Request) {
  try {
    // Basic Auth 검증
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Basic ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const credentials = Buffer.from(authHeader.slice(6), 'base64').toString('utf8');
    const [username, password] = credentials.split(':');

    if (
      username !== process.env.TOSS_DISCONNECT_USERNAME ||
      password !== process.env.TOSS_DISCONNECT_PASSWORD
    ) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: '유효하지 않은 요청 본문입니다.' }, { status: 400 });
    }

    if (!isValidTossDisconnectBody(body)) {
      return NextResponse.json({ error: 'userKey가 필요합니다.' }, { status: 400 });
    }

    const { userKey, referrer } = body;

    // referrer에 따른 처리:
    // - UNLINK: 사용자가 토스 앱에서 연결 해제
    // - WITHDRAWAL_TERMS: 약관 철회
    // - WITHDRAWAL_TOSS: 토스 탈퇴
    console.log(`[toss-disconnect] userKey=${userKey}, referrer=${referrer}`);

    // 사용자 데이터 삭제 (Supabase)
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase.from('saju_results').delete().eq('user_id', userKey);
        await supabase.from('survey_responses').delete().eq('user_id', userKey);
        console.log(`[toss-disconnect] User data deleted: ${userKey}`);
      }
    } catch (dbError) {
      console.error('[toss-disconnect] DB deletion error:', dbError);
      // 콜백은 성공 응답을 반환해야 함 (재시도 방지)
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '연결 해제 처리 오류';
    console.error('[POST /api/auth/toss-disconnect] Error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
