'use client';

import { motion } from 'framer-motion';
import { SurveyQuestion } from '@/types/survey';
import { LIKERT_LABELS, designTokens } from '@/lib/design-tokens';
import { surveyTokens as surveyStyles } from '@/lib/section-styles';

export interface SurveyQuestionCardProps {
  question: SurveyQuestion;
  globalIdx: number;
  selectedValue: number | undefined;
  isDisabled: boolean;
  onAnswer: (questionId: string, value: number) => void;
  refCallback: (el: HTMLDivElement | null) => void;
}

export function SurveyQuestionCard({
  question,
  globalIdx,
  selectedValue,
  isDisabled,
  onAnswer,
  refCallback,
}: SurveyQuestionCardProps) {
  return (
    <div
      ref={refCallback}
      className={`${surveyStyles.questionCard} transition-opacity duration-300 ${
        isDisabled ? 'opacity-40' : 'opacity-100'
      }`}
      style={{ scrollMarginTop: '120px', scrollMarginBottom: '140px' }}
    >
      <div className="flex items-start gap-3 mb-4">
        <span className={`flex-shrink-0 w-7 h-7 flex items-center justify-center text-sm font-bold ${surveyStyles.questionNumber}`}>
          {globalIdx}
        </span>
        <p className={designTokens.questionCardText}>
          {question.questionText}
        </p>
      </div>

      {/* Likert scale */}
      <div className="space-y-2">
        {/* Labels */}
        <div className={`flex justify-between px-1 ${surveyStyles.likertLabel}`}>
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
                onClick={() => onAnswer(question.id, value)}
                disabled={isDisabled}
                aria-disabled={isDisabled}
                tabIndex={isDisabled ? -1 : 0}
                whileHover={designTokens.hoverScale ? { scale: isDisabled ? 1 : 1.02 } : undefined}
                whileTap={isDisabled ? undefined : { scale: 0.95 }}
                className={[
                  'flex-1 min-w-[36px] min-h-[44px] flex items-center justify-center',
                  'text-sm font-bold transition-all duration-200',
                  isDisabled ? 'cursor-not-allowed' : '',
                  isSelected
                    ? `${surveyStyles.likertSelected} ${designTokens.likertSelectedRing}`
                    : surveyStyles.likertUnselected,
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
}
