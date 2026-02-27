import { NextResponse } from 'next/server';
import { CombinedAnalyzerAgent } from '@/agents/combined-analyzer';
import { SajuAnalysis } from '@/types/saju';
import { BriefAnalysis } from '@/types/survey';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { isValidCombinedAnalyzeBody } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: '유효하지 않은 요청 본문입니다.' }, { status: 400 });
    }

    if (!isValidCombinedAnalyzeBody(body)) {
      return NextResponse.json(
        { error: '필수 데이터가 누락되었습니다. sessionId, sajuResult, psaResult가 필요합니다.' },
        { status: 400 }
      );
    }

    const { sessionId } = body;
    const sajuResult = body.sajuResult as unknown as SajuAnalysis;
    const psaResult = body.psaResult as unknown as BriefAnalysis;

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

    try {
      const supabase = getSupabaseAdmin();
      let sajuAnalysisId: string | null = null;
      const { data: sajuRow } = await supabase
        .from('saju_analyses')
        .select('id')
        .eq('session_id', sessionId)
        .single();
      if (sajuRow) {
        sajuAnalysisId = sajuRow.id;
      }

      await supabase.from('combined_reports').insert({
        session_id: sessionId,
        saju_analysis_id: sajuAnalysisId,
        cross_analysis: result.data.axes,
        growth_guide: { text: result.data.growthGuide },
        persona_type: psaResult.persona.type,
        persona_title: psaResult.persona.title,
        psa_scores: psaResult.categoryScores,
        top_categories: psaResult.topCategories,
        strengths_summary: psaResult.strengthsSummary,
        branding_keywords: psaResult.brandingKeywords,
        radar_data: psaResult.radarData,
        strength_tips: psaResult.strengthTips ?? null,
        branding_messages: psaResult.brandingMessages ?? null,
        total_score: psaResult.totalScore,
        completion_time_seconds: psaResult.completionTimeSeconds ?? null,
      });

      await supabase
        .from('sessions')
        .update({ combined_report_generated: true, updated_at: new Date().toISOString() })
        .eq('id', sessionId);
    } catch (dbError: unknown) {
      console.error('[POST /api/combined/analyze] Supabase persistence error:', dbError);
    }

    return NextResponse.json(result.data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    console.error('[POST /api/combined/analyze] Error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
