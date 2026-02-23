import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2",
  display: "swap",
  variable: "--font-pretendard",
  weight: "45 920",
});

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
      <body className={`${inter.variable} ${pretendard.variable} font-sans`}>{children}</body>
    </html>
  );
}
