'use client';

import React from 'react';
import { designTokens } from '@/lib/design-tokens';

interface AdaptiveCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  className?: string;
}

// variant → designToken mapping
// 'default'  uses cardBg   (bg + border, both platforms)
// 'outlined' uses cardBgAlt (subdued bg + border, both platforms)
// 'elevated' uses glassBg  (shadow on toss, border on web)
const variantToken = {
  default: 'cardBg',
  outlined: 'cardBgAlt',
  elevated: 'glassBg',
} as const satisfies Record<string, keyof typeof designTokens>;

export function AdaptiveCard({
  children,
  variant = 'default',
  className = '',
}: AdaptiveCardProps) {
  const baseStyle = `${designTokens[variantToken[variant]]} ${designTokens.cardRadius}`;

  return (
    <div className={`${baseStyle} ${className}`}>
      {children}
    </div>
  );
}
