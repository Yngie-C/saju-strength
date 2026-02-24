import { NextResponse } from 'next/server';
import { SurveyAnalyzerAgent } from '@/agents/survey-analyzer';
import { SURVEY_QUESTIONS } from '@/lib/survey-questions';
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

    if (answers.length !== 60) {
      return NextResponse.json(
        { error: `설문 응답이 60개가 아닙니다 (${answers.length}개)` },
        { status: 400 }
      );
    }

    const surveyResponse: SurveyResponse = {
      sessionId,
      answers,
      completedAt: new Date(),
      completionTimeSeconds,
    };

    const agent = new SurveyAnalyzerAgent();
    const result = await agent.process(surveyResponse, {
      sessionId,
      data: {
        questions: SURVEY_QUESTIONS,
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
      const rows = answers.map((a) => ({
        session_id: sessionId,
        question_id: null,
        question_number: a.questionNumber,
        category: a.category,
        score: a.score,
      }));

      const supabase = getSupabaseAdmin();
      const { error: insertError } = await supabase
        .from('survey_responses')
        .insert(rows);

      if (insertError) {
        console.error('[POST /api/survey/submit] survey_responses insert error:', insertError);
      }

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
