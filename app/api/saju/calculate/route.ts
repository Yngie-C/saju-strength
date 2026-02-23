import { NextResponse } from 'next/server';
import { SajuAnalyzerAgent } from '@/agents/saju-analyzer';

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

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: `서버 오류: ${error.message}` }, { status: 500 });
  }
}
