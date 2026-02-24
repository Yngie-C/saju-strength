import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { sessionId, key, data } = await request.json();

    if (!sessionId || !key || data === undefined) {
      return NextResponse.json({ error: '필수 파라미터 누락' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from('user_state')
      .upsert(
        {
          session_id: sessionId,
          state_key: key,
          state_data: data,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'session_id,state_key' }
      );

    if (error) {
      console.error('[POST /api/state/save] Supabase error:', error);
      return NextResponse.json({ error: '저장 실패' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류';
    console.error('[POST /api/state/save] Error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
