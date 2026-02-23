import { NextResponse } from 'next/server';
import { CombinedAnalyzerAgent } from '@/agents/combined-analyzer';
import { SajuAnalysis } from '@/types/saju';
import { BriefAnalysis } from '@/types/survey';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, sajuResult, psaResult } = body as {
      sessionId: string;
      sajuResult: SajuAnalysis;
      psaResult: BriefAnalysis;
    };

    if (!sessionId || !sajuResult || !psaResult) {
      return NextResponse.json(
        { error: '필수 데이터가 누락되었습니다. sessionId, sajuResult, psaResult가 필요합니다.' },
        { status: 400 }
      );
    }

    const agent = new CombinedAnalyzerAgent();
    const result = await agent.process(
      { saju: sajuResult, psa: psaResult },
      { sessionId, data: {} }
    );

    if (!result.success || !result.data) {
      return NextResponse.json(
        { error: result.error || '교차 분석에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    console.error('[POST /api/combined/analyze] Error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
