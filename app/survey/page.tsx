'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { SURVEY_QUESTIONS, QUESTIONS_PER_PAGE, TOTAL_PAGES } from '@/lib/survey-questions';
import { SurveyAnswer } from '@/types/survey';

const STORAGE_KEY = 'saju-survey-answers';
const RESULT_STORAGE_KEY = 'saju-survey-result';
const SESSION_ID_KEY = 'saju-session-id';

const LIKERT_LABELS: Record<number, string> = {
  1: '전혀 아님',
  4: '보통',
  7: '매우 그렇다',
};

export default function SurveyPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime] = useState(Date.now());
  const [direction, setDirection] = useState(0);

  // Load saved answers from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setAnswers(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      // ignore
    }
  }, [answers]);

  const currentQuestions = SURVEY_QUESTIONS.slice(
    currentPage * QUESTIONS_PER_PAGE,
    (currentPage + 1) * QUESTIONS_PER_PAGE
  );

  const totalAnswered = Object.keys(answers).length;
  const progress = (totalAnswered / SURVEY_QUESTIONS.length) * 100;

  const currentPageAnswered = currentQuestions.every((q) => answers[q.id] !== undefined);

  const handleAnswer = useCallback((questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const goToPage = useCallback(
    (newPage: number) => {
      if (newPage < 0 || newPage >= TOTAL_PAGES) return;
      setDirection(newPage > currentPage ? 1 : -1);
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [currentPage]
  );

  const handleNext = useCallback(() => {
    if (currentPage < TOTAL_PAGES - 1) {
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

  const handleSubmit = async () => {
    const allAnswered = SURVEY_QUESTIONS.every((q) => answers[q.id] !== undefined);
    if (!allAnswered) {
      alert('모든 문항에 응답해 주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const sessionId =
        sessionStorage.getItem(SESSION_ID_KEY) ||
        `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;

      const formattedAnswers: SurveyAnswer[] = SURVEY_QUESTIONS.map((q) => ({
        questionId: q.id,
        questionNumber: q.questionNumber,
        category: q.category,
        score: answers[q.id],
      }));

      const completionTimeSeconds = Math.round((Date.now() - startTime) / 1000);

      const response = await fetch('/api/survey/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          answers: formattedAnswers,
          completionTimeSeconds,
        }),
      });

      if (!response.ok) {
        throw new Error('제출 실패');
      }

      const result = await response.json();

      sessionStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(result));
      localStorage.removeItem(STORAGE_KEY);

      router.push('/result');
    } catch (error) {
      console.error('Survey submit error:', error);
      alert('제출 중 오류가 발생했습니다. 다시 시도해 주세요.');
      setIsSubmitting(false);
    }
  };

  const isLastPage = currentPage === TOTAL_PAGES - 1;
  const allAnswered = SURVEY_QUESTIONS.every((q) => answers[q.id] !== undefined);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Clock className="w-4 h-4" />
              <span>약 5분 소요</span>
            </div>
            <span className="text-slate-400 text-sm">
              {totalAnswered} / {SURVEY_QUESTIONS.length} 완료
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-slate-500">
              {currentPage + 1} / {TOTAL_PAGES} 페이지
            </span>
            <span className="text-xs text-indigo-400 font-medium">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-2xl mx-auto px-4 py-6 pb-32" {...swipeHandlers}>
        {/* Page title */}
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold text-white">
            강점 역량 설문 (PSA)
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            각 문항을 읽고 본인과 얼마나 일치하는지 선택해 주세요
          </p>
        </div>

        {/* Questions */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="space-y-4"
          >
            {currentQuestions.map((question, idx) => {
              const globalIdx = currentPage * QUESTIONS_PER_PAGE + idx + 1;
              const selectedValue = answers[question.id];

              return (
                <div
                  key={question.id}
                  className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-lg"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold flex items-center justify-center">
                      {globalIdx}
                    </span>
                    <p className="text-slate-800 font-medium leading-relaxed text-sm sm:text-base">
                      {question.questionText}
                    </p>
                  </div>

                  {/* Likert scale */}
                  <div className="space-y-2">
                    {/* Labels */}
                    <div className="flex justify-between text-xs text-slate-500 px-1">
                      <span>전혀 아님</span>
                      <span>보통</span>
                      <span>매우 그렇다</span>
                    </div>
                    {/* Buttons */}
                    <div className="flex justify-between gap-1">
                      {[1, 2, 3, 4, 5, 6, 7].map((value) => {
                        const isSelected = selectedValue === value;
                        return (
                          <button
                            key={value}
                            onClick={() => handleAnswer(question.id, value)}
                            className={[
                              'flex-1 min-w-[36px] min-h-[44px] rounded-full flex items-center justify-center',
                              'text-sm font-bold transition-all duration-200',
                              isSelected
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white ring-4 ring-indigo-300 scale-110 shadow-lg'
                                : 'bg-gray-100 border-2 border-gray-300 text-gray-600 hover:border-indigo-400 hover:bg-indigo-50 active:scale-95',
                            ].join(' ')}
                            aria-label={`${value}점${LIKERT_LABELS[value] ? ` (${LIKERT_LABELS[value]})` : ''}`}
                          >
                            {value}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Mobile swipe hint */}
        <p className="text-center text-xs text-slate-600 mt-4">
          좌우로 스와이프하거나 버튼을 눌러 이동하세요
        </p>
      </div>

      {/* Bottom navigation - fixed */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-white/10 px-4 py-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className="flex items-center gap-1 px-4 py-3 rounded-xl bg-white/10 text-white font-medium
                       disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            이전
          </button>

          {isLastPage ? (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || isSubmitting}
              className="flex-1 py-3 rounded-xl font-bold text-white transition-all duration-200
                         bg-gradient-to-r from-indigo-600 to-purple-600
                         disabled:opacity-40 disabled:cursor-not-allowed
                         hover:from-indigo-500 hover:to-purple-500 hover:shadow-lg hover:shadow-indigo-500/30
                         active:scale-[0.98]"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  분석 중...
                </span>
              ) : (
                '결과 분석하기'
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!currentPageAnswered}
              className="flex-1 flex items-center justify-center gap-1 py-3 rounded-xl font-bold text-white
                         bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-200
                         disabled:opacity-40 disabled:cursor-not-allowed
                         hover:from-indigo-500 hover:to-purple-500 hover:shadow-lg hover:shadow-indigo-500/30
                         active:scale-[0.98]"
            >
              다음
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Page dots */}
        <div className="flex justify-center gap-1.5 mt-3">
          {Array.from({ length: TOTAL_PAGES }).map((_, i) => {
            const pageAnswered = SURVEY_QUESTIONS.slice(
              i * QUESTIONS_PER_PAGE,
              (i + 1) * QUESTIONS_PER_PAGE
            ).every((q) => answers[q.id] !== undefined);
            return (
              <button
                key={i}
                onClick={() => goToPage(i)}
                className={[
                  'w-2 h-2 rounded-full transition-all duration-200',
                  i === currentPage
                    ? 'w-6 bg-indigo-400'
                    : pageAnswered
                    ? 'bg-indigo-600'
                    : 'bg-slate-600',
                ].join(' ')}
                aria-label={`${i + 1}페이지로 이동`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
