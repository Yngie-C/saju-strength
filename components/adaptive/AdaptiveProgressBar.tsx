'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAdaptiveLoader } from '@/hooks/useAdaptiveLoader';

interface AdaptiveProgressBarProps {
  progress: number; // 0-100
  className?: string;
  /** 마일스톤 메시지 */
  milestoneMessage?: string;
}

export function AdaptiveProgressBar({
  progress,
  className = '',
  milestoneMessage,
}: AdaptiveProgressBarProps) {
  const [isToss, TDSProgressBar] = useAdaptiveLoader(() => require('@toss/tds-mobile').ProgressBar);

  if (isToss && TDSProgressBar) {
    return (
      <div className={className}>
        <TDSProgressBar value={progress} />
        {milestoneMessage && (
          <p className="text-st11 text-tds-blue-500 font-medium mt-1.5 text-center animate-pulse">
            {milestoneMessage}
          </p>
        )}
      </div>
    );
  }

  if (isToss) return (
      <div className={className}>
        <div className="h-1 bg-tds-grey-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#4593fc] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        {milestoneMessage && (
          <p className="text-st11 text-tds-blue-500 font-medium mt-1.5 text-center animate-pulse">
            {milestoneMessage}
          </p>
        )}
      </div>
    );

  // Web: primary progress bar
  return (
    <div className={className}>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      {milestoneMessage && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-primary font-medium mt-1.5 text-center"
        >
          {milestoneMessage}
        </motion.p>
      )}
    </div>
  );
}
