'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BASIC_QUESTIONS, BASIC_QUESTIONS_PER_PAGE } from '@/lib/survey/questions';
import { designTokens } from '@/lib/design-tokens';
import { surveyTokens as surveyStyles } from '@/lib/section-styles';

export interface SurveyNavigationProps {
  currentPage: number;
  totalPages: number;
  isLastPage: boolean;
  allAnswered: boolean;
  currentPageAnswered: boolean;
  isSubmitting: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onGoToPage: (page: number) => void;
  answers: Record<string, number>;
}

export function SurveyNavigation({
  currentPage,
  totalPages,
  isLastPage,
  allAnswered,
  currentPageAnswered,
  isSubmitting,
  onPrev,
  onNext,
  onSubmit,
  onGoToPage,
  answers,
}: SurveyNavigationProps) {
  return (
    <div className={`${surveyStyles.bottomNav} ${designTokens.pagePadding} py-4`}>
      {surveyStyles.bottomGradient && <div className={surveyStyles.bottomGradient} />}
      <div className="max-w-2xl mx-auto flex gap-3">
        <button
          onClick={onPrev}
          disabled={currentPage === 0}
          className={designTokens.navPrevButton}
        >
          <ChevronLeft className="w-5 h-5" />
          이전
        </button>

        {isLastPage ? (
          <button
            onClick={onSubmit}
            disabled={!allAnswered || isSubmitting}
            className={designTokens.navSubmitButton}
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
            onClick={onNext}
            disabled={!currentPageAnswered}
            className={designTokens.navNextButton}
          >
            다음
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Page dots */}
      <div className="flex justify-center gap-1.5 mt-3">
        {Array.from({ length: totalPages }).map((_, i) => {
          const pageAnswered = BASIC_QUESTIONS.slice(
            i * BASIC_QUESTIONS_PER_PAGE,
            (i + 1) * BASIC_QUESTIONS_PER_PAGE
          ).every((q) => answers[q.id] !== undefined);
          return (
            <button
              key={i}
              onClick={() => onGoToPage(i)}
              className={[
                'transition-all duration-200',
                i === currentPage
                  ? designTokens.dotActiveCurrent
                  : pageAnswered
                  ? surveyStyles.dotCompleted
                  : surveyStyles.dotPending,
              ].join(' ')}
              aria-label={`${i + 1}페이지로 이동`}
            />
          );
        })}
      </div>
    </div>
  );
}
