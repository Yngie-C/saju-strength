import { BaseAgent, AgentContext, AgentResult } from './base-agent';
import { SajuAnalysis, CombinedAnalysis, AxisAnalysis } from '@/types/saju';
import { BriefAnalysis } from '@/types/survey';
import { performCrossAnalysis } from '@/lib/combined/cross-analysis';
import { generateGrowthGuide } from '@/lib/combined/growth-guide';

export class CombinedAnalyzerAgent extends BaseAgent<
  { saju: SajuAnalysis; psa: BriefAnalysis },
  CombinedAnalysis
> {
  constructor() {
    super(
      'CombinedAnalyzerAgent',
      `사주-PSA 교차 분석 에이전트. 오행 순위 + PSA 카테고리 점수 → 5축 교차 분석 → 4유형 판정 → 성장 가이드 생성.
처리: <1초, 비용: $0, AI 호출: 없음`
    );
  }

  async process(
    input: { saju: SajuAnalysis; psa: BriefAnalysis },
    context: AgentContext
  ): Promise<AgentResult<CombinedAnalysis>> {
    try {
      const { saju, psa } = input;
      const { sessionId } = context;

      console.log(`[CombinedAnalyzer] Starting cross-analysis for session: ${sessionId}`);

      // 1. 5축 교차 분석
      const axes: AxisAnalysis[] = performCrossAnalysis(
        saju.elementRanks,
        psa.categoryScores
      );

      console.log(`[CombinedAnalyzer] Axes computed:`, axes.map(a => `${a.element}=${a.type}`).join(', '));

      // 2. 유형별 분류
      const alignments = axes.filter(a => a.type === 'alignment');
      const potentials = axes.filter(a => a.type === 'potential');
      const developed = axes.filter(a => a.type === 'developed');
      const undeveloped = axes.filter(a => a.type === 'undeveloped');

      // 3. 성장 가이드 생성
      const growthGuideObj = generateGrowthGuide(axes, saju.dayMaster.name);

      // CombinedAnalysis.growthGuide is a string — serialize the guide
      const growthGuide = [
        growthGuideObj.summary,
        '',
        ...growthGuideObj.focusAreas.map(f => `${f.area}: ${f.advice}`),
        '',
        `실천 방법: ${growthGuideObj.dailyPractice}`,
      ].join('\n');

      const result: CombinedAnalysis = {
        sessionId,
        axes,
        alignments,
        potentials,
        developed,
        undeveloped,
        growthGuide,
        analyzedAt: new Date(),
      };

      console.log(`[CombinedAnalyzer] Done. alignments=${alignments.length}, potentials=${potentials.length}, developed=${developed.length}, undeveloped=${undeveloped.length}`);

      return this.success(result, {
        alignmentCount: alignments.length,
        potentialCount: potentials.length,
        developedCount: developed.length,
        undevelopedCount: undeveloped.length,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '알 수 없는 오류';
      console.error(`[CombinedAnalyzer] Error:`, error);
      return this.failure(`교차 분석 실패: ${message}`);
    }
  }
}
