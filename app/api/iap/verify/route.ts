import { NextResponse } from 'next/server';

/* IAP_DISABLED_START — 인앱광고 전환으로 IAP 비활성화 (2026-02-26)
import { getSupabaseAdmin } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { sessionId, productId, purchaseToken } = await request.json();

    if (!sessionId || !productId || !purchaseToken) {
      return NextResponse.json({ error: '필수 파라미터 누락' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Store purchase record
    const { data, error } = await supabase
      .from('purchases')
      .insert({
        session_id: sessionId,
        product_id: productId,
        purchase_token: purchaseToken,
        status: 'completed',
      })
      .select('id')
      .single();

    if (error) {
      console.error('[POST /api/iap/verify] Supabase error:', error);
      return NextResponse.json({ error: '구매 기록 저장 실패' }, { status: 500 });
    }

    return NextResponse.json({ success: true, purchaseId: data.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류';
    console.error('[POST /api/iap/verify] Error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
IAP_DISABLED_END */

export async function POST() {
  return NextResponse.json({ error: 'IAP is currently disabled' }, { status: 404 });
}

export async function GET() {
  return NextResponse.json({ error: 'IAP is currently disabled' }, { status: 404 });
}
