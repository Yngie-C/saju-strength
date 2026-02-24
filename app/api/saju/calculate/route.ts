import { NextResponse } from 'next/server';
import { SajuAnalyzerAgent } from '@/agents/saju-analyzer';
import { getSupabaseAdmin } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { year, month, day, hour, gender, isLunar } = body;

    // 입력 검증
    if (!year || !month || !day || !gender) {
      return NextResponse.json({ error: '필수 입력값이 누락되었습니다.' }, { status: 400 });
    }

    // 범위 검증
    if (year < 1900 || year > 2050) {
      return NextResponse.json({ error: '1900~2050년 사이만 지원됩니다.' }, { status: 400 });
    }

    const sessionId = crypto.randomUUID();

    const agent = new SajuAnalyzerAgent();
    const result = await agent.process(
      { year, month, day, hour: hour ?? null, gender, isLunar: isLunar ?? false },
      { sessionId, data: {} }
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // fourPillars를 직렬화 가능한 형태로 변환
    const data = {
      sessionId,
      ...result.data,
      analyzedAt: result.data!.analyzedAt.toISOString(),
    };

    // Supabase 데이터 저장 (실패해도 응답에 영향 없음)
    try {
      const { fourPillars, dayMaster, elementDistribution, elementRanks } = result.data!;

      const supabase = getSupabaseAdmin();
      await supabase.from('sessions').insert({ id: sessionId, status: 'birth_input' });

      await supabase.from('saju_analyses').insert({
        id: crypto.randomUUID(),
        session_id: sessionId,
        birth_year: year,
        birth_month: month,
        birth_day: day,
        birth_hour: hour ?? null,
        gender,
        is_lunar: isLunar ?? false,
        year_pillar_stem: fourPillars.year.stem,
        year_pillar_branch: fourPillars.year.branch,
        month_pillar_stem: fourPillars.month.stem,
        month_pillar_branch: fourPillars.month.branch,
        day_pillar_stem: fourPillars.day.stem,
        day_pillar_branch: fourPillars.day.branch,
        hour_pillar_stem: fourPillars.hour?.stem ?? null,
        hour_pillar_branch: fourPillars.hour?.branch ?? null,
        day_master: dayMaster.stem,
        day_master_element: dayMaster.element,
        archetype: dayMaster.name,
        five_elements: elementDistribution,
        element_ranks: elementRanks,
      });
    } catch (dbError: unknown) {
      console.error('[Supabase] 저장 실패:', dbError);
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: `서버 오류: ${error.message}` }, { status: 500 });
  }
}
