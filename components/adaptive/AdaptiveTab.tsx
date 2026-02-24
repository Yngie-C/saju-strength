'use client';

import React, { useState } from 'react';

interface TabItem {
  value: string;
  label: string;
}

interface AdaptiveTabProps {
  tabs: TabItem[];
  value: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'lg';
  className?: string;
}

const IS_TOSS = process.env.NEXT_PUBLIC_BUILD_TARGET === 'toss';

export function AdaptiveTab({
  tabs,
  value,
  onChange,
  size = 'lg',
  className = '',
}: AdaptiveTabProps) {
  if (IS_TOSS) {
    return (
      <div className={`flex border-b border-tds-grey-200 ${className}`}>
        {tabs.map((tab) => {
          const isActive = tab.value === value;
          return (
            <button
              key={tab.value}
              onClick={() => onChange(tab.value)}
              className={`flex-1 pb-3 transition-colors border-b-2 font-semibold ${
                size === 'lg' ? 'text-t4 pt-2' : 'text-st12 pt-1'
              } ${
                isActive
                  ? 'border-tds-grey-800 text-tds-grey-800'
                  : 'border-transparent text-tds-grey-600'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    );
  }

  // Web: pill-style tabs
  return (
    <div className={`flex gap-1 bg-white/5 rounded-xl p-1 ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.value === value;
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`flex-1 py-2 text-sm rounded-lg transition-all ${
              isActive
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
