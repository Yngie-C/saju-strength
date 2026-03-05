'use client';

import { IS_TOSS } from '@/lib/platform';
import { useNetworkStatus } from '@/lib/hooks/useNetworkStatus';

export function OfflineBanner() {
  const { isOnline } = useNetworkStatus();

  if (isOnline) return null;

  const bannerClass = IS_TOSS
    ? 'bg-tds-red-50 text-tds-red-500 border-b border-tds-red-200'
    : 'bg-destructive/10 text-destructive border-b border-destructive/20';

  return (
    <div className={`fixed top-0 left-0 z-50 w-full px-4 py-2 text-center text-sm font-medium ${bannerClass}`}>
      인터넷 연결이 끊겼어요. 연결을 확인해 주세요
    </div>
  );
}
