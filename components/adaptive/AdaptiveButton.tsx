'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface AdaptiveButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit';
}

const IS_TOSS = process.env.NEXT_PUBLIC_BUILD_TARGET === 'toss';

export function AdaptiveButton({
  children,
  onClick,
  disabled,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
}: AdaptiveButtonProps) {
  const [TDSButton, setTDSButton] = useState<any>(null);

  useEffect(() => {
    if (IS_TOSS) {
      try {
        setTDSButton(() => require('@toss/tds-mobile').Button);
      } catch {
        // Fallback to web version
      }
    }
  }, []);

  if (IS_TOSS && TDSButton) {
    // TDS Button: variant maps to styleVariant, size maps to sizeVariant
    const tdsVariant = variant === 'primary' ? 'primary' : variant === 'secondary' ? 'secondary' : 'ghost';
    const tdsSize = size === 'sm' ? 'small' : size === 'lg' ? 'large' : 'medium';
    return (
      <TDSButton
        styleVariant={tdsVariant}
        sizeVariant={tdsSize}
        onClick={onClick}
        disabled={disabled}
        className={className}
      >
        {children}
      </TDSButton>
    );
  }

  if (IS_TOSS && !TDSButton) {
    const variantClass = variant === 'primary'
      ? 'bg-tds-blue-500 text-white hover:bg-tds-blue-600 active:bg-tds-blue-700'
      : variant === 'secondary'
      ? 'bg-tds-grey-100 text-tds-grey-900 hover:bg-tds-grey-200 active:bg-tds-grey-300'
      : 'bg-transparent text-tds-grey-700 hover:bg-tds-grey-100';
    const sizeClass = size === 'sm' ? 'h-10 px-4 text-st10'
      : size === 'lg' ? 'h-14 px-6 text-t5'
      : 'h-12 px-5 text-st8';
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`rounded-[14px] font-semibold transition-colors duration-100 disabled:opacity-40 disabled:cursor-not-allowed ${variantClass} ${sizeClass} ${className}`}
      >
        {children}
      </button>
    );
  }

  // Web: Shadcn Button
  const shadcnVariant = variant === 'primary' ? 'default' : variant === 'ghost' ? 'ghost' : 'outline';
  const shadcnSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default';

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      variant={shadcnVariant}
      size={shadcnSize}
      className={className}
    >
      {children}
    </Button>
  );
}
