'use client';

import { useState } from 'react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { BASIC_QUESTIONS } from '@/lib/survey/questions';
import { SurveyAnswer, BriefAnalysis } from '@/types/survey';
import { apiUrl } from '@/lib/config';
import { getStateManager } from '@/lib/state-manager';
import { setPendingAnalysis } from '@/lib/pending-analysis';

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

    localStorage.removeItem(STORAGE_KEY);
    const sm = getStateManager();
    sm.remove('surveyAnswers');
    sm.remove('surveyPage');

    router.push('/birth-info');
  };

  return { handleSubmit, isSubmitting };
}
