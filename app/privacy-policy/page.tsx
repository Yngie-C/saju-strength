const IS_TOSS = process.env.NEXT_PUBLIC_BUILD_TARGET === 'toss';

import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { designTokens } from '@/lib/design-tokens';

const styles = IS_TOSS ? {
  page: 'min-h-screen bg-white',
  container: 'px-6 py-8',
  title: 'text-t2 font-bold text-tds-grey-900',
  body: 'text-st8 text-tds-grey-700 leading-relaxed',
  heading: 'text-t5 font-semibold text-tds-grey-900',
} : {
  page: 'min-h-screen bg-background',
  container: 'px-4 py-12 max-w-2xl mx-auto',
  title: 'text-3xl font-bold text-foreground',
  body: 'text-sm text-muted-foreground leading-relaxed',
  heading: 'text-lg font-semibold text-foreground',
} as const;

export const metadata: Metadata = {
  title: '개인정보 처리방침 - 사주강점',
  description: '사주강점 서비스의 개인정보 처리방침입니다.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className={`${styles.page} ${IS_TOSS ? 'text-tds-grey-900' : 'text-foreground'}`}>
      <div className={`${styles.container} space-y-8`}>
        {/* 뒤로가기 */}
        <Link
          href="/birth-info"
          className={`inline-flex items-center gap-2 text-sm transition-colors ${IS_TOSS ? 'text-tds-grey-500 hover:text-tds-grey-700' : 'text-muted-foreground/50 hover:text-muted-foreground'}`}
        >
          <ArrowLeft size={16} />
          돌아가기
        </Link>

        {/* 제목 */}
        <div className="space-y-2">
          <h1 className={styles.title}>개인정보 처리방침</h1>
          <p className={`text-sm ${IS_TOSS ? 'text-tds-grey-400' : 'text-muted-foreground/40'}`}>시행일: 2026년 2월 24일</p>
        </div>

        {/* 본문 */}
        <div className={`space-y-8 ${styles.body}`}>
          <section className="space-y-3">
            <h2 className={styles.heading}>1. 수집하는 개인정보 항목</h2>
            <p>사주강점 서비스는 다음의 개인정보를 수집합니다.</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>생년월일시 (년, 월, 일, 시)</li>
              <li>성별</li>
              <li>양음력 구분 여부</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className={styles.heading}>2. 개인정보의 수집 및 이용 목적</h2>
            <p>수집한 개인정보는 다음의 목적으로만 이용됩니다.</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>사주 오행 분석 서비스 제공</li>
              <li>Big5 기반 강점 분석 및 교차 분석 리포트 생성</li>
              <li>서비스 개선 및 통계 분석 (비식별화 처리 후)</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className={styles.heading}>3. 개인정보의 보유 및 이용 기간</h2>
            <p>
              수집된 개인정보는 수집 목적이 달성된 후 지체 없이 파기합니다.
              단, 이용자가 서비스를 탈퇴하거나 삭제를 요청하는 경우 즉시 파기합니다.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className={styles.heading}>4. 개인정보의 제3자 제공</h2>
            <p>
              사주강점은 이용자의 개인정보를 제3자에게 제공하지 않습니다.
              단, 법률에 의해 요구되는 경우는 예외로 합니다.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className={styles.heading}>5. 이용자의 권리</h2>
            <p>이용자는 다음의 권리를 행사할 수 있습니다.</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>개인정보 열람 요청</li>
              <li>개인정보 수정 요청</li>
              <li>개인정보 삭제 요청</li>
              <li>개인정보 처리 정지 요청</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className={styles.heading}>6. 개인정보 보호책임자</h2>
            <p>
              개인정보 보호책임자에게 문의사항이 있으시면 아래 연락처로 문의해 주세요.
            </p>
            <p className={IS_TOSS ? 'text-tds-grey-500' : 'text-muted-foreground/50'}>이메일: privacy@saju-strength.com</p>
          </section>

          <section className="space-y-3">
            <h2 className={styles.heading}>7. 면책 조항</h2>
            <p>
              본 서비스는 동양 전통 기질 분석과 현대 강점 진단의 융합 서비스이며,
              재미와 자기 이해를 위한 도구입니다.
              의학적, 심리학적, 또는 전문적 진단을 대체하지 않습니다.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className={styles.heading}>8. 개인정보 처리방침의 변경</h2>
            <p>
              이 개인정보 처리방침은 법률이나 서비스의 변경 사항을 반영하기 위해
              수정될 수 있습니다. 변경 시 서비스 내 공지를 통해 안내합니다.
            </p>
          </section>
        </div>

        {/* 하단 */}
        <div className={`border-t pt-6 ${IS_TOSS ? 'border-tds-grey-200' : 'border-border'}`}>
          <Link
            href="/birth-info"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/20 text-primary font-medium text-sm hover:bg-primary/30 transition-colors"
          >
            <ArrowLeft size={16} />
            돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}
