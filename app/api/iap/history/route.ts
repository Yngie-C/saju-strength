import { NextResponse } from 'next/server';

/* IAP_DISABLED_START — 인앱광고 전환으로 IAP 비활성화 (2026-02-26)
import { getSupabaseAdmin } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId가 필요합니다.' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('purchases')
      .select('id, product_id, status, created_at')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ purchases: [] });
    }

    return NextResponse.json({ purchases: data || [] });
  } catch {
    return NextResponse.json({ purchases: [] });
  }
}
IAP_DISABLED_END */

export async function POST() {
  return NextResponse.json({ error: 'IAP is currently disabled' }, { status: 404 });
}

export async function GET() {
  return NextResponse.json({ error: 'IAP is currently disabled' }, { status: 404 });
}
