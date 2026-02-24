'use client';

import React from 'react';
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

let TDSButton: any = null;
if (IS_TOSS) {
  try {
    TDSButton = require('@toss/tds-mobile').Button;
  } catch {
    // Fallback to web version
  }
}

export function AdaptiveButton({
  children,
  onClick,
  disabled,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
}: AdaptiveButtonProps) {
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
    // TDS unavailable — fallback plain button
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`tds-button tds-button--${variant} tds-button--${size} ${className}`}
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
