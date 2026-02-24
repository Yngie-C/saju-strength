'use client';

import { ReactNode, useEffect, useState, ComponentType } from 'react';
import { initTossApp } from '@/lib/toss';
import { initSentry } from '@/lib/sentry';

const IS_TOSS = process.env.NEXT_PUBLIC_BUILD_TARGET === 'toss';

export function TDSProvider({ children }: { children: ReactNode }) {
  const [Provider, setProvider] = useState<ComponentType<{ children: ReactNode }> | null>(null);

  useEffect(() => {
    if (IS_TOSS) {
      initTossApp();
      initSentry();
      try {
        const { TDSMobileAITProvider } = require('@toss/tds-mobile-ait');
        setProvider(() => TDSMobileAITProvider);
      } catch {
        // Module not available — fallback to plain wrapper
      }
    }
  }, []);

  if (Provider) {
    return <Provider>{children}</Provider>;
  }

  return <>{children}</>;
}
