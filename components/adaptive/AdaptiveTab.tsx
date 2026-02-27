'use client';

import React from 'react';
import { designTokens } from '@/lib/design-tokens';

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

export function AdaptiveTab({
  tabs,
  value,
  onChange,
  size = 'lg',
  className = '',
}: AdaptiveTabProps) {
  const sizeClass = size === 'lg' ? designTokens.tabSizeLg : designTokens.tabSizeSm;

  return (
    <div className={`${designTokens.tabContainer} ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.value === value;
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`${designTokens.tabItemBase} ${sizeClass} ${
              isActive ? designTokens.tabItemActive : designTokens.tabItemInactive
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
