'use client';

import { useState, useEffect, useCallback, useRef, MutableRefObject } from 'react';
import { useSwipeable } from 'react-swipeable';
import { BASIC_QUESTIONS, BASIC_QUESTIONS_PER_PAGE, BASIC_TOTAL_PAGES } from '@/lib/survey/questions';
import { getStateManager } from '@/lib/state-manager';

const STORAGE_KEY = 'saju-survey-answers';

export interface LastAnsweredRef {
  questionId: string;
  isNew: boolean;
}

export interface SurveyStateReturn {
  answers: Record<string, number>;
  currentPage: number;
  direction: number;
  startTime: number;
  totalAnswered: number;
  progress: number;
  milestoneMessage: string | undefined;
  estimatedMinutesLeft: number;
  currentPageAnswered: boolean;
  handleAnswer: (questionId: string, value: number) => void;
  goToPage: (newPage: number) => void;
  handleNext: () => void;
  handlePrev: () => void;
  swipeHandlers: ReturnType<typeof useSwipeable>;
  lastAnsweredRef: MutableRefObject<LastAnsweredRef | null>;
}

function getMilestoneMessage(pct: number): string | undefined {
  if (pct >= 75 && pct < 80) return '거의 다 왔어요! 조금만 더 하면 결과를 확인할 수 있어요';
  if (pct >= 50 && pct < 55) return '절반 완료! 흥미로운 패턴이 보이기 시작해요';
  if (pct >= 25 && pct < 30) return '벌써 1/4 완료! 당신의 강점이 드러나고 있어요';
  return undefined;
}

export function useSurveyState(): SurveyStateReturn {
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [startTime] = useState(Date.now());
  const [direction, setDirection] = useState(0);
  const lastAnsweredRef = useRef<LastAnsweredRef | null>(null);

  // Load saved answers from localStorage / DB
  useEffect(() => {
    async function loadSaved() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          setAnswers(JSON.parse(saved));
          return;
        }
        const sm = getStateManager();
        const dbAnswers = await sm.load<Record<string, number>>('surveyAnswers');
        if (dbAnswers) setAnswers(dbAnswers);
        const dbPage = await sm.load<number>('surveyPage');
        if (dbPage !== null) setCurrentPage(dbPage);
      } catch {
        // ignore
      }
    }
    loadSaved();
  }, []);

  // Auto-save to localStorage + DB
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      // ignore
    }
    const sm = getStateManager();
    sm.save('surveyAnswers', answers);
    sm.save('surveyPage', currentPage);
  }, [answers, currentPage]);

  const currentQuestions = BASIC_QUESTIONS.slice(
    currentPage * BASIC_QUESTIONS_PER_PAGE,
    (currentPage + 1) * BASIC_QUESTIONS_PER_PAGE
  );

  const totalAnswered = Object.keys(answers).length;
  const progress = (totalAnswered / BASIC_QUESTIONS.length) * 100;
  const milestoneMessage = getMilestoneMessage(progress);
  const estimatedMinutesLeft = Math.max(1, Math.ceil((BASIC_QUESTIONS.length - totalAnswered) * 5 / 60));
  const currentPageAnswered = currentQuestions.every((q) => answers[q.id] !== undefined);

  const handleAnswer = useCallback((questionId: string, value: number) => {
    setAnswers((prev) => {
      const isNewAnswer = prev[questionId] === undefined;
      lastAnsweredRef.current = { questionId, isNew: isNewAnswer };
      return { ...prev, [questionId]: value };
    });
  }, []);

  const goToPage = useCallback(
    (newPage: number) => {
      if (newPage < 0 || newPage >= BASIC_TOTAL_PAGES) return;
      setDirection(newPage > currentPage ? 1 : -1);
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [currentPage]
  );

  const handleNext = useCallback(() => {
    if (currentPage < BASIC_TOTAL_PAGES - 1) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, goToPage]);

  const handlePrev = useCallback(() => {
    if (currentPage > 0) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => currentPageAnswered && handleNext(),
    onSwipedRight: () => handlePrev(),
    trackMouse: false,
    preventScrollOnSwipe: true,
  });

  return {
    answers,
    currentPage,
    direction,
    startTime,
    totalAnswered,
    progress,
    milestoneMessage,
    estimatedMinutesLeft,
    currentPageAnswered,
    handleAnswer,
    goToPage,
    handleNext,
    handlePrev,
    swipeHandlers,
    lastAnsweredRef,
  };
}
