'use client';

import React from 'react';

interface AdaptiveTextFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  type?: string;
  disabled?: boolean;
  className?: string;
}

const IS_TOSS = process.env.NEXT_PUBLIC_BUILD_TARGET === 'toss';

let TDSTextField: any = null;
if (IS_TOSS) {
  try {
    TDSTextField = require('@toss/tds-mobile').TextField;
  } catch {
    // Fallback to web version
  }
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
  if (IS_TOSS && TDSTextField) {
    // TDS TextField: onChange receives the string value directly
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

  if (IS_TOSS && !TDSTextField) {
    // TDS unavailable — fallback plain input
    return (
      <div className={className}>
        {label && <label className="block text-sm font-medium mb-1">{label}</label>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base"
        />
      </div>
    );
  }

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
