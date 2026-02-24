'use client';

import React from 'react';

interface AdaptiveCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  className?: string;
}

const IS_TOSS = process.env.NEXT_PUBLIC_BUILD_TARGET === 'toss';

let TDSCheckbox: any = null;
if (IS_TOSS) {
  try {
    TDSCheckbox = require(/* webpackIgnore: true */ '@toss/tds-mobile').Checkbox;
  } catch {
    // Fallback to web version
  }
}

export function AdaptiveCheckbox({
  checked,
  onChange,
  label,
  description,
  className = '',
}: AdaptiveCheckboxProps) {
  if (IS_TOSS && TDSCheckbox) {
    // TDS Checkbox: isChecked + onChangeChecked
    return (
      <TDSCheckbox
        isChecked={checked}
        onChangeChecked={onChange}
        label={label}
        description={description}
        className={className}
      />
    );
  }

  if (IS_TOSS && !TDSCheckbox) {
    return (
      <label className={`flex items-start gap-3 cursor-pointer ${className}`}>
        <span
          role="checkbox"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
            checked
              ? 'bg-tds-blue-500 border-tds-blue-500'
              : 'border-tds-grey-300 bg-white'
          }`}
        >
          {checked && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </span>
        <div>
          <span className="text-st8 font-medium text-tds-grey-900">{label}</span>
          {description && <p className="text-st11 text-tds-grey-600 mt-1">{description}</p>}
        </div>
      </label>
    );
  }

  // Web: custom dark-theme checkbox
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
          checked
            ? 'bg-primary border-primary'
            : 'border-white/30 hover:border-white/50'
        }`}
      >
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      <div>
        <span className="text-sm font-medium text-white">{label}</span>
        {description && <p className="text-xs text-white/40 mt-1">{description}</p>}
      </div>
    </div>
  );
}
