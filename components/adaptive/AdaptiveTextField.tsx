'use client';

import React from 'react';
import { useAdaptiveLoader } from '@/hooks/useAdaptiveLoader';

interface AdaptiveTextFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  type?: string;
  disabled?: boolean;
  className?: string;
}

export function AdaptiveTextField({
  value,
  onChange,
  placeholder,
  label,
  type = 'text',
  disabled,
  className = '',
}: AdaptiveTextFieldProps) {
  const [isToss, TDSTextField] = useAdaptiveLoader(() => require('@toss/tds-mobile').TextField);

  if (isToss && TDSTextField) {
    return (
      <TDSTextField
        label={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        disabled={disabled}
        className={className}
      />
    );
  }

  if (isToss) return (
      <div className={className}>
        {label && (
          <label className="block text-st10 font-medium text-tds-grey-700 mb-1.5">{label}</label>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-3 rounded-[14px] border border-tds-grey-200 bg-tds-grey-50 text-tds-grey-900 text-st8 placeholder:text-tds-grey-500 focus:outline-none focus:border-tds-blue-500 focus:ring-1 focus:ring-tds-blue-500 caret-tds-blue-500 transition-colors disabled:opacity-40"
        />
      </div>
    );

  // Web: styled input
  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-white/70 mb-1.5">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
      />
    </div>
  );
}
