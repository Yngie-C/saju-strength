'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * /saju-preview는 새 UX 흐름에서 제거되었습니다.
 * 기존 URL 접근 시 sessionStorage 상태 기반으로 적절한 페이지로 리디렉트합니다.
 */
export default function SajuPreviewRedirect() {
  const router = useRouter();

  useEffect(() => {
    const hasPsa = sessionStorage.getItem('psaResult');
    const hasSaju = sessionStorage.getItem('sajuResult');

    if (hasPsa && hasSaju) {
      router.replace('/result');
    } else if (hasPsa) {
      router.replace('/birth-info');
    } else {
      router.replace('/survey');
    }
  }, [router]);

  return null;
}
