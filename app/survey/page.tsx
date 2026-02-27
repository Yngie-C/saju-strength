'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';
import { BASIC_QUESTIONS, BASIC_QUESTIONS_PER_PAGE, BASIC_TOTAL_PAGES } from '@/lib/survey/questions';
import { AdaptiveProgressBar } from '@/components/adaptive';
import { designTokens } from '@/lib/design-tokens';
import { surveyTokens as surveyStyles } from '@/lib/section-styles';
import { useSurveyState } from '@/hooks/useSurveyState';
import { useSurveyScroll } from '@/hooks/useSurveyScroll';
import { useSurveySubmit } from '@/hooks/useSurveySubmit';
import { SurveyQuestionCard } from '@/components/survey/SurveyQuestionCard';
import { SurveyNavigation } from '@/components/survey/SurveyNavigation';

export default function SurveyPage() {
  const router = useRouter();

  const {
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
  } = useSurveyState();

  const { currentPageRefs, getFirstUnansweredIndex } = useSurveyScroll(answers, currentPage, lastAnsweredRef);
  const { handleSubmit, isSubmitting } = useSurveySubmit(answers, startTime, router);

  const currentQuestions = BASIC_QUESTIONS.slice(
    currentPage * BASIC_QUESTIONS_PER_PAGE,
    (currentPage + 1) * BASIC_QUESTIONS_PER_PAGE
  );

  const isLastPage = currentPage === BASIC_TOTAL_PAGES - 1;
  const allAnswered = BASIC_QUESTIONS.every((q) => answers[q.id] !== undefined);

  return (
    <div className={surveyStyles.page}>
      {/* Header */}
      <div className={surveyStyles.header}>
        <div className={`max-w-2xl mx-auto ${designTokens.pagePadding} py-3`}>
          <div className="flex items-center justify-between mb-2">
            <div className={`flex items-center gap-2 text-sm ${surveyStyles.caption}`}>
              <Clock className="w-4 h-4" />
              <span>남은 시간: 약 {estimatedMinutesLeft}분</span>
            </div>
            <span className={`text-sm ${surveyStyles.caption}`}>
              {totalAnswered} / {BASIC_QUESTIONS.length} 완료
            </span>
          </div>
          <AdaptiveProgressBar progress={progress} milestoneMessage={milestoneMessage} />
          <div className="flex justify-between mt-1">
            <span className={surveyStyles.caption}>
              {currentPage + 1} / {BASIC_TOTAL_PAGES} 페이지
            </span>
            <span className={designTokens.progressAccent}>
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`max-w-2xl mx-auto ${surveyStyles.container}`} {...swipeHandlers}>
        <div className="mb-6 text-center">
          <h1 className={designTokens.headingXl}>
            강점 역량 설문 (PSA)
          </h1>
          <p className={`mt-1 ${surveyStyles.bodyText}`}>
            각 문항을 읽고 본인과 얼마나 일치하는지 선택해 주세요
          </p>
        </div>

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
              const globalIndex = currentPage * BASIC_QUESTIONS_PER_PAGE + idx;
              const firstUnansweredIndex = getFirstUnansweredIndex();
              const selectedValue = answers[question.id];
              const isDisabled = selectedValue === undefined && globalIndex > firstUnansweredIndex;

              return (
                <SurveyQuestionCard
                  key={question.id}
                  question={question}
                  globalIdx={globalIdx}
                  selectedValue={selectedValue}
                  isDisabled={isDisabled}
                  onAnswer={handleAnswer}
                  refCallback={(el) => { currentPageRefs.current[idx] = el; }}
                />
              );
            })}
          </motion.div>
        </AnimatePresence>

        <p className={`text-center mt-4 ${surveyStyles.caption}`}>
          좌우로 스와이프하거나 버튼을 눌러 이동하세요
        </p>
      </div>

      <SurveyNavigation
        currentPage={currentPage}
        totalPages={BASIC_TOTAL_PAGES}
        isLastPage={isLastPage}
        allAnswered={allAnswered}
        currentPageAnswered={currentPageAnswered}
        isSubmitting={isSubmitting}
        onPrev={handlePrev}
        onNext={handleNext}
        onSubmit={handleSubmit}
        onGoToPage={goToPage}
        answers={answers}
      />
    </div>
  );
}
