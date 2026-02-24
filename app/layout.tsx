import type { Metadata } from "next";
import { cn } from '@/lib/utils';
import "./globals.css";
import { TDSProvider } from '@/components/adaptive/TDSProvider';

const IS_TOSS = process.env.NEXT_PUBLIC_BUILD_TARGET === 'toss';

export const metadata: Metadata = {
  title: "사주강점 - 타고난 기질 x 현재 강점",
  description: "사주 오행과 심리측정 설문을 결합한 나만의 강점 분석 리포트",
  openGraph: {
    title: "사주강점 - 타고난 기질 x 현재 강점 = 당신만의 성장 지도",
    description: "사주 오행 분석과 Big5 기반 강점 설문으로 선천적 기질과 후천적 강점을 교차 분석합니다.",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={cn("font-sans", IS_TOSS && "tds-theme")}
        style={{ fontFamily: "'PretendardVariable', 'Inter', system-ui, sans-serif" }}
      >
        <TDSProvider>
          {children}
        </TDSProvider>
      </body>
    </html>
  );
}
