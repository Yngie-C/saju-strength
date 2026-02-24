'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AdaptiveProgressBarProps {
  progress: number; // 0-100
  className?: string;
  /** 마일스톤 메시지 */
  milestoneMessage?: string;
}

const IS_TOSS = process.env.NEXT_PUBLIC_BUILD_TARGET === 'toss';

let TDSProgressBar: any = null;
if (IS_TOSS) {
  try {
    TDSProgressBar = require('@toss/tds-mobile').ProgressBar;
  } catch {
    // Fallback to web version
  }
}

export function AdaptiveProgressBar({
  progress,
  className = '',
  milestoneMessage,
}: AdaptiveProgressBarProps) {
  if (IS_TOSS && TDSProgressBar) {
    // TDS ProgressBar: value is 0-100
    return (
      <div className={className}>
        <TDSProgressBar value={progress} />
        {milestoneMessage && (
          <p className="text-xs text-blue-500 font-medium mt-1.5 text-center animate-pulse">
            {milestoneMessage}
          </p>
        )}
      </div>
    );
  }

  if (IS_TOSS && !TDSProgressBar) {
    // TDS unavailable — fallback plain progress bar
    return (
      <div className={className}>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        {milestoneMessage && (
          <p className="text-xs text-blue-500 font-medium mt-1.5 text-center animate-pulse">
            {milestoneMessage}
          </p>
        )}
      </div>
    );
  }

  // Web: gradient progress bar
  return (
    <div className={className}>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      {milestoneMessage && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-indigo-400 font-medium mt-1.5 text-center"
        >
          {milestoneMessage}
        </motion.p>
      )}
    </div>
  );
}
