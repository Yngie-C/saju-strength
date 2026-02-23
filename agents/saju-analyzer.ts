import { BaseAgent, AgentContext, AgentResult } from './base-agent';
import { BirthInput, SajuAnalysis } from '@/types/saju';
import { calculateFourPillars } from '@/lib/saju/manseryeok';
import { calculateElementDistribution, calculateElementRanks, getDominantElement, getWeakestElement } from '@/lib/saju/five-elements';
import { getDayMasterArchetype } from '@/lib/saju/day-master';

export class SajuAnalyzerAgent extends BaseAgent<BirthInput, SajuAnalysis> {
  constructor() {
    super('SajuAnalyzerAgent', '사주 분석 에이전트 (템플릿 기반, $0)');
  }

  async process(input: BirthInput, context: AgentContext): Promise<AgentResult<SajuAnalysis>> {
    try {
      // 1. 만세력 변환 → 사주팔자
      const fourPillars = await calculateFourPillars(input);

      // 2. 일간 아키타입 매핑
      const dayMaster = getDayMasterArchetype(fourPillars.day.stem);

      // 3. 오행 분포 계산 (가중치 적용)
      const elementDistribution = calculateElementDistribution(fourPillars);

      // 4. 순위 산출
      const elementRanks = calculateElementRanks(elementDistribution);

      // 5. 주도/약세 오행
      const dominantElement = getDominantElement(elementRanks);
      const weakestElement = getWeakestElement(elementRanks);

      const result: SajuAnalysis = {
        sessionId: context.sessionId,
        fourPillars,
        dayMaster,
        elementDistribution,
        elementRanks,
        dominantElement,
        weakestElement,
        birthHourKnown: input.hour !== null,
        analyzedAt: new Date(),
      };

      return this.success(result);
    } catch (error: any) {
      return this.failure(`사주 분석 실패: ${error.message}`);
    }
  }
}
