'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { BASIC_QUESTIONS, BASIC_QUESTIONS_PER_PAGE, BASIC_TOTAL_PAGES } from '@/lib/survey-questions';
import { SurveyAnswer } from '@/types/survey';
import { apiUrl } from '@/lib/config';
import { getStateManager } from '@/lib/state-manager';
import { AdaptiveProgressBar } from '@/components/adaptive';

const STORAGE_KEY = 'saju-survey-answers';
const RESULT_STORAGE_KEY = 'psaResult';
const SESSION_ID_KEY = 'saju-session-id';

const LIKERT_LABELS: Record<number, string> = {
  1: '전혀 아님',
  4: '보통',
  7: '매우 그렇다',
};

const IS_TOSS = process.env.NEXT_PUBLIC_BUILD_TARGET === 'toss';

const styles = IS_TOSS ? {
  page: 'min-h-screen bg-white',
  // Sticky header
  header: 'sticky top-0 z-30 bg-white border-b border-tds-grey-200',
  headerTitle: 'text-t5 font-semibold text-tds-grey-900',
  // Question card
  questionCard: 'bg-tds-grey-50 rounded-xl border border-tds-grey-200 p-5',
  questionNumber: 'bg-tds-blue-50 text-tds-blue-500 rounded-full px-2.5 py-0.5 text-st11 font-medium',
  questionText: 'text-t5 font-semibold text-tds-grey-900',
  questionCategory: 'text-st11 text-tds-grey-500',
  // Likert scale buttons
  likertSelected: 'bg-tds-blue-500 text-white border-tds-blue-500 rounded-xl',
  likertUnselected: 'bg-tds-grey-100 border border-tds-grey-300 text-tds-grey-700 rounded-xl hover:bg-tds-grey-200',
  likertLabel: 'text-st11 text-tds-grey-500',
  // Bottom navigation
  bottomNav: 'fixed bottom-0 left-0 right-0 bg-white z-40',
  bottomGradient: 'h-9 bg-gradient-to-b from-transparent to-white pointer-events-none -mt-9',
  // Page dots
  dotActive: 'w-2.5 h-2.5 rounded-full bg-tds-blue-500',
  dotCompleted: 'w-2 h-2 rounded-full bg-tds-blue-200',
  dotPending: 'w-2 h-2 rounded-full bg-tds-grey-300',
  // Container
  container: 'px-6 py-4 pb-[calc(120px+env(safe-area-inset-bottom))]',
  // Misc
  bodyText: 'text-st8 text-tds-grey-700',
  caption: 'text-st11 text-tds-grey-500',
} : {
  page: 'min-h-screen bg-background',
  header: 'sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border',
  headerTitle: 'text-lg font-semibold text-foreground',
  questionCard: 'bg-card rounded-xl p-5 border border-border',
  questionNumber: 'bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-medium',
  questionText: 'text-lg font-semibold text-card-foreground',
  questionCategory: 'text-xs text-muted-foreground',
  likertSelected: 'bg-primary text-primary-foreground border-transparent rounded-[14px]',
  likertUnselected: 'bg-secondary border border-border text-secondary-foreground rounded-[14px] hover:bg-secondary/80',
  likertLabel: 'text-xs text-muted-foreground',
  bottomNav: 'fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40',
  bottomGradient: '',
  dotActive: 'w-2.5 h-2.5 rounded-full bg-primary',
  dotCompleted: 'w-2 h-2 rounded-full bg-primary/50',
  dotPending: 'w-2 h-2 rounded-full bg-muted',
  container: 'px-4 py-4 pb-32',
  bodyText: 'text-sm text-muted-foreground',
  caption: 'text-xs text-muted-foreground/50',
} as const;

export default function SurveyPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime] = useState(Date.now());
  const [direction, setDirection] = useState(0);

  // Load saved answers from localStorage / DB
  useEffect(() => {
    async function loadSaved() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          setAnswers(JSON.parse(saved));
          return;
        }
        // Fallback: try DB
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

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      // ignore
    }
    // DB persistence for toss environment
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

  const getMilestoneMessage = (pct: number): string | undefined => {
    if (pct >= 75 && pct < 80) return '거의 다 왔어요! 조금만 더 하면 결과를 확인할 수 있어요';
    if (pct >= 50 && pct < 55) return '절반 완료! 흥미로운 패턴이 보이기 시작해요';
    if (pct >= 25 && pct < 30) return '벌써 1/4 완료! 당신의 강점이 드러나고 있어요';
    return undefined;
  };

  const milestoneMessage = getMilestoneMessage(progress);

  const estimatedMinutesLeft = Math.max(1, Math.ceil((BASIC_QUESTIONS.length - totalAnswered) * 5 / 60));

  const currentPageAnswered = currentQuestions.every((q) => answers[q.id] !== undefined);

  const handleAnswer = useCallback((questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
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

  const handleSubmit = async () => {
    const allAnswered = BASIC_QUESTIONS.every((q) => answers[q.id] !== undefined);
    if (!allAnswered) {
      alert('모든 문항에 응답해 주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const sessionId =
        sessionStorage.getItem(SESSION_ID_KEY) ||
        crypto.randomUUID();
      // 생성된 sessionId를 즉시 저장 (전체 흐름에서 재사용)
      sessionStorage.setItem(SESSION_ID_KEY, sessionId);

      const formattedAnswers: SurveyAnswer[] = BASIC_QUESTIONS.map((q) => ({
        questionId: q.id,
        questionNumber: q.questionNumber,
        category: q.category,
        score: answers[q.id],
      }));

      const completionTimeSeconds = Math.round((Date.now() - startTime) / 1000);

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
        throw new Error('제출 실패');
      }

      const result = await response.json();

      sessionStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(result));
      await getStateManager().save('psaResult', result);
      localStorage.removeItem(STORAGE_KEY);
      const sm = getStateManager();
      sm.remove('surveyAnswers');
      sm.remove('surveyPage');

      router.push('/birth-info');
    } catch (error) {
      console.error('Survey submit error:', error);
      alert('제출 중 오류가 발생했습니다. 다시 시도해 주세요.');
      setIsSubmitting(false);
    }
  };

  const isLastPage = currentPage === BASIC_TOTAL_PAGES - 1;
  const allAnswered = BASIC_QUESTIONS.every((q) => answers[q.id] !== undefined);

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={`max-w-2xl mx-auto ${IS_TOSS ? 'px-6' : 'px-4'} py-3`}>
          <div className="flex items-center justify-between mb-2">
            <div className={`flex items-center gap-2 text-sm ${styles.caption}`}>
              <Clock className="w-4 h-4" />
              <span>남은 시간: 약 {estimatedMinutesLeft}분</span>
            </div>
            <span className={`text-sm ${styles.caption}`}>
              {totalAnswered} / {BASIC_QUESTIONS.length} 완료
            </span>
          </div>
          {/* Progress bar */}
          <AdaptiveProgressBar progress={progress} milestoneMessage={milestoneMessage} />
          <div className="flex justify-between mt-1">
            <span className={styles.caption}>
              {currentPage + 1} / {BASIC_TOTAL_PAGES} 페이지
            </span>
            <span className={IS_TOSS ? 'text-st11 text-tds-blue-500 font-medium' : 'text-xs text-primary font-medium'}>
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`max-w-2xl mx-auto ${styles.container}`} {...swipeHandlers}>
        {/* Page title */}
        <div className="mb-6 text-center">
          <h1 className={IS_TOSS ? 'text-t4 font-bold text-tds-grey-900' : 'text-xl font-bold text-foreground'}>
            강점 역량 설문 (PSA)
          </h1>
          <p className={`mt-1 ${styles.bodyText}`}>
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
              const globalIdx = currentPage * BASIC_QUESTIONS_PER_PAGE + idx + 1;
              const selectedValue = answers[question.id];

              return (
                <div
                  key={question.id}
                  className={IS_TOSS ? styles.questionCard : 'bg-card rounded-xl p-5 border border-border'}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <span className={`flex-shrink-0 w-7 h-7 flex items-center justify-center text-sm font-bold ${styles.questionNumber}`}>
                      {globalIdx}
                    </span>
                    <p className={IS_TOSS ? 'font-medium leading-relaxed text-sm text-tds-grey-800' : 'text-card-foreground font-medium leading-relaxed text-sm sm:text-base'}>
                      {question.questionText}
                    </p>
                  </div>

                  {/* Likert scale */}
                  <div className="space-y-2">
                    {/* Labels */}
                    <div className={`flex justify-between px-1 ${styles.likertLabel}`}>
                      <span>전혀 아님</span>
                      <span>보통</span>
                      <span>매우 그렇다</span>
                    </div>
                    {/* Buttons */}
                    <div className="flex justify-between gap-1">
                      {[1, 2, 3, 4, 5, 6, 7].map((value) => {
                        const isSelected = selectedValue === value;
                        return (
                          <motion.button
                            key={value}
                            onClick={() => handleAnswer(question.id, value)}
                            whileHover={IS_TOSS ? undefined : { scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            className={[
                              'flex-1 min-w-[36px] min-h-[44px] flex items-center justify-center',
                              'text-sm font-bold transition-all duration-200',
                              isSelected
                                ? IS_TOSS
                                  ? `${styles.likertSelected} ring-2 ring-tds-blue-300 scale-110 shadow-md`
                                  : 'bg-primary text-primary-foreground ring-4 ring-primary/30 scale-110 shadow-lg rounded-[14px]'
                                : IS_TOSS
                                  ? styles.likertUnselected
                                  : 'bg-secondary border border-border text-secondary-foreground hover:bg-secondary/80 active:scale-95 rounded-[14px]',
                            ].join(' ')}
                            aria-label={`${value}점${LIKERT_LABELS[value] ? ` (${LIKERT_LABELS[value]})` : ''}`}
                          >
                            {value}
                          </motion.button>
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
        <p className={`text-center mt-4 ${styles.caption}`}>
          좌우로 스와이프하거나 버튼을 눌러 이동하세요
        </p>
      </div>

      {/* Bottom navigation - fixed */}
      <div className={`${styles.bottomNav} ${IS_TOSS ? 'px-6' : 'px-4'} py-4`}>
        {IS_TOSS && <div className={styles.bottomGradient} />}
        <div className="max-w-2xl mx-auto flex gap-3">
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className={IS_TOSS
              ? 'flex items-center gap-1 px-4 py-3 rounded-xl bg-tds-grey-100 text-tds-grey-700 font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-tds-grey-200 transition-colors'
              : 'flex items-center gap-1 px-4 py-3 rounded-xl bg-white/10 text-white font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-colors'}
          >
            <ChevronLeft className="w-5 h-5" />
            이전
          </button>

          {isLastPage ? (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || isSubmitting}
              className={IS_TOSS
                ? 'flex-1 py-3 rounded-xl font-bold text-white transition-all duration-200 bg-tds-blue-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-tds-blue-600 active:scale-[0.98]'
                : 'flex-1 py-3 rounded-[14px] font-bold text-primary-foreground transition-all duration-200 bg-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 active:scale-[0.98]'}
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
              className={IS_TOSS
                ? 'flex-1 flex items-center justify-center gap-1 py-3 rounded-xl font-bold text-white bg-tds-blue-500 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-tds-blue-600 active:scale-[0.98]'
                : 'flex-1 flex items-center justify-center gap-1 py-3 rounded-[14px] font-bold text-primary-foreground bg-primary transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 active:scale-[0.98]'}
            >
              다음
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Page dots */}
        <div className="flex justify-center gap-1.5 mt-3">
          {Array.from({ length: BASIC_TOTAL_PAGES }).map((_, i) => {
            const pageAnswered = BASIC_QUESTIONS.slice(
              i * BASIC_QUESTIONS_PER_PAGE,
              (i + 1) * BASIC_QUESTIONS_PER_PAGE
            ).every((q) => answers[q.id] !== undefined);
            return (
              <button
                key={i}
                onClick={() => goToPage(i)}
                className={[
                  'transition-all duration-200',
                  i === currentPage
                    ? IS_TOSS ? 'w-6 h-2.5 rounded-full bg-tds-blue-500' : 'w-6 h-2 rounded-full bg-primary'
                    : pageAnswered
                    ? IS_TOSS ? styles.dotCompleted : 'w-2 h-2 rounded-full bg-primary/50'
                    : IS_TOSS ? styles.dotPending : 'w-2 h-2 rounded-full bg-muted',
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
