import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { generatePremiumReport } from '@/lib/premium/analyzer';
import { SajuAnalysis, AxisAnalysis } from '@/types/saju';
import { BriefAnalysis } from '@/types/survey';

const PREMIUM_REPORT_PRODUCT_ID = 'premium_report';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, sajuResult, psaResult, axes } = body as {
      sessionId: string;
      sajuResult: SajuAnalysis;
      psaResult: BriefAnalysis;
      axes: AxisAnalysis[];
    };

    if (!sessionId || !sajuResult || !psaResult || !axes) {
      return NextResponse.json(
        { error: '필수 데이터가 누락되었습니다. sessionId, sajuResult, psaResult, axes가 필요합니다.' },
        { status: 400 }
      );
    }

    // Check purchase status
    const supabase = getSupabaseAdmin();
    const { data: purchaseData, error: purchaseError } = await supabase
      .from('purchases')
      .select('id')
      .eq('session_id', sessionId)
      .eq('product_id', PREMIUM_REPORT_PRODUCT_ID)
      .eq('status', 'completed')
      .limit(1);

    if (purchaseError) {
      console.error('[POST /api/premium/report] Purchase check error:', purchaseError);
      return NextResponse.json(
        { error: '구매 확인 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    if (!purchaseData || purchaseData.length === 0) {
      return NextResponse.json(
        { error: '프리미엄 리포트를 구매해주세요.' },
        { status: 403 }
      );
    }

    // Generate premium report
    const report = generatePremiumReport(sessionId, sajuResult, psaResult, axes);

    return NextResponse.json(report);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    console.error('[POST /api/premium/report] Error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
