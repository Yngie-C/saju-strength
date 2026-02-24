import { NextResponse } from 'next/server';
import { SurveyAnalyzerAgent } from '@/agents/survey-analyzer';
import { SURVEY_QUESTIONS, BASIC_QUESTIONS } from '@/lib/survey-questions';
import { SurveyAnswer, SurveyResponse } from '@/types/survey';
import { getSupabaseAdmin } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, answers, completionTimeSeconds } = body as {
      sessionId: string;
      answers: SurveyAnswer[];
      completionTimeSeconds?: number;
    };

    if (!sessionId || !answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: '필수 데이터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const validCounts = [30, 60];
    if (!validCounts.includes(answers.length)) {
      return NextResponse.json(
        { error: `설문 응답이 30개 또는 60개여야 합니다 (${answers.length}개)` },
        { status: 400 }
      );
    }

    const surveyResponse: SurveyResponse = {
      sessionId,
      answers,
      completedAt: new Date(),
      completionTimeSeconds,
    };

    const questions = answers.length === 30 ? BASIC_QUESTIONS : SURVEY_QUESTIONS;
    const agent = new SurveyAnalyzerAgent();
    const result = await agent.process(surveyResponse, {
      sessionId,
      data: {
        questions,
      },
    });

    if (!result.success || !result.data) {
      return NextResponse.json(
        { error: result.error || '분석에 실패했습니다.' },
        { status: 500 }
      );
    }

    // Persist to Supabase — failures are logged but do not block the response
    try {
      const supabase = getSupabaseAdmin();

      // 1. Session upsert — 설문이 먼저 실행되므로 session이 없을 수 있음 (FK 위반 방지)
      const { error: upsertError } = await supabase
        .from('sessions')
        .upsert(
          { id: sessionId, status: 'survey_started', updated_at: new Date().toISOString() },
          { onConflict: 'id', ignoreDuplicates: true }
        );
      if (upsertError) {
        console.error('[POST /api/survey/submit] sessions upsert error:', upsertError);
      }

      // 2. 기존 응답 삭제 후 재삽입 (중복 제출 처리)
      await supabase
        .from('survey_responses')
        .delete()
        .eq('session_id', sessionId);

      const rows = answers.map((a) => ({
        session_id: sessionId,
        question_id: null,
        question_number: a.questionNumber,
        category: a.category,
        score: a.score,
      }));

      const { error: insertError } = await supabase
        .from('survey_responses')
        .insert(rows);

      if (insertError) {
        console.error('[POST /api/survey/submit] survey_responses insert error:', insertError);
      }

      // 3. Session 상태 업데이트
      const { error: updateError } = await supabase
        .from('sessions')
        .update({ survey_completed: true, updated_at: new Date().toISOString() })
        .eq('id', sessionId);

      if (updateError) {
        console.error('[POST /api/survey/submit] sessions update error:', updateError);
      }
    } catch (dbError) {
      console.error('[POST /api/survey/submit] Supabase operation failed:', dbError);
    }

    return NextResponse.json(result.data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    console.error('[POST /api/survey/submit] Error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
