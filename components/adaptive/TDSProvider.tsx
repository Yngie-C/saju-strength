'use client';

import { ReactNode } from 'react';

const IS_TOSS = process.env.NEXT_PUBLIC_BUILD_TARGET === 'toss';

export function TDSProvider({ children }: { children: ReactNode }) {
  if (!IS_TOSS) {
    return <>{children}</>;
  }

  // Dynamic require for toss builds only
  try {
    const { TDSMobileAITProvider } = require(/* webpackIgnore: true */ '@toss/tds-mobile-ait');
    return <TDSMobileAITProvider>{children}</TDSMobileAITProvider>;
  } catch {
    return <>{children}</>;
  }
}
