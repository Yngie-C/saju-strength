import { NextResponse } from 'next/server';
import { SajuAnalyzerAgent } from '@/agents/saju-analyzer';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { isValidSajuCalculateBody } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: '유효하지 않은 요청 본문입니다.' }, { status: 400 });
    }

    if (!isValidSajuCalculateBody(body)) {
      return NextResponse.json({ error: '필수 입력값이 누락되었거나 유효하지 않습니다. (year: 1900~2050, month: 1~12, day: 1~31, gender 필수)' }, { status: 400 });
    }

    const { year, month, day, hour, gender, isLunar, sessionId: clientSessionId } = body;

    // 클라이언트에서 전달된 sessionId 사용, 없으면 신규 생성
    const sessionId = clientSessionId || crypto.randomUUID();

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
      await supabase.from('sessions').upsert(
        { id: sessionId, status: 'birth_input', updated_at: new Date().toISOString() },
        { onConflict: 'id' }
      );

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
