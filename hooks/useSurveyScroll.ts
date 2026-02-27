'use client';

import { useEffect, useCallback, useRef, MutableRefObject } from 'react';
import { BASIC_QUESTIONS, BASIC_QUESTIONS_PER_PAGE } from '@/lib/survey/questions';
import { LastAnsweredRef } from '@/hooks/useSurveyState';

const SCROLL_DELAY_AFTER_PAGE_TRANSITION = 350;

export interface SurveyScrollReturn {
  currentPageRefs: MutableRefObject<(HTMLDivElement | null)[]>;
  getFirstUnansweredIndex: () => number;
}

export function useSurveyScroll(
  answers: Record<string, number>,
  currentPage: number,
  lastAnsweredRef: MutableRefObject<LastAnsweredRef | null>
): SurveyScrollReturn {
  const currentPageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const getFirstUnansweredIndex = useCallback((): number => {
    for (let i = 0; i < BASIC_QUESTIONS.length; i++) {
      if (answers[BASIC_QUESTIONS[i].id] === undefined) {
        return i;
      }
    }
    return BASIC_QUESTIONS.length;
  }, [answers]);

  // 답변 후 다음 미답변 질문으로 자동 스크롤
  useEffect(() => {
    const lastAnswered = lastAnsweredRef.current;
    if (!lastAnswered || !lastAnswered.isNew) {
      lastAnsweredRef.current = null;
      return;
    }
    lastAnsweredRef.current = null;

    const currentIndex = BASIC_QUESTIONS.findIndex((q) => q.id === lastAnswered.questionId);
    const nextIndex = currentIndex + 1;

    if (nextIndex >= BASIC_QUESTIONS.length) return;

    const nextQuestionPage = Math.floor(nextIndex / BASIC_QUESTIONS_PER_PAGE);

    if (nextQuestionPage !== currentPage) return;

    const localIdx = nextIndex - currentPage * BASIC_QUESTIONS_PER_PAGE;
    setTimeout(() => {
      const ref = currentPageRefs.current[localIdx];
      if (ref) {
        ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }, [answers, currentPage, lastAnsweredRef]);

  // 페이지 전환 후 해당 페이지의 첫 미답변 질문으로 스크롤
  useEffect(() => {
    const pageStart = currentPage * BASIC_QUESTIONS_PER_PAGE;
    const pageEnd = Math.min(pageStart + BASIC_QUESTIONS_PER_PAGE, BASIC_QUESTIONS.length);

    let targetLocalIdx: number | null = null;
    for (let i = pageStart; i < pageEnd; i++) {
      if (answers[BASIC_QUESTIONS[i].id] === undefined) {
        targetLocalIdx = i - pageStart;
        break;
      }
    }

    if (targetLocalIdx === null || targetLocalIdx === 0) return;

    setTimeout(() => {
      const ref = currentPageRefs.current[targetLocalIdx!];
      if (ref) {
        ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, SCROLL_DELAY_AFTER_PAGE_TRANSITION);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return { currentPageRefs, getFirstUnansweredIndex };
}
