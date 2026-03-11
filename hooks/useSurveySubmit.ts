'use client';

import { useState } from 'react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { BASIC_QUESTIONS } from '@/lib/survey/questions';
import { SurveyAnswer, BriefAnalysis } from '@/types/survey';
import { apiUrl } from '@/lib/config';
import { getStateManager } from '@/lib/state-manager';
import { setPendingAnalysis } from '@/lib/pending-analysis';
import { IS_TOSS } from '@/lib/platform';
import { SurveyAnalyzerAgent } from '@/agents/survey-analyzer';

const STORAGE_KEY = 'saju-survey-answers';
const RESULT_STORAGE_KEY = 'psaResult';
const SESSION_ID_KEY = 'saju-session-id';

export interface SurveySubmitReturn {
  handleSubmit: () => Promise<void>;
  isSubmitting: boolean;
}

export function useSurveySubmit(
  answers: Record<string, number>,
  startTime: number,
  router: AppRouterInstance
): SurveySubmitReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const allAnswered = BASIC_QUESTIONS.every((q) => answers[q.id] !== undefined);
    if (!allAnswered) {
      alert('모든 문항에 응답해 주세요.');
      return;
    }

    setIsSubmitting(true);

    const sessionId =
      sessionStorage.getItem(SESSION_ID_KEY) ||
      crypto.randomUUID();
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);

    const formattedAnswers: SurveyAnswer[] = BASIC_QUESTIONS.map((q) => ({
      questionId: q.id,
      questionNumber: q.questionNumber,
      category: q.category,
      score: answers[q.id],
    }));

    const completionTimeSeconds = Math.round((Date.now() - startTime) / 1000);

    try {
      if (IS_TOSS) {
        // 클라이언트 직접 분석 (API 호출 없음)
        const agent = new SurveyAnalyzerAgent();
        const surveyResponse = {
          sessionId,
          answers: formattedAnswers,
          completedAt: new Date(),
          completionTimeSeconds,
        };
        const result = await agent.process(surveyResponse, {
          sessionId,
          data: { questions: BASIC_QUESTIONS },
        });
        if (!result.success || !result.data) {
          throw new Error(result.error || '설문 분석 실패');
        }
        // analyzedAt Date → ISO string 직렬화
        const serialized = {
          ...result.data,
          analyzedAt: result.data.analyzedAt instanceof Date
            ? result.data.analyzedAt.toISOString()
            : result.data.analyzedAt,
        };
        sessionStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(serialized));
        await getStateManager().save('psaResult', serialized);
      } else {
        // 기존 API 호출 (웹 빌드)
        const analysisPromise = (async (): Promise<BriefAnalysis> => {
          const response = await fetch(apiUrl('/api/survey/submit'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId,
              answers: formattedAnswers,
              completionTimeSeconds,
            }),
          });

          if (!response.ok) {
            throw new Error('설문 분석 실패');
          }

          const result: BriefAnalysis = await response.json();

          sessionStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(result));
          await getStateManager().save('psaResult', result);

          return result;
        })();

        setPendingAnalysis(analysisPromise);
      }

      localStorage.removeItem(STORAGE_KEY);
      const sm = getStateManager();
      sm.remove('surveyAnswers');
      sm.remove('surveyPage');

      router.push('/birth-info');
    } catch (err) {
      alert(err instanceof Error ? err.message : '분석 중 문제가 생겼어요. 다시 시도해 볼까요?');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
}
