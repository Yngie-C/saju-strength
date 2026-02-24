import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const productId = searchParams.get('productId');

    if (!sessionId || !productId) {
      return NextResponse.json({ error: '필수 파라미터 누락' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('purchases')
      .select('id')
      .eq('session_id', sessionId)
      .eq('product_id', productId)
      .eq('status', 'completed')
      .limit(1);

    if (error) {
      return NextResponse.json({ purchased: false });
    }

    return NextResponse.json({ purchased: (data && data.length > 0) });
  } catch {
    return NextResponse.json({ purchased: false });
  }
}
