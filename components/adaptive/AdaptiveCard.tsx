'use client';

import React from 'react';

interface AdaptiveCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  className?: string;
}

const IS_TOSS = process.env.NEXT_PUBLIC_BUILD_TARGET === 'toss';

const tossStyles = {
  default: 'bg-white border border-tds-grey-200 rounded-xl',
  outlined: 'bg-white border border-tds-grey-200 rounded-xl',
  elevated: 'bg-white rounded-xl shadow-sm',
} as const;

const webStyles = {
  default: 'bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl',
  outlined: 'bg-transparent border border-white/10 rounded-2xl',
  elevated: 'bg-white/[0.06] backdrop-blur-md border border-white/10 rounded-2xl shadow-lg shadow-black/20',
} as const;

export function AdaptiveCard({
  children,
  variant = 'default',
  className = '',
}: AdaptiveCardProps) {
  const baseStyle = IS_TOSS ? tossStyles[variant] : webStyles[variant];

  return (
    <div className={`${baseStyle} ${className}`}>
      {children}
    </div>
  );
}
